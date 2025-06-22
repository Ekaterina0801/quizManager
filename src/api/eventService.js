import { requests } from "./requests";

const BASE = "/events";

const EventService = {

  
  /** Получить все события */
  getAllEvents() {
    return requests.get(`${BASE}`);
  },

  fetchEvents({ teamId, page, size, sort, search }) {
    const params = new URLSearchParams({
      teamId,
      page,
      size,
      sort,
    });
    if (search) params.append("search", search);
    return requests.get(`${BASE}?${params.toString()}`);
  },

  /** Получить детали одного события */
  getEventById(eventId) {
    return requests.get(`${BASE}/${eventId}`);
  },

  /**
   * Создать событие.
   * @param {FormData} formData — поля и файлы (если есть) в FormData
   */
  async createEvent(userId, teamId, data) {
    const fd = new FormData()
    fd.append('name', data.title)
    fd.append('dateTime', `${data.date}T${data.time}:00`)
    fd.append('location', data.location)
    if (data.description) fd.append('description', data.description)
    fd.append('teamId', teamId)
    fd.append('userId', userId)
    fd.append('isRegistrationOpen', 'true')
    fd.append('isHidden', data.isHidden ? 'true' : 'false')
    if (data.linkToAlbum) fd.append('linkToAlbum', data.linkToAlbum)
    if (data.teamResult) fd.append('teamResult', data.teamResult)
    if (data.price) fd.append('price', data.price)
    //console.log("fd", fd)
    if (data.posterFile) fd.append('imageFile', data.posterFile)
    for (let [key, value] of fd.entries()) {
  console.log(`${key}: ${value}`)
}

    // передаём флаг allowEmpty, чтобы requests.post не лез в JSON.parse пустого тела
    return requests.post(BASE, fd, { allowEmpty: true })
  },


  /**
   * Обновить событие.
   * @param {number|string} eventId
   * @param {FormData} formData
   */
  updateEvent(eventId, formData) {
    return requests.put(
      `${BASE}/${eventId}`,
      formData,
      { 
        // multipart/form-data
        type: "form",
        // не пытаться JSON.parse пустой ответ
        allowEmpty: true
      }
    );
  },

  /**
   * Удалить событие.
   * @param {number|string} eventId
   * @param {number|string} userId — тот, кто удаляет (контроллер ожидает ?userId=…)
   */
  deleteEvent(eventId, userId) {
    // просто в URL добавляем query-параметр
    return requests.delete(`${BASE}/${eventId}?userId=${userId}`);
  },

  /**
   * Зарегистрироваться на событие.
   * @param {number|string} eventId
   * @param {{ userId: number, fullName: string }} registrationData
   */
  registerForEvent(eventId, registrationData) {
    return requests.post(
      `${BASE}/${eventId}/register`,
      registrationData,
      {
        // Разрешаем пустой ответ
        allowEmpty: true
      }
    );
  },

  /**
   * Отписаться от события.
   * @param {number|string} eventId
   * @param {number|string} registrationId
   * @param {number|string} userId
   */
  unregisterFromEvent(eventId, registrationId, userId) {
    // контроллер ожидает ?registrationId=…&userId=…
    return requests.post(
      `${BASE}/${eventId}/unregister?registrationId=${registrationId}&userId=${userId}`
    );
  },
};

export default EventService;
