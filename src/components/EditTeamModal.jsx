import React, { useState, useEffect } from "react";

function EditTeamModal({ isOpen, onClose, team, onSave }) {
  const [name, setName] = useState(team.name);
  const [chatId, setChatId] = useState(team.chatId || "");

  useEffect(() => {
    if (isOpen) {
      setName(team.name);
      setChatId(team.chatId || "");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, team]);

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Редактировать команду</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="text-gray-700">Название</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full border rounded p-2"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Chat ID</span>
            <input
              type="text"
              value={chatId}
              onChange={e => setChatId(e.target.value)}
              className="mt-1 w-full border rounded p-2"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(name, chatId || undefined)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTeamModal;
