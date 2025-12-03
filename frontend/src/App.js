import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorITLanding from './components/TutorITLanding';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindTutorsPage from './pages/FindTutors';
import MessagesPage from './pages/MessagesPage';
import SessionsPage from './pages/SessionsPage';
import StudentsPage from './pages/StudentsPage';
import './App.css';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TutorITLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/find-tutors" element={
            <ProtectedRoute>
              <FindTutorsPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <SessionsPage />
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
