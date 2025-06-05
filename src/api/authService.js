// src/api/authService.js
import { requests } from './requests'

const BASE = '/auth'

const AuthService = {
  /**
   * Регистрация
   * @param {{ username: string, email: string, fullname: string, password: string }} data
   * @returns {Promise<JwtAuthenticationResponse>}
   */
  signUp(data) {
    return requests.post(`${BASE}/sign-up`, data)
  },

  /**
   * Вход
   * @param {{ username: string, password: string }} data
   * @returns {Promise<JwtAuthenticationResponse>}
   */
  signIn(data) {
    return requests.post(`${BASE}/sign-in`, data)
  },

  /**
   * Обновление access-токена
   * @param {{ refreshToken: string }} data
   * @returns {Promise<JwtAuthenticationResponse>}
   */
  refresh(data) {
    return requests.post(`${BASE}/refresh`, data)
  },
}

export default AuthService
