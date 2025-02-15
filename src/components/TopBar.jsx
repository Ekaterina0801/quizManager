import { useNavigate } from "react-router-dom";
import Switch from "react-switch";

import { observer } from "mobx-react-lite";
import userStore from "../store/userStore";
import { FaCog, FaSignOutAlt, FaList, FaCalendarAlt } from "react-icons/fa";
import teamStore from "../store/teamStore";
const TopBar = observer(({ 
    title, 
    showBackButton = false, 
    onSwitchChange = null, 
    switchChecked = false, 
    showSettingsIcon = true 
}) => {
    const navigate = useNavigate();
    const { isAdmin } = userStore;

    const handleSettingsClick = () => navigate('/settings');
    const handleLogout = () => {
        teamStore.clearSelectedTeam();
        navigate('/');
    };

    return (
        <div className="bg-[#e4effc] rounded-b-3xl py-4 px-6 flex items-center justify-between w-full shadow-xl shadow-[#d1d5db]">
            {showBackButton && (
                <button
                    onClick={() => navigate('/events')}
                    className="text-[#732D87] text-xl bg-[#f2f7fd] p-3 rounded-full shadow-xl shadow-[#d1d5db] hover:scale-110 transition-transform duration-300"
                >
                    ←
                </button>
            )}

            <h1 className="text-3xl font-extrabold flex-grow text-center text-[#732D87]">
                {title}
            </h1>

            <div className="flex items-center space-x-4">
                {onSwitchChange !== null && (
                    <div 
                        className="flex items-center bg-[#f2f7fd] p-2 rounded-full shadow-xl shadow-[#d1d5db] hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => onSwitchChange(!switchChecked)}
                    >
                        {switchChecked ? <FaList size={22} color="#732D87" /> : <FaCalendarAlt size={22} color="#732D87" />}
                        <span className="ml-2 text-[#732D87] font-medium">{switchChecked ? "Список" : "Календарь"}</span>
                    </div>
                )}

                {showSettingsIcon && isAdmin && (
                    <div 
                        className="cursor-pointer bg-[#f2f7fd] p-3 rounded-full shadow-xl shadow-[#d1d5db] hover:scale-110 transition-transform duration-300" 
                        onClick={handleSettingsClick}
                    >
                        <FaCog size={24} color="#732D87" />
                    </div>
                )}

                <div 
                    className="cursor-pointer bg-[#f2f7fd] p-3 rounded-full shadow-xl shadow-[#d1d5db] hover:scale-110 transition-transform duration-300" 
                    onClick={handleLogout}
                >
                    <FaSignOutAlt size={24} color="red" />
                </div>
            </div>
        </div>
    );
});

export default TopBar;
