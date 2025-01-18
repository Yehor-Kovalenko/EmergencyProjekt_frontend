<template>
  <div class="messages-container">
    <div v-if="loading" class="loading">Loading messages...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-else class="messages-list">
      <li v-for="message in messages" :key="message.id" class="message-item" @click="openMessage(message)">
        <h3>{{ message.title }}</h3>
        <span class="message-sender">From: {{ message.senderId }}</span>
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
      <input v-model="newMessage.receiverId" placeholder="Receiver ID" type="text" />
      <input v-model="newMessage.title" placeholder="Title" type="text" />
      <textarea v-model="newMessage.body" placeholder="Message body"></textarea>
      <button @click="sendMessage" :disabled="sending">Send Message</button>
      <div v-if="sendError" class="send-error">{{ sendError }}</div>
    </div>
  </div>
</template>

<script>
import { messageService } from '@/services/messageService'

export default {
  name: 'Messages',
  data() {
    return {
      messages: [],
      loading: false,
      error: null,
      sendError: null,
      sending: false,
      newMessage: {
        senderId: 1,
        receiverId: '',
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
        const receiverId = 1 // Replace with actual user ID
        this.messages = await messageService.getMessages(receiverId)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async sendMessage() {
      this.sending = true
      try {
        await messageService.sendMessage(this.newMessage)
        this.newMessage.receiverId = ''
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
}
.loading {
  font-size: 16px;
  color: #999;
}
.error, .send-error {
  color: red;
}
.messages-list {
  list-style: none;
  padding: 0;
}
.message-item {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  position: relative;
  cursor: pointer;
}
.message-sender {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 12px;
  color: #555;
}
.message-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Dark background with more opacity */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #333; /* Dark background for the popup */
  color: white; /* Light text color */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.popup-content h3 {
  margin-top: 0;
}

.popup-content p {
  color: #ccc; /* Lighter color for text body */
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
  border: 1px solid #ccc;
  border-radius: 4px;
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
  background-color: #ccc;
}
</style>
