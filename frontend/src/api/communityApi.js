import axiosClient from './axiosClient';

export const communityApi = {
  // Get all community posts
  getPosts: async () => {
    const response = await axiosClient.get('/community-posts');
    return response.data;
  },

  // Create a new post (Supports multipart/form-data for optional image or json)
  createPost: async (formDataOrData) => {
    let headers = {};
    if (formDataOrData instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await axiosClient.post('/community-posts', formDataOrData, { headers });
    return response.data;
  },

  // Toggle like on a post
  toggleLike: async (postId) => {
    const response = await axiosClient.post(`/community-posts/${postId}/likes`);
    return response.data;
  },
};
