import axios from './axiosInstance';

const getVendorAnalytics = async () => {
  try {
    const response = await axios.get('/analytics/vendor');
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor analytics:', error);
    throw error;
  }
};

export {
  getVendorAnalytics
};