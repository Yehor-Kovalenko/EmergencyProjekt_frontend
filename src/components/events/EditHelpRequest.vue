<template>
  <div class="help-request-edit">
    <h2>{{ translations[language].pageTitle }}</h2>
    <form @submit.prevent="updateHelpRequest">
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

      <!-- Nowe pole emailLanguage -->
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
      <button type="submit">{{ translations[language].updateButton }}</button>
      <router-link :to="{ name: 'HelpRequestLookup' }">
        <button type="button">{{ translations[language].backButton }}</button>
      </router-link>
    </form>

    <div v-if="successMessage" class="success-message">
      <p>{{ translations[language].success }}</p>
    </div>

    <div v-if="errorMessage" class="error-message">
      <p>{{ translations[language].error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'EditHelpRequest',
  setup() {
    const route = useRoute();
    const uniqueCode = route.params.uniqueCode;

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      emailLanguage: 'pl',
      description: ''
    });

    const emailError = ref(false);
    const successMessage = ref(false);
    const errorMessage = ref(false);

    const language = ref(localStorage.getItem('language') || 'pl');

    const translations = {
      pl: {
        pageTitle: 'Edycja Zgłoszenia Pomocy',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        email: 'Email',
        invalidEmail: 'Nieprawidłowy format email',
        emailLanguageLabel: 'Preferowany język email',
        description: 'Opis',
        updateButton: 'Zaktualizuj',
        backButton: 'Wróć',
        success: 'Zgłoszenie zostało zaktualizowane pomyślnie.',
        error: 'Błąd podczas aktualizacji zgłoszenia. Spróbuj ponownie.'
      },
      en: {
        pageTitle: 'Edit Help Request',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        invalidEmail: 'Invalid email format',
        emailLanguageLabel: 'Preferred email language',
        description: 'Description',
        updateButton: 'Update',
        backButton: 'Back',
        success: 'Your help request has been successfully updated.',
        error: 'Error updating the request. Please try again.'
      }
    };

    const fetchHelpRequest = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/help-requests/${uniqueCode}`);
        form.value.firstName = response.data.firstName;
        form.value.lastName = response.data.lastName;
        form.value.email = response.data.email;
        form.value.description = response.data.description;
        form.value.emailLanguage = response.data.emailLanguage || 'pl';
      } catch (error) {
        console.error('Błąd podczas pobierania zgłoszenia:', error);
        errorMessage.value = true;
      }
    };

    const validateEmail = () => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(form.value.email);
    };

    const updateHelpRequest = async () => {
      if (!validateEmail()) {
        emailError.value = true;
        return;
      } else {
        emailError.value = false;
      }

      try {
        await axios.put(`http://localhost:8080/api/help-requests/${uniqueCode}`, form.value);
        successMessage.value = true;
        errorMessage.value = false;
      } catch (error) {
        console.error('Błąd podczas aktualizacji zgłoszenia:', error);
        successMessage.value = false;
        errorMessage.value = true;
      }
    };

    onMounted(() => {
      fetchHelpRequest();
    });

    return {
      form,
      emailError,
      successMessage,
      errorMessage,
      updateHelpRequest,
      language,
      translations
    };
  },
};
</script>

<style>
.help-request-edit {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.help-request-edit form div {
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

.error-message {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid red;
  background-color: #ffe0e0;
  color: red;
}
</style>
