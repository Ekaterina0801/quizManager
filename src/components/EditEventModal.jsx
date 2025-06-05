import { useState, useEffect } from "react";
import moment from "moment";
import userStore from "../store/userStore";
export default function EditEventModal({
  isOpen,
  event,
  onClose,
  onSubmit, // ожидает FormData
}) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    linkToAlbum: "",
    teamResult: "",
    price: "",
    isRegistrationOpen: true,
    isHidden: false,
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (isOpen && event) {
      const dt = moment(event.dateTime);
      setFormData({
        name: event.name || "",
        date: dt.format("YYYY-MM-DD"),
        time: dt.format("HH:mm"),
        price: event.price || "",
        location: event.location || "",
        description: event.description || "",
        linkToAlbum: event.linkToAlbum || "",
        teamResult: event.teamResult || "",
        isRegistrationOpen: event.isRegistrationOpen,
        isHidden: event.isHidden ?? false,
      });
      setFile(null);
      setPreviewUrl(event.posterUrl || "");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, event]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0] || null;
    setFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("dateTime", `${formData.date}T${formData.time}:00`);
    fd.append("location", formData.location);
    if (formData.price) fd.append("price", formData.price);
    if (formData.description) fd.append("description", formData.description);
    if (formData.linkToAlbum) fd.append("linkToAlbum", formData.linkToAlbum);
    if (formData.teamResult) fd.append("teamResult", formData.teamResult);
    fd.append("teamId", String(event.teamId));
    fd.append("userId", String(userStore.me.id));
    fd.append("isRegistrationOpen", String(formData.isRegistrationOpen));
    fd.append("isHidden", String(formData.isHidden));
    if (file) fd.append("imageFile", file);

    await onSubmit(fd);
    onClose();
  };

  return (
    // фон, затемняющий всё окно
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 bg-opacity-80 z-50 p-4">
      {/* полупрозрачный узор на фоне */}
      <div className="absolute inset-0 bg-[url('/assets/trophy-flames.svg')] opacity-10" />

      {/* вот здесь добавили max-h-[90vh] и overflow-y-auto */}
      <div className="relative bg-gradient-to-tr from-purple-800 to-purple-600 rounded-3xl shadow-2xl w-full max-w-lg 
                      max-h-[90vh] overflow-y-auto p-8">
        <h3 className="text-2xl font-extrabold text-white mb-6 text-center">
          Редактировать событие
        </h3>

        <form className="space-y-5">
          {/* Название */}
          <label className="block text-white">
            Название
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </label>

          {/* Дата и время */}
          <div className="flex space-x-4">
            <label className="flex-1 text-white">
              Дата
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
              />
            </label>
            <label className="flex-1 text-white">
              Время
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
              />
            </label>
          </div>

          {/* Локация */}
          <label className="block text-white">
            Место
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </label>

          {/* Описание */}
          <label className="block text-white">
            Описание
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </label>
          <label className="block text-white">
            Стоимость
            <textarea
              name="price"
              rows={1}
              value={formData.price}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </label>

          {/* Ссылка на альбом */}
          <label className="block text-white">
            Ссылка на альбом
            <input
              type="url"
              name="linkToAlbum"
              value={formData.linkToAlbum}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </label>

          {/* Результат команды */}
          <label className="block text-white">
            Результат команды
            <input
              name="teamResult"
              value={formData.teamResult}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-purple-900 text-white focus:ring-yellow-300"
            />
          </label>

          {/* Переключатели */}
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

          {/* Афиша */}
          <label className="block text-white">
            Афиша (изображение)
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 text-white"
            />
          </label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 w-full h-auto rounded-lg shadow-inner"
            />
          )}

          {/* Кнопки */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-400 text-gray-800 rounded-lg hover:opacity-90 transition"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-yellow-400 text-purple-900 font-bold rounded-lg hover:opacity-90 transition"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
