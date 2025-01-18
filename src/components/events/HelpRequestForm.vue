<template>
  <div class="help-request-form">
    <h2>{{ translations[language].pageTitle }}</h2>
    <form @submit.prevent="submitHelpRequest">
      <div>
        <label for="firstName">{{ translations[language].firstName }}:</label>
        <input type="text" id="firstName" v-model="form.firstName" required />
      </div>
      <div>
        <label for="lastName">{{ translations[language].lastName }}:</label>
        <input type="text" id="lastName" v-model="form.lastName" required />
      </div>
      <div>
        <label for="email">{{ translations[language].email }}:</label>
        <input type="email" id="email" v-model="form.email" required />
        <span v-if="emailError" class="error">{{ translations[language].invalidEmail }}</span>
      </div>
      
      <!-- Nowe pole: Preferowany język email (pl/en) -->
      <div>
        <label for="emailLanguage">{{ translations[language].emailLanguageLabel }}:</label>
        <select id="emailLanguage" v-model="form.emailLanguage" required>
          <option value="pl">Polski</option>
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <label for="description">{{ translations[language].description }}:</label>
        <textarea id="description" v-model="form.description" required></textarea>
      </div>
      
      <button type="submit">{{ translations[language].submitButton }}</button>
      <router-link to="/map">
        <button type="button">{{ translations[language].backButton }}</button>
      </router-link>
    </form>

    <div v-if="uniqueCode" class="success-message">
      <p>{{ translations[language].thankYou }} <strong>{{ uniqueCode }}</strong></p>
      <p>{{ translations[language].futureUse }}</p>
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
      emailLanguage: 'pl',
      description: ''
    });

    const emailError = ref(false);
    const uniqueCode = ref(null);

    const language = ref(localStorage.getItem('language') || 'pl');

    const translations = {
      pl: {
        pageTitle: 'Zgłoś Zapotrzebowanie na Pomoc',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        email: 'Email',
        invalidEmail: 'Nieprawidłowy format email',
        emailLanguageLabel: 'Preferowany język email',
        description: 'Opis',
        submitButton: 'Zgłoś',
        backButton: 'Wróć',
        thankYou: 'Dziękujemy za zgłoszenie. Twój unikalny kod to:',
        futureUse: 'Możesz użyć tego kodu do przeglądania i edytowania tego zgłoszenia w przyszłości.'
      },
      en: {
        pageTitle: 'Request Help',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        invalidEmail: 'Invalid email format',
        emailLanguageLabel: 'Preferred email language',
        description: 'Description',
        submitButton: 'Submit',
        backButton: 'Back',
        thankYou: 'Thank you for your submission. Your unique code is:',
        futureUse: 'You can use this code to view and edit this request in the future.'
      }
    };

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
        // Zwróć uwagę, że wysyłamy również emailLanguage:
        const response = await axios.post(
          `http://localhost:8080/api/help-requests/catastrophe/${catastropheId}`,
          form.value
        );
        uniqueCode.value = response.data.uniqueCode;
      } catch (error) {
        console.error('Błąd podczas wysyłania zgłoszenia:', error);
      }
    };

    return {
      form,
      emailError,
      uniqueCode,
      submitHelpRequest,
      language,
      translations
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
