import React from 'react';
import './App.css';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import EventsPage from './components/pages/EventsPage';
import EventPage from './components/pages/EventPage';
import NotificationSettingsPage from './components/pages/NotificationSettingsPage';
import teamStore from './store/teamStore';
import { ToastContainer } from 'react-toastify';
import LoginRegisterModal from './components/LoginRegisterModal';
import routes from '../routes';
import userStore from './store/userStore';
import commonStore from './store/commonStore';
import { Admin } from 'react-admin';
import { EventList,EventEdit, EventCreate} from './admin/events';
import { TeamList, TeamEdit, TeamCreate } from './admin/teams';
import dataProvider from './admin/dataProvider';
import { Resource } from 'react-admin';
import './App.css'
import { common } from '@mui/material/colors';
import { useLocation } from 'react-router-dom';

export const AdminRoute = observer(() => {
  const location = useLocation()

  // Ждём, пока загрузится флаг isMainAdmin (null → true/false)
  if (userStore.isLoadingAdmin || userStore.isMainAdmin === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    )
  }

  // Если это не супер-админ, редиректим назад в /
  if (!userStore.isMainAdmin && !userStore.isLoadingAdmin) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  // Важно: basename="/admin" сообщит React Admin, что все его роуты начинаются с /admin
  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource
        name="events"
        list={EventList}
        edit={EventEdit}
        create={EventCreate}
      />
      <Resource
        name="teams"
        list={TeamList}
        edit={TeamEdit}
        create={TeamCreate}
      />
    </Admin>
  )
})

const App = observer(() => {
  useEffect(() => {
    if (commonStore.token) {
      userStore.fetchMe().then(() => {
        const tid = localStorage.getItem('teamId')
        if (userStore.me && tid && !teamStore.selected) {
          teamStore.select(Number(tid))
        }
      })
    }
  }, [])

  if (userStore.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Защищённый админ-маршрут */}
        <Route path="/admin/*" element={<AdminRoute />} />

        {/* Основная часть приложения */}
        <Route path="/" element={<MainPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventPage />} />
        <Route path="/settings" element={<NotificationSettingsPage />} />

        {/* Если попали в неизвестный URL → редирект на / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
})

export default App