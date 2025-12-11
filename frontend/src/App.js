import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorITLanding from './components/TutorITLanding';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindTutorsPage from './pages/FindTutors';
import MessagesPage from './pages/MessagesPage';
import SessionsPage from './pages/SessionsPage';
import StudentSessionsPage from './pages/StudentSessionsPage';
import TutorSessionsPage from './pages/TutorSessionsPage';
import BookSession from './pages/BookSession';
import SettingsPage from './pages/SettingsPage';
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
          {/* Find Tutors - Students Only */}
          <Route path="/find-tutors" element={
            <ProtectedRoute allowedRoles={['student']}>
              <FindTutorsPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          {/* Generic Sessions Page - Redirects based on role */}
          <Route path="/sessions" element={
            <ProtectedRoute>
              <StudentSessionsPage />
            </ProtectedRoute>
          } />
          {/* Student Sessions Page */}
          <Route path="/student-sessions" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentSessionsPage />
            </ProtectedRoute>
          } />
          {/* Tutor Sessions Page */}
          <Route path="/tutor-sessions" element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorSessionsPage />
            </ProtectedRoute>
          } />

          <Route path="/book-session" element={<BookSession />} />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;