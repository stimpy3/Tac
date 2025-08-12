import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      // Token is invalid or expired
      logout();
    }
    return Promise.reject(error);
  }
);

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('username');
  localStorage.removeItem('useremail');
  window.location.href = '/login';
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Basic token validation (check if it's a valid JWT format)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode the payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      // Token has expired, but don't logout here
      // Let the server verification handle this
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    // Don't logout on parsing errors, just return false
    return false;
  }
};

// Verify token with server
export const verifyToken = async () => {
  try {
    const response = await api.post('/verify-token');
    return response.data.message === 'Token is valid';
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

// Export the configured axios instance
export default api; 