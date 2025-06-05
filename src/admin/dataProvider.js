import { fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import commonStore from '../store/commonStore';
// src/admin/dataProvider.tsx
import { stringify } from 'query-string'
import teamStore from '../store/teamStore';
import { BACKEND_URL } from '../api/apiConfig';
const API_URL = BACKEND_URL

// Базовый httpClient, который добавляет Authorization: Bearer <token>
const httpClient = (url, options = {}) => {
  const token = commonStore.token
  if (token) {
    options.user = {
      authenticated: true,
      token: `Bearer ${token}`,
    }
  }
  return fetchUtils.fetchJson(url, options)
}

const baseProvider = simpleRestProvider(API_URL, httpClient)

export default {
  ...baseProvider,

  /**
   * Переопределяем только getList для ресурса 'events'. Для остальных ресурсов
   * вызываем обычный baseProvider.getList.
   */
  getList: async (resource, params) => {
    // Если не нужный ресурс, делаем просто базовый вызов:
    if (resource !== 'events') {
      return baseProvider.getList(resource, params)
    }

    // === Распаковываем pagination / sort / filter из параметров React Admin ===
    // params.pagination: { page: 1, perPage: 10 }
    // params.sort: { field: 'dateTime', order: 'DESC' }
    // params.filter: { teamId: 123, search: 'текстовый фильтр' }
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const filter = params.filter || {}

    // Преобразуем 1-based page в 0-based
    const pageZeroBased = Math.max(0, page - 1)
    const size = perPage

    // Сортировка: e.g. "dateTime,DESC" или "dateTime,ASC"
    const sortParam = `${field},${order}`

    // Обязательно передаём teamId в запросе
    // (можно брать из filter.teamId или, если вы храните его отдельно, из teamStore.selected?.id)
    const teamId = filter.teamId ?? teamStore.selected?.id
    if (!teamId) {
      throw new Error('Для ресурса events параметр teamId обязателен')
    }

    // Поиск (search) – опционально
    const search = filter.search

    // Собираем query-параметры
    const query = {
      teamId: teamId,
      page: pageZeroBased,
      size: size,
      sort: sortParam,
    }
    if (search) {
      query.search = search
    }

    // Строим URL: /api/events?teamId=123&page=0&size=10&sort=dateTime,DESC&search=foobar
    const url = `${API_URL}/${resource}?${stringify(query)}`

    // Выполняем HTTP-запрос
    const { json, headers } = await httpClient(url)

    // Ожидаем, что заголовок Content-Range будет вида "events {from}-{to}/{total}"
    // Например: "events 0-9/237"
    const contentRange = headers.get('Content-Range')
    if (!contentRange) {
      throw new Error(
        'Отсутствует заголовок Content-Range в ответе сервера. ' +
        'Проверьте, что бэкенд-интерфейс возвращает его корректно.'
      )
    }

    // Парсим общее число результатов из "events {from}-{to}/{total}"
    // Надо взять то, что после слеша:
    //    const total = parseInt(contentRange.split('/').pop(), 10)
    const parts = contentRange.split('/')
    const total = parseInt(parts[parts.length - 1], 10)

    // Возвращаем в формате, который ждёт React-Admin:
    return {
      data: json,   // это массив EventResponseDto
      total: total, // общее число всех элементов
    }
  },
}
