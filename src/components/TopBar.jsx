import { useNavigate } from "react-router-dom";
import Switch from "react-switch";

import { observer } from "mobx-react-lite";
import userStore from "../store/userStore";
import { FaCog, FaSignOutAlt, FaList, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import teamStore from "../store/teamStore";
import commonStore from "../store/commonStore";
const TopBar = observer(({
  title,
  showBackButton = false,
  onSwitchChange = null,
  switchChecked = false,
  showSettingsIcon = true
}) => {
  const navigate = useNavigate();
  const { isAdmin } = userStore;

  const handleSettings = () => navigate("/settings");
  const handleLogout   = () => {
    commonStore.clearAuth();
    navigate("/");
  };

  return (
    <header className="relative bg-white rounded-b-3xl shadow-lg overflow-hidden">
      {/* Градиентный акцент сверху */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400" />

      <div className="relative flex items-center px-6 py-4">
        {/* Кнопка «назад» */}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="flex-none mr-4 p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
          >
            ←
          </button>
        )}

        {/* Заголовок */}
        <h1 className="flex-1 text-center text-2xl font-extrabold text-gray-800">
          {title}
        </h1>

        <div className="flex-none flex items-center space-x-3">
          {/* Переключатель вида */}
          {onSwitchChange && (
            <button
              onClick={() => onSwitchChange(!switchChecked)}
              className="flex items-center space-x-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-200 transition"
            >
              {switchChecked
                ? <FaList size={16} />
                : <FaCalendarAlt size={16} />
              }
              <span className="text-sm font-medium">
                {switchChecked ? "Список" : "Календарь"}
              </span>
            </button>
          )}

          {/* Иконка настроек */}
          {showSettingsIcon && isAdmin && (
            <button
              onClick={handleSettings}
              className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
            >
              <FaCog size={18} />
            </button>
          )}

          {/* Выход */}
          <button
            onClick={handleLogout}
            className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>
      </div>
    </header>
  );
});

export default TopBar;