import React from 'react'

export default function TeamList({ teams = [], onSelect }) {
  return (
    <div className="space-y-4">
      {teams.length === 0 ? (
        <p className="text-gray-700 text-center">У вас пока нет команд.</p>
      ) : teams.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-3xl shadow-lg
                     hover:shadow-2xl transition-shadow border-2 border-transparent
                     hover:border-yellow-300"
        >
          <span className="text-lg font-semibold text-gray-800">{t.name}</span>
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  )
}
