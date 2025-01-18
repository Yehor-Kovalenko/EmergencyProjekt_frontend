<template>
  <div class="messages-container">
    <div v-if="loading" class="loading">Loading messages...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-else class="messages-list">
      <li v-for="message in messages" :key="message.id" class="message-item" @click="openMessage(message)">
        {{ console.log(message) }}
        <h3>{{ message.title }}</h3>
        <span class="message-sender">From: {{ message.sender }}</span>
      </li>
    </ul>

    <div v-if="selectedMessage" class="message-popup">
      <div class="popup-content">
        <h3>{{ selectedMessage.title }}</h3>
        <p>{{ selectedMessage.body }}</p>
        <button @click="closePopup">Close</button>
      </div>
    </div>

    <div class="new-message-form">
      <!-- User Search Input with Dropdown -->
      <div class="user-search-container">
        <input 
          v-model="searchQuery" 
          @input="searchUsers"
          placeholder="Search for a user..." 
          type="text"
          class="search-input"
        />
        <ul v-if="searchResults.length && searchQuery" class="search-results">
          <li 
            v-for="user in searchResults" 
            :key="user.id"
            @click="selectUser(user)"
            class="search-result-item"
          >
            {{ getUserDisplayName(user) }}
          </li>
        </ul>
      </div>
      
      <!-- Selected User Display -->
      <div v-if="selectedUser" class="selected-user">
        Selected recipient: {{ getUserDisplayName(selectedUser) }}
        <button class="clear-button" @click="clearSelectedUser">×</button>
      </div>

      <input v-model="newMessage.title" placeholder="Title" type="text" />
      <textarea v-model="newMessage.body" placeholder="Message body"></textarea>
      <button 
        @click="sendMessage" 
        :disabled="sending || !selectedUser || !newMessage.title || !newMessage.body"
      >
        Send Message
      </button>
      <div v-if="sendError" class="send-error">{{ sendError }}</div>
    </div>
  </div>
</template>

<script>
import { messageService } from '@/services/messageService'
import debounce from 'lodash.debounce'

export default {
  name: 'Messages',
  data() {
    return {
      messages: [],
      loading: false,
      error: null,
      sendError: null,
      sending: false,
      searchQuery: '',
      searchResults: [],
      selectedUser: null,
      newMessage: {
        senderId: 1,
        title: '',
        body: ''
      },
      selectedMessage: null
    }
  },
  methods: {
    async fetchMessages() {
      this.loading = true
      try {
        const receiverId = this.newMessage.senderId
        this.messages = await messageService.getMessages(receiverId)

      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    getUserDisplayName(user) {
      if (!user) return 'Unknown User'
      return user.username || user.email || 'Unknown User'
    },

    // Debounced search function
    searchUsers: debounce(async function() {
      if (!this.searchQuery.trim()) {
        this.searchResults = []
        return
      }
      try {
        this.searchResults = await messageService.searchUsers(this.searchQuery)
      } catch (err) {
        console.error('Search failed:', err)
      }
    }, 300),

    selectUser(user) {
      this.selectedUser = user
      this.searchQuery = ''
      this.searchResults = []
      console.log('Selected user:', user)
    },

    clearSelectedUser() {
      this.selectedUser = null
      this.searchQuery = ''
    },

    async sendMessage() {
      if (!this.selectedUser) return
      
      this.sending = true
      try {
        const messageData = {
          ...this.newMessage,
          receiverId: this.selectedUser.id
        }
        await messageService.sendMessage(messageData)
        this.selectedUser = null
        this.newMessage.title = ''
        this.newMessage.body = ''
        await this.fetchMessages()
      } catch (err) {
        this.sendError = err.message
      } finally {
        this.sending = false
      }
    },

    openMessage(message) {
      this.selectedMessage = message
    },

    closePopup() {
      this.selectedMessage = null
    }
  },
  mounted() {
    this.fetchMessages()
  }
}
</script>

<style scoped>
.messages-container {
  padding: 20px;
  color: #ccc;
}

.user-search-container {
  position: relative;
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
  color: #ccc;
}

.search-input::placeholder {
  color: #666;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  color: #ccc;
}

.search-result-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #444;
}

.search-result-item:hover {
  background-color: #444;
}

.search-result-item:last-child {
  border-bottom: none;
}

.selected-user {
  background-color: #444;
  /* padding: 8px 12px; */
  /* border-radius: 4px; */
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 4px;
}

.clear-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 18px;
  padding: 0 5px;
}

.clear-button:hover {
  color: #ccc;
}

.loading {
  font-size: 16px;
  color: #999;
}

.error, .send-error {
  color: #ff6b6b;
}

.messages-list {
  list-style: none;
  padding: 0;
}

.message-item {
  border-bottom: 1px solid #444;
  padding: 10px 0;
  position: relative;
  cursor: pointer;
}

.message-item:hover {
  background-color: #383838;
}

.message-sender {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 12px;
  color: #888;
}

.message-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: #333;
  color: #ccc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
}

.popup-content h3 {
  margin-top: 0;
  color: white;
}

.popup-content button {
  padding: 10px 15px;
  background-color: #292929;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.new-message-form {
  margin-top: 20px;
}

.new-message-form input,
.new-message-form textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
  color: #ccc;
}

.new-message-form input::placeholder,
.new-message-form textarea::placeholder {
  color: #666;
}

.new-message-form button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.new-message-form button:disabled {
  background-color: #444;
  color: #666;
  cursor: not-allowed;
}
</style>