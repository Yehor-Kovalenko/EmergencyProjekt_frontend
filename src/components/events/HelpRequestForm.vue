<template>
  <div class="help-request-form">
    <h2>Zgłoś Zapotrzebowanie na Pomoc</h2>
    <form @submit.prevent="submitHelpRequest">
      <div>
        <label for="firstName">Imię:</label>
        <input type="text" id="firstName" v-model="form.firstName" required />
      </div>
      <div>
        <label for="lastName">Nazwisko:</label>
        <input type="text" id="lastName" v-model="form.lastName" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
        <span v-if="emailError" class="error">Nieprawidłowy format email</span>
      </div>
      <div>
        <label for="description">Opis:</label>
        <textarea id="description" v-model="form.description" required></textarea>
      </div>
      <button type="submit">Zgłoś</button>
      <router-link to="/map">
        <button type="button">Wróć</button>
      </router-link>
    </form>

    <div v-if="uniqueCode" class="success-message">
      <p>Dziękujemy za zgłoszenie. Twój unikalny kod to: <strong>{{ uniqueCode }}</strong></p>
      <p>Możesz użyć tego kodu do przeglądania i edytowania tego zgłoszenia w przyszłości.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'HelpRequestForm',
  setup() {
    const route = useRoute();
    const catastropheId = route.params.catastropheId;

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      description: ''
    });

    const emailError = ref(false);
    const uniqueCode = ref(null);

    const validateEmail = () => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(form.value.email);
    };

    const submitHelpRequest = async () => {
      if (!validateEmail()) {
        emailError.value = true;
        return;
      } else {
        emailError.value = false;
      }

      try {
        const response = await axios.post(`http://localhost:8080/api/help-requests/catastrophe/${catastropheId}`, form.value);
        uniqueCode.value = response.data.uniqueCode;
      } catch (error) {
        console.error('Błąd podczas wysyłania zgłoszenia zapotrzebowanie na pomoc:', error);
      }
    };

    return {
      form,
      emailError,
      uniqueCode,
      submitHelpRequest
    };
  },
};
</script>

<style>
.help-request-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.help-request-form form div {
  margin-bottom: 15px;
}

.error {
  color: red;
  font-size: 0.9em;
}

.success-message {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid green;
  background-color: #e0ffe0;
}
</style>
