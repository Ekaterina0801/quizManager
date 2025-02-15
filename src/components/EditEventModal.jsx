import React, { useEffect } from "react";
import moment from "moment";
const EditEventModal = ({
    isModalOpen,
    handleModalClose,
    handleInputChange,
    handleFormSubmit,
    event,
    handleFileChange,
  }) => {
    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
  
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [isModalOpen]);
  
    if (!isModalOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.8)] bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-auto border border-[#732D87]">
          <h3 className="text-xl font-semibold mb-4 text-[#732D87] border-b-2 pb-2 border-[#732D87]">Редактировать событие</h3>
          <form onSubmit={handleFormSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700">Название мероприятия</label>
            <input
              type="text"
              name="name"
              value={event.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
  
            <label className="block mb-2 text-sm font-medium text-gray-700">Дата</label>
            <input
              type="date"
              name="date"
              value={moment(event.dateTime).format("YYYY-MM-DD")}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
  
            <label className="block mb-2 text-sm font-medium text-gray-700">Время</label>
            <input
              type="time"
              name="time"
              value={moment(event.dateTime).format("HH:mm")}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
  
            <label className="block mb-2 text-sm font-medium text-gray-700">Место</label>
            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
  
            <label className="block mb-2 text-sm font-medium text-gray-700">Описание</label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            ></textarea>
  
            {/* Поле для ввода ссылки на альбом */}
            <label className="block mb-2 text-sm font-medium text-gray-700">Ссылка на альбом</label>
            <input
              type="url"
              name="linkToAlbum"
              value={event.linkToAlbum}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
            />
  
            {/* Поле для ввода результата команды */}
            <label className="block mb-2 text-sm font-medium text-gray-700">Результат команды</label>
            <input
              type="text"
              name="teamResult"
              value={event.teamResult}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
            />
  
            {/* Поле для загрузки изображения афиши */}
            <label className="block mb-2 text-sm font-medium text-gray-700">Афиша мероприятия</label>
            <input
              type="file"
              name="poster"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
            />
  
            {/* Предварительный просмотр загруженного изображения */}
            {event.posterUrl && (
              <div className="mt-2 text-center">
                <img
                  src={event.posterUrl}
                  alt="Poster Preview"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
  
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleModalClose}
                className="text-[#732D87] hover:text-[#5a1e67] transition-colors duration-300"
              >
                Отменить
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-[#732D87] text-white rounded-md hover:bg-[#5a1e67] transition-colors duration-300"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default EditEventModal;
  