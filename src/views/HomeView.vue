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

const language = ref(localStorage.getItem('language') || 'pl');
const translations = {
  pl: {
    heading: 'Witaj w naszym projekcie!',
    text: 'Celem tego projektu jest opracowanie systemu informacyjnego wspomagającego koordynację działań pomocowych podczas sytuacji kryzysowych, takich jak klęski żywiołowe czy katastrofy ekologiczne. System umożliwi efektywne zarządzanie zgłoszeniami poszkodowanych, dystrybucję zasobów, komunikację pomiędzy wszystkimi zaangażowanymi stronami oraz monitorowanie i raportowanie działań pomocowych. Naszym celem jest stworzenie platformy, która będzie stanowiła istotne narzędzie dla organizacji humanitarnych, wolontariuszy, darczyńców, osób poszkodowanych oraz przedstawicieli władz, zapewniając sprawne wsparcie i poprawioną współpracę podczas sytuacji kryzysowych. Proszę zalogować się, aby uzyskać dostęp do spersonalizowanych treści i funkcji.'
},
  en: {
    heading: 'Welcome to our project!',
    text: 'The goal of this project is to develop an information system that facilitates the coordination of aid efforts during crisis situations, such as natural disasters or environmental catastrophes. The system will enable efficient management of victim reports, resource distribution, communication among all involved parties, and monitoring and reporting of relief operations. Our aim is to create a platform that serves as a vital tool for humanitarian organizations, volunteers, donors, affected individuals, and government representatives, ensuring streamlined support and enhanced collaboration during emergencies. Please log in to access your personalized content and features.'
  }
}
</script>

<template>
  <main>
    <TheWelcome />
    <!-- Show description if no one is authenticated -->
    <div v-if="!isAuthenticated">
      <h1>{{ translations[language].heading }}</h1>
      <p>
        {{ translations[language].text }}
      </p>
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
