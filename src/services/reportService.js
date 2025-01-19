import axios from '../axiosConfig'

export const reportService = {
  async fetchReport(url) {
    try {
        const response = await axios.post(url);
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          this.reportData.data = [];
        } else {
          console.error('Failed to fetch report data:', error);
          throw error;
        }
      }
  },
}