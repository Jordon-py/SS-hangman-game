import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import AppHome from './pages/AppHome.jsx';
import Landing from './pages/Landing.jsx';
import SignIn from './pages/SignIn.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppHome />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
