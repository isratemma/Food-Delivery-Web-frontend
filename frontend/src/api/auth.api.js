import api from './axios';

export const signUpApi        = (data)  => api.post('/auth/signup', data);
export const signInApi        = (data)  => api.post('/auth/signin', data);
export const signOutApi       = ()      => api.post('/auth/signout');
export const forgotPasswordApi = (data) => api.post('/auth/forgot-password', data);
export const verifyTokenApi   = (token) => api.get(`/auth/reset-password/${token}/verify`);
export const resetPasswordApi = (token, data) => api.post(`/auth/reset-password/${token}`, data);
