import api from './api.js';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const requestData = {
        name: userData.fullName, // Backend expects 'name', frontend has 'fullName'
        email: userData.email,
        password: userData.password,
      };
      
      console.log('Sending registration data:', requestData);
      
      const response = await api.post('/register', requestData);

      const { user, authorisation } = response.data;
      
      // Store only the token in localStorage for security
      localStorage.setItem('token', authorisation.token);
      
      return {
        success: true,
        user: user,
        token: authorisation.token,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Register error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  // Login existing user
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', {
        email: credentials.email,
        password: credentials.password ? '[PASSWORD PROVIDED]' : '[NO PASSWORD]'
      });
      
      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const { user, authorisation } = response.data;
      
      // Store only the token in localStorage for security
      console.log('Saving token only');
      localStorage.setItem('token', authorisation.token);
      
      return {
        success: true,
        user: user,
        token: authorisation.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error response:', error.response?.data);
      console.error('Login error status:', error.response?.status);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem('token');
    }
  },

  // Get current token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== 'undefined';
  },

  // Clear old user data and migrate to token-only storage
  migrateToTokenStorage: () => {
    const oldUser = localStorage.getItem('user');
    if (oldUser) {
      try {
        const userData = JSON.parse(oldUser);
        if (userData.token) {
          // Migrate token to new storage
          localStorage.setItem('token', userData.token);
        }
        // Remove old user data
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Error migrating user data:', error);
        localStorage.removeItem('user');
      }
    }
  },
};
