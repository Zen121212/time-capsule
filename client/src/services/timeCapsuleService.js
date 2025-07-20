import api from './api.js';

export const timeCapsuleService = {
  // Get all time capsules for the authenticated user
  getTimeCapsules: async () => {
    try {
      const response = await api.get('/time-capsules');
      return {
        success: true,
        data: response.data.data, // Assuming Laravel API response structure
      };
    } catch (error) {
      console.error('Get time capsules error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch time capsules',
      };
    }
  },

  // Get all public time capsules for the public wall
  getPublicTimeCapsules: async () => {
    try {
      const response = await api.get('/time-capsules-public');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Get public time capsules error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch public time capsules',
      };
    }
  },

  // Create a new time capsule
  createTimeCapsule: async (capsuleData) => {
    try {
      // Transform frontend data to backend format
      const backendData = {
        title: capsuleData.title,
        message: capsuleData.message,
        reveal_date: capsuleData.revealDate, // Send as date string - Laravel will handle conversion
        is_public: capsuleData.privacy === 'Public',
        color: capsuleData.color,
        emoji: capsuleData.emoji,
        privacy: capsuleData.privacy.toLowerCase(),
        // Note: location will be automatically detected by the backend from IP address
      };

      console.log('Creating time capsule:', backendData);

      const response = await api.post('/time-capsules', backendData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Create time capsule error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create time capsule',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  // Update an existing time capsule
  updateTimeCapsule: async (id, capsuleData) => {
    try {
      const backendData = {
        title: capsuleData.title,
        message: capsuleData.message,
        location: capsuleData.location,
        reveal_date: capsuleData.revealDate,
        is_public: capsuleData.privacy === 'Public',
        color: capsuleData.color,
        emoji: capsuleData.emoji,
        privacy: capsuleData.privacy.toLowerCase(),
      };

      const response = await api.put(`/time-capsules/${id}`, backendData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Update time capsule error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update time capsule',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  // Delete a time capsule
  deleteTimeCapsule: async (id) => {
    try {
      await api.delete(`/time-capsules/${id}`);
      return {
        success: true,
        message: 'Time capsule deleted successfully',
      };
    } catch (error) {
      console.error('Delete time capsule error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete time capsule',
      };
    }
  },

  // Get a specific time capsule by ID
  getTimeCapsule: async (id) => {
    try {
      const response = await api.get(`/time-capsules/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Get time capsule error:', error);
      
      let errorMessage = 'Failed to fetch time capsule';
      
      if (error.response?.status === 401) {
        errorMessage = 'You are not authenticated. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || 'This action is unauthorized.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Time capsule not found.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        status: error.response?.status,
      };
    }
  },

  // Get a specific time capsule by unlisted token (public access)
  getTimeCapsuleByToken: async (token) => {
    try {
      const response = await api.get(`/time-capsules/unlisted/${token}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Get time capsule by token error:', error);
      
      let errorMessage = 'Failed to fetch time capsule';
      
      if (error.response?.status === 404) {
        errorMessage = 'Time capsule not found or invalid link.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        status: error.response?.status,
      };
    }
  },
};
