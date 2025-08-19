const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

/**
 * Wraps fetch for API requests, automatically attaching JWT token if present and handling JSON.
 * PUBLIC_INTERFACE
 */
export async function apiRequest(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  /** Makes an HTTP request to the backend API and returns JSON.
   * @param {string} path - The URL path starting with /
   * @param {object} options - method, body, headers, auth
   * @returns {Promise<any>} parsed JSON
   */
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem('token');

  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  if (auth && token) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, init);

  if (res.status === 401) {
    // Unauthorized: clear token
    localStorage.removeItem('token');
  }

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export const api = {
  // Auth
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  me: () => apiRequest('/auth/me', { auth: true }),

  // Profile
  getProfile: () => apiRequest('/profile', { auth: true }),
  updateProfile: (payload) => apiRequest('/profile', { method: 'PUT', body: payload, auth: true }),

  // Restaurants and menu
  listRestaurants: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/restaurants${qs ? `?${qs}` : ''}`);
  },
  getRestaurant: (id) => apiRequest(`/restaurants/${id}`),
  getMenu: (id) => apiRequest(`/restaurants/${id}/menu`),

  // Cart
  getCart: () => apiRequest('/cart', { auth: true }),
  addCartItem: (payload) => apiRequest('/cart/items', { method: 'POST', body: payload, auth: true }),
  updateCartItem: (itemId, payload) => apiRequest(`/cart/items/${itemId}`, { method: 'PUT', body: payload, auth: true }),
  removeCartItem: (itemId) => apiRequest(`/cart/items/${itemId}`, { method: 'DELETE', auth: true }),
  clearCart: () => apiRequest('/cart/clear', { method: 'POST', auth: true }),
  checkout: () => apiRequest('/cart/checkout', { method: 'POST', auth: true }),

  // Orders
  myOrders: () => apiRequest('/orders', { auth: true }),
  getOrder: (id) => apiRequest(`/orders/${id}`, { auth: true }),
  // Tracking is via polling of getOrder status in UI
};
