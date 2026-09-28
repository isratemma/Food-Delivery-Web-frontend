import api from './axios';

export const signUpApi = (data) => api.post('/auth/signup', data);
export const signInApi = (data) => api.post('/auth/signin', data);
export const signOutApi = () => api.post('/auth/signout');
