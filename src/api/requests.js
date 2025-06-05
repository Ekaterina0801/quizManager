import { agent, tokenPlugin } from './agent'

const API_BASE_URL = 'http://localhost:8080/api'
export const requests = {
  get: (url, config = {}) => {
    const req = agent
      .get(`${API_BASE_URL}${url}`)
      .use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : res.body
    )
  },

  post: (url, body, config = {}) => {
    const req = agent
      .post(`${API_BASE_URL}${url}`)
      .send(body)
      .use(tokenPlugin)

    // если нужно слить allowEmpty
    if (config.allowEmpty) {
      // custom parser: если тело пустое — возвращать {}
      req.parse((res, cb) => {
        let data = ''
        res.setEncoding('utf8')
        res.on('data', chunk => (data += chunk))
        res.on('end', () => {
          if (!data) return cb(null, {})      // пустой ответ → пустой объект
          try {
            cb(null, JSON.parse(data))
          } catch (e) {
            cb(e)
          }
        })
      })
    }

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : res.body
    )
  },

  put: (url, body, config = {}) => {
    const req = agent
      .put(`${API_BASE_URL}${url}`)
      .send(body)
      .use(tokenPlugin)
    if (config.responseType === 'blob') {
      req.responseType('blob')
    }
    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : res.body
    )
  },

  delete: (url, config = {}) => {
    const req = agent
      .del(`${API_BASE_URL}${url}`)
      .use(tokenPlugin)
    if (config.responseType === 'blob') {
      req.responseType('blob')
    }
    return req.then(res =>
      config.responseType === 'blob' ? res.xhr.response : res.body
    )
  },
}