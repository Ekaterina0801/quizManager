import EventPage from "./src/components/pages/EventPage";
import MainPage from "./src/components/pages/MainPage";
import EventsPage from "./src/components/pages/EventsPage";
import NotificationSettingsPage from "./src/components/pages/NotificationSettingsPage";
import { ErrorPage } from "./src/components/pages/ErrorPage";


const routes = [
    {
      path: '/',
      element: <MainPage/>
    },
    {
      path: '/events/:eventId',
      element: <EventPage/>
    },
    {
      path: '/events',
      element: <EventsPage/>
    },
    {
      path: '/settings',
      element: <NotificationSettingsPage/>
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];
  
  export default routes;
  