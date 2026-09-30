import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Home                from './pages/Home';
import SignUp               from './pages/SignUp';
import SignIn               from './pages/SignIn';
import OwnerDashboard       from './pages/OwnerDashboard';
import CreateEditShopPage   from './pages/CreateEditShopPage';
import FoodPage             from './pages/FoodPage';
import ProtectedRoute       from './components/ProtectedRoute';

import { fetchMe, selectAuthChecked } from './store/slices/authSlice';

const App = () => {
  const dispatch    = useDispatch();
  const authChecked = useSelector(selectAuthChecked);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff8f6]">
        <svg className="animate-spin h-7 w-7 text-[#5b3256]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/"       element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Owner-only dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute role="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Owner — create / edit shop */}
      <Route
        path="/shop/edit"
        element={
          <ProtectedRoute role="owner">
            <CreateEditShopPage />
          </ProtectedRoute>
        }
      />

      {/* Public — restaurant detail + menu */}
      <Route path="/restaurant/:id" element={<FoodPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
