import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorITLanding from './components/TutorITLanding';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindTutorsPage from './pages/FindTutors';
import MessagesPage from './pages/MessagesPage';
import SessionsPage from './pages/SessionsPage';
import BookSession from './pages/BookSession';
import SettingsPage from './pages/SettingsPage';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TutorITLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-tutors" element={<FindTutorsPage />} />
          <Route path="/book-session" element={<BookSession />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
