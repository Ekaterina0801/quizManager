import { agent, tokenPlugin } from './agent'

const API_BASE_URL = 'http://46.149.66.58:8080/api'
//const API_BASE_URL = 'http://localhost:8080/api'
function isFormData(body) {
  return typeof FormData !== 'undefined' && body instanceof FormData
}

function safeParseResponse(res, allowEmpty = false) {
  const text = res.text?.trim()

  if (!text && allowEmpty) return null

  try {
    return JSON.parse(text)
  } catch (err) {
    if (allowEmpty && res.status >= 200 && res.status < 300) {
      return null
    }
    throw err
  }
}

export const requests = {
  get: (url, config = {}) => {
    const req = agent.get(`${API_BASE_URL}${url}`).use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : safeParseResponse(res, config.allowEmpty)
    )
  },

  post: (url, body, config = {}) => {
    const req = agent.post(`${API_BASE_URL}${url}`).use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    if (isFormData(body)) {
      req.send(body)
      // не устанавливаем type('form') — это ломает boundary
    } else {
      req.send(body)
    }

    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : safeParseResponse(res, config.allowEmpty)
    )
  },

  put: (url, body, config = {}) => {
    const req = agent.put(`${API_BASE_URL}${url}`).use(tokenPlugin).send(body)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : safeParseResponse(res, config.allowEmpty)
    )
  },

  delete: (url, config = {}) => {
    const req = agent.del(`${API_BASE_URL}${url}`).use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : safeParseResponse(res, config.allowEmpty)
    )
  },
}
