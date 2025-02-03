import EventPage from "./src/components/pages/EventPage";
import MainPage from "./src/components/pages/MainPage";


const routes = [
    {
      path: '/',
      element: <MainPage/>
    },
    {
      path: '/event',
      element: <EventPage/>
    },
  ];
  
  export default routes;
  