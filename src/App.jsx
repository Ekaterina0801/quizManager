import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from '../routes';
import './App.css'
function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand(); 
      tg.enableClosingConfirmation(); 
    }
  }, []);
  return (
      <div className="App">
        <Router basename="/quizManager">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Router>
      </div>
  );
}
export default App;