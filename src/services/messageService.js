import axios from '../axiosConfig'

export const messageService = {
  async sendMessage(messageData) {
    try {
      const response = await axios.post('/inbox/send', messageData)
      return response.data
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  },

  async getMessages(receiverId) {
    try {
      const response = await axios.post('/inbox/check', { receiverId })
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return []
      }
      console.error('Failed to fetch messages:', error)
      throw error
    }
  },

  async searchUsers(searchTerm) {
    try {
      const response = await axios.post('/inbox/search', { search: searchTerm })
      return response.data
    } catch (error) {
      console.error('Failed to search users:', error)
      throw error
    }
  }
}