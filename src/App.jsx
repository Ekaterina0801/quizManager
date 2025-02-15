import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from '../routes';
import './App.css'
function App() {
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