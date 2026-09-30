import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth, selectUser } from '../store/slices/authSlice';

/* ── ProtectedRoute ──────────────────────────────────────────
   role: optional — restrict to specific role e.g. 'owner'
──────────────────────────────────────────────────────────── */
const ProtectedRoute = ({ children, role }) => {
  const isAuth = useSelector(selectIsAuth);
  const user   = useSelector(selectUser);

  if (!isAuth) return <Navigate to="/signin" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
