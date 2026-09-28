import api from './axios';

export const signUpApi         = (data)  => api.post('/auth/signup', data);
export const signInApi         = (data)  => api.post('/auth/signin', data);
export const signOutApi        = ()      => api.post('/auth/signout');
export const forgotPasswordApi = (data)  => api.post('/auth/forgot-password', data);
export const verifyOTPApi      = (data)  => api.post('/auth/verify-otp', data);
export const resetPasswordApi  = (data)  => api.post('/auth/reset-password', data);
