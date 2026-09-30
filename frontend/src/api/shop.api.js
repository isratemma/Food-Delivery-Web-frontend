import api from './axios';

// ── Shops ────────────────────────────────────────────────────
export const getAllShopsApi    = (params) => api.get('/shops', { params });
export const getShopByIdApi   = (id)     => api.get(`/shops/${id}`);
export const getMyShopApi     = ()       => api.get('/shops/my');
export const createShopApi    = (data)   => api.post('/shops', data);
export const updateShopApi    = (id, data) => api.put(`/shops/${id}`, data);
export const deleteShopApi    = (id)     => api.delete(`/shops/${id}`);
export const toggleShopApi    = (id)     => api.patch(`/shops/${id}/toggle`);

// ── Items ────────────────────────────────────────────────────
export const getShopItemsApi  = (shopId, params) => api.get(`/shops/${shopId}/items`, { params });
export const createItemApi    = (shopId, data)   => api.post(`/shops/${shopId}/items`, data);
export const getItemByIdApi   = (id)     => api.get(`/items/${id}`);
export const updateItemApi    = (id, data) => api.put(`/items/${id}`, data);
export const deleteItemApi    = (id)     => api.delete(`/items/${id}`);
export const toggleItemApi    = (id)     => api.patch(`/items/${id}/toggle`);
