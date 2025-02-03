import React, { useEffect } from "react";

const EventModal = ({
    isModalOpen,
    handleModalClose,
    handleInputChange,
    handleFormSubmit,
    newEvent,
    handleFileChange,
  }) => {
    useEffect(() => {
      // Блокируем прокрутку страницы при открытии модального окна
      if (isModalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto"; // Восстанавливаем прокрутку при закрытии окна
      }
  
      // Очистка прокрутки при размонтировании компонента
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [isModalOpen]);
  
    if (!isModalOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.8)] bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-auto border border-[#732D87]">
          <h3 className="text-xl font-semibold mb-4 text-[#732D87] border-b-2 pb-2 border-[#732D87]">Добавить событие</h3>
          <form onSubmit={handleFormSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700">Дата</label>
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">Время</label>
            <input
              type="time"
              name="time"
              value={newEvent.time}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">Название мероприятия</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">Место</label>
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">Описание</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-4 border-[#732D87] focus:outline-none focus:ring-2 focus:ring-[#732D87] focus:border-transparent"
              required
            ></textarea>
  
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
            {newEvent.posterUrl && (
              <div className="mt-2 text-center">
                <img
                  src={newEvent.posterUrl}
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
  
  export default EventModal;