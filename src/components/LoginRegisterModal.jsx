import React, { useState } from 'react'
import commonStore from '../store/commonStore'
import userStore from '../store/userStore';
import { observer } from 'mobx-react-lite'
export default observer(function LoginRegisterModal({ show, onSuccess }) {
  const [mode, setMode]       = useState("login");   // "login" или "register"
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  if (!show) return null;

  const switchMode = next => () => {
    setMode(next);
    setError(null);
    setUsername(""); setFullname(""); setEmail(""); setPassword(""); setConfirm("");
  };

  const handleAuth = async e => {
    e.preventDefault();
    setError(null);
    if (mode === "register" && password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      let user;
      if (mode === "login") {
        user = await commonStore.signIn({ username, password });
      } else {
        user = await commonStore.signUp({ username, fullname, email, password, confirm });
      }
      onSuccess(user);
    } catch (ex) {
      console.error("Auth error", ex);
      const msg = ex.response?.body?.message || ex.message || "Неизвестная ошибка";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 bg-opacity-80 z-50 p-4">
      {/* Фоновая стилизованная иллюстрация */}
      <div className="absolute inset-0 bg-[url('/assets/trophy-flames.svg')] bg-center bg-no-repeat bg-cover opacity-10" />

      <div className="relative bg-gradient-to-tr from-purple-800 to-purple-600 rounded-3xl shadow-2xl w-full max-w-lg p-10 overflow-hidden">
        {/* Декоративный золотой круг */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-yellow-400 rounded-full mix-blend-screen opacity-50 animate-pulse"></div>

        <h2 className="relative text-center text-3xl font-extrabold text-white mb-8">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h2>

        <form onSubmit={handleAuth} className="relative space-y-6">
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-5 py-3 bg-purple-900 placeholder-purple-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />

          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="ФИО"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
                className="w-full px-5 py-3 bg-purple-900 placeholder-purple-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-purple-900 placeholder-purple-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                required
              />
            </>
          )}

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-5 py-3 bg-purple-900 placeholder-purple-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required minLength={8}
          />

          {mode === "register" && (
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-5 py-3 bg-purple-900 placeholder-purple-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              required
            />
          )}

          {error && (
            <p className="text-center text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-purple-900 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className="relative mt-8 text-center text-sm text-yellow-200">
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <button onClick={switchMode("register")} className="underline">
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <button onClick={switchMode("login")} className="underline">
                Войти
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});