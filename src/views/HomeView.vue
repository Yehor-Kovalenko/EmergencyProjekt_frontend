<script setup>
import { ref, onMounted } from 'vue';

// States for user data
const isAuthenticated = ref(false);
const username = ref('');
const email = ref('');
const role = ref('');

// Check localStorage for authentication details
onMounted(() => {
  const accessToken = localStorage.getItem('accessToken');
  const storedUsername = localStorage.getItem('username');
  const storedEmail = localStorage.getItem('email');
  const storedRole = localStorage.getItem('role');

  if (accessToken && storedUsername && storedEmail && storedRole) {
    isAuthenticated.value = true;
    username.value = storedUsername;
    email.value = storedEmail;
    role.value = storedRole;
  }
});
</script>

<template>
  <main>
    <TheWelcome />
    <!-- Show description if no one is authenticated -->
    <div v-if="!isAuthenticated">
      <h1>Welcome to our project!</h1>
      <p>
        The goal of this project is to develop an information system that facilitates 
        the coordination of aid efforts during crisis situations, such as natural disasters 
        or environmental catastrophes. The system will enable efficient management of victim reports, 
        resource distribution, communication among all involved parties, and monitoring and reporting of relief operations.
      </p>
      <p>
        Our aim is to create a platform that serves as a vital tool for humanitarian organizations, volunteers, donors, 
        affected individuals, and government representatives, ensuring streamlined support and enhanced collaboration during emergencies.
      </p>
      <p>Please log in to access your personalized content and features.</p>
    </div>


    <!-- Show personalized greeting if authenticated -->
    <div v-else>
      <h1>Hello, {{ role }}!</h1>
      <p>Welcome back, {{ username }} ({{ email }})!</p>
    </div>
  </main>
</template>

<style scoped>
/* Add any custom styles for your HomeView here */
main {
  padding: 20px;
}

h1 {
  font-size: 2rem;
  color: #333;
}

p {
  font-size: 1rem;
  color: #555;
}
</style>
