import React, { useEffect, useState } from 'react'
export default function EventModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Добавить событие'
}) {
  const initialState = {
    date: '',
    time: '',
    title: '',
    location: '',
    description: '',
    linkToAlbum: '',
    teamResult: '',
    isRegistrationOpen: true,
    isHidden: false,
    posterFile: null,
    posterUrl: '',
    price: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    if (!isOpen) {
      setFormData(initialState);
      setIsSubmitting(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(fd => ({
      ...fd,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(fd => ({
      ...fd,
      posterFile: file,
      posterUrl: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData(initialState);
      onClose();
    } catch (error) {
      console.error('Ошибка при создании события:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 bg-opacity-80 z-50 p-4">
      <div className="absolute inset-0 bg-[url('/assets/trophy-flames.svg')] opacity-10" />

      <div className="relative bg-gradient-to-tr from-purple-800 to-purple-600 rounded-3xl shadow-2xl w-full max-w-lg p-8 overflow-auto max-h-[90vh]">
        <h3 className="text-3xl font-extrabold text-white text-center mb-6">
          {title}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white">Дата</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-white">Время</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Название</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Место</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Стоимость</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">Ссылка на альбом</label>
              <input
                type="url"
                name="linkToAlbum"
                value={formData.linkToAlbum}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Результат команды</label>
              <input
                type="text"
                name="teamResult"
                value={formData.teamResult}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
              />
            </div>
          </div>

          <div className="flex space-x-6 text-white">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isRegistrationOpen"
                checked={formData.isRegistrationOpen}
                onChange={handleChange}
                className="h-5 w-5 rounded bg-purple-900 text-yellow-300 focus:ring-yellow-300"
              />
              <span>Регистрация открыта</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isHidden"
                checked={formData.isHidden}
                onChange={handleChange}
                className="h-5 w-5 rounded bg-purple-900 text-yellow-300 focus:ring-yellow-300"
              />
              <span>Скрыть событие</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Афиша (изображение)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="mt-1 text-white"
            />
            {formData.posterUrl && (
              <img
                src={formData.posterUrl}
                alt="Poster preview"
                className="mt-2 w-full h-48 object-cover rounded-lg shadow-inner"
              />
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-6 py-2 bg-gray-400 text-gray-800 rounded-lg hover:opacity-90 transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Отменить
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-yellow-400 text-purple-900 font-bold rounded-lg hover:opacity-90 transition relative ${
                isSubmitting ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="invisible">Сохранить</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}