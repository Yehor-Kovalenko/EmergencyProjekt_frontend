<template>
  <div class="messages-container">
    <div class="messages-tabs">
      <button 
        :class="['tab-button', { active: activeTab === 'received' }]"
        @click="activeTab = 'received'"
      >
        {{ translations[language].receivedMessages }}
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'sent' }]"
        @click="activeTab = 'sent'"
      >
        {{ translations[language].sentMessages }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{ translations[language].loading }}</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-show="activeTab === 'received'" class="tab-content">
      <ul v-if="!loading" class="messages-list">
        <li v-for="message in receivedMessages" :key="message.id" class="message-item" @click="openMessage(message)">
          <h3>{{ message.title }}</h3>
          <span class="message-sender">{{ translations[language].from }}: {{ message.sender }}</span>
          <span class="message-date">{{ translations[language].date }}: {{ new Date(message.date).toLocaleString() }}</span>
        </li>
      </ul>
    </div>

    <div v-show="activeTab === 'sent'" class="tab-content">
      <ul v-if="!loading" class="messages-list">
        <li v-for="message in sentMessages" :key="message.id" class="message-item" @click="openMessage(message)">
          <h3>{{ message.title }}</h3>
          <span class="message-sender">{{ translations[language].to }}: {{ message.receiver }}</span>
          <span class="message-date">{{ translations[language].date }}: {{ new Date(message.date).toLocaleString() }}</span>
        </li>
      </ul>
    </div>

    <div v-if="selectedMessage" class="message-popup">
      <div class="popup-content">
        <h3>{{ selectedMessage.title }}</h3>
        <p>{{ selectedMessage.body }}</p>
        <div class="message-details">
          <span v-if="activeTab === 'received'">{{ translations[language].from }}: {{ selectedMessage.sender }}</span>
          <span v-else>{{ translations[language].to }}: {{ selectedMessage.receiver }}</span>
          <span>{{ translations[language].date }}: {{ new Date(selectedMessage.date).toLocaleString() }}</span>
        </div>
        <button @click="closePopup">{{ translations[language].close }}</button>
      </div>
    </div>

    <div class="new-message-form">
      <div class="user-search-container">
        <input 
          v-model="searchQuery" 
          @input="searchUsers"
          :placeholder="translations[language].searchPlaceholder" 
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
      
      <div v-if="selectedUser" class="selected-user">
        {{ translations[language].selectedRecipient }}: {{ getUserDisplayName(selectedUser) }}
        <button class="clear-button" @click="clearSelectedUser">×</button>
      </div>

      <input 
        v-model="newMessage.title" 
        :placeholder="translations[language].titlePlaceholder" 
        type="text" 
      />
      <textarea 
        v-model="newMessage.body" 
        :placeholder="translations[language].messagePlaceholder"
      ></textarea>
      <button 
        @click="sendMessage" 
        :disabled="sending || !selectedUser || !newMessage.title || !newMessage.body"
      >
        {{ translations[language].sendButton }}
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
      activeTab: 'received',
      receivedMessages: [],
      sentMessages: [],
      loading: false,
      error: null,
      sendError: null,
      sending: false,
      searchQuery: '',
      searchResults: [],
      selectedUser: null,
      newMessage: {
        senderId: localStorage.getItem('userId'),
        title: '',
        body: ''
      },
      selectedMessage: null,
      language: localStorage.getItem('language') || 'pl',
      translations: {
        pl: {
          receivedMessages: 'Otrzymane Wiadomości',
          sentMessages: 'Wysłane Wiadomości',
          loading: 'Ładowanie wiadomości...',
          from: 'Od',
          to: 'Do',
          date: 'Data',
          close: 'Zamknij',
          searchPlaceholder: 'Wyszukaj użytkownika...',
          selectedRecipient: 'Wybrany odbiorca',
          titlePlaceholder: 'Tytuł wiadomości',
          messagePlaceholder: 'Treść wiadomości',
          sendButton: 'Wyślij',
          errorSearching: 'Błąd podczas wyszukiwania',
          errorSending: 'Błąd podczas wysyłania wiadomości',
          errorLoading: 'Błąd podczas ładowania wiadomości'
        },
        en: {
          receivedMessages: 'Received Messages',
          sentMessages: 'Sent Messages',
          loading: 'Loading messages...',
          from: 'From',
          to: 'To',
          date: 'Date',
          close: 'Close',
          searchPlaceholder: 'Search for a user...',
          selectedRecipient: 'Selected recipient',
          titlePlaceholder: 'Message title',
          messagePlaceholder: 'Message body',
          sendButton: 'Send',
          errorSearching: 'Error while searching',
          errorSending: 'Error while sending message',
          errorLoading: 'Error while loading messages'
        }
      }
    }
  },
  methods: {
    async fetchAllMessages() {
      this.loading = true
      try {
        const [received, sent] = await Promise.all([
          this.fetchReceivedMessages(),
          this.fetchSentMessages()
        ])
        this.receivedMessages = received
        this.sentMessages = sent
      } catch (err) {
        this.error = this.translations[this.language].errorLoading
      } finally {
        this.loading = false
      }
    },

    async fetchReceivedMessages() {
      const receiverId = this.newMessage.senderId
      return await messageService.getMessages(receiverId)
    },

    async fetchSentMessages() {
      const senderId = this.newMessage.senderId
      return await messageService.getMessagesForSender(senderId)
    },

    getUserDisplayName(user) {
      if (!user) return 'Unknown User'
      return user.username || user.email || 'Unknown User'
    },

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
        await this.fetchAllMessages()
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
    this.fetchAllMessages()
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

.message-date {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.messages-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #444;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 16px;
  position: relative;
}

.tab-button.active {
  color: #fff;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #28a745;
}

.tab-content {
  margin-top: 20px;
}

.message-details {
  margin: 15px 0;
  color: #888;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}
</style>