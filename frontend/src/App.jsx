import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { fetchMe, selectAuthLoading } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const loading  = useSelector(selectAuthLoading);

  // On every app load / refresh — rehydrate user from cookie
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // Show nothing while checking auth (avoids flash of wrong UI)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff8f6]">
        <svg className="animate-spin h-7 w-7 text-[#5b3256]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/signup"    element={<SignUp />} />
      <Route path="/signin"    element={<SignIn />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
