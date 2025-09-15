import { API_URL } from '../../config/api';

export const galleryApi = {
  // Get gallery page data
  getGalleryPage: async () => {
    const response = await fetch(`${API_URL}/gallery/page`);
    if (!response.ok) {
      throw new Error('Failed to fetch gallery data');
    }
    return response.json();
  },

  // Update gallery page
  updateGalleryPage: async (data, token) => {
    const response = await fetch(`${API_URL}/gallery/page`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update gallery');
    }
    return response.json();
  },

  // Upload image
  uploadImage: async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/gallery/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }
    return response.json();
  },
};