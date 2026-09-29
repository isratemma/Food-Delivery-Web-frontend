import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

const App = () => {
  return (
    <Routes>
      <Route path="/"        element={<Home />} />
      <Route path="/signup"  element={<SignUp />} />
      <Route path="/signin"  element={<SignIn />} />
      <Route path="/dashboard" element={
        <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1]">
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-[#0F172A]">🎉 Signed in!</p>
            <p className="text-[#64748B]">Dashboard coming soon.</p>
          </div>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
