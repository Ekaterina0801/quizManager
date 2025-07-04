import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

export default observer(function CreateTeamModal({ show, onClose, onCreate }) {
  const [name, setName]     = useState('')
  const [chatId, setChatId] = useState('')

  useEffect(() => { if (show) { setName(''); setChatId('') } }, [show])
  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 bg-opacity-80 z-50 p-4">
      <div className="absolute inset-0 bg-[url('/assets/trophy-flames.svg')] bg-center bg-no-repeat bg-cover opacity-10" />

      <div className="relative bg-gradient-to-tr from-purple-800 to-purple-600 rounded-3xl shadow-2xl w-full max-w-md p-10 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400 rounded-full mix-blend-screen opacity-50 animate-pulse"></div>

        <h3 className="relative text-center text-2xl font-extrabold text-white mb-6">
          Создать команду
        </h3>

        <input
          type="text"
          placeholder="Название команды"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-5 py-3 bg-purple-900 placeholder-purple-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 mb-4"
        />
        <input
          type="text"
          placeholder="ID чата (необязательно)"
          value={chatId}
          onChange={e => setChatId(e.target.value)}
          className="w-full px-5 py-3 bg-purple-900 placeholder-purple-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 mb-6"
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800 font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Отмена
          </button>
          <button
            onClick={() => onCreate(name.trim(), chatId.trim() || null)}
            disabled={!name.trim()}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-purple-900 font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  )
})
