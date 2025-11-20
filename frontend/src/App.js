import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorITLanding from './components/TutorITLanding';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TutorITLanding />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
