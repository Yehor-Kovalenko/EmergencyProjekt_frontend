<template>
  <div class="help-request-lookup">
    <h2>{{ translations[language].pageTitle }}</h2>
    <form @submit.prevent="lookupHelpRequest">
      <div>
        <label for="uniqueCode">{{ translations[language].uniqueCodeLabel }}:</label>
        <input type="text" id="uniqueCode" v-model="uniqueCodeInput" required />
      </div>
      <button type="submit">{{ translations[language].searchButton }}</button>
    </form>

    <div v-if="helpRequest">
      <h3>{{ translations[language].detailsTitle }}</h3>
      <p><strong>{{ translations[language].firstName }}:</strong> {{ helpRequest.firstName }}</p>
      <p><strong>{{ translations[language].lastName }}:</strong> {{ helpRequest.lastName }}</p>
      <p><strong>{{ translations[language].email }}:</strong> {{ helpRequest.email }}</p>
      <p><strong>{{ translations[language].description }}:</strong> {{ helpRequest.description }}</p>
      <p><strong>{{ translations[language].status }}:</strong> {{ helpRequest.status }}</p>
      <p><strong>{{ translations[language].emailLanguageLabel }}:</strong> {{ helpRequest.emailLanguage }}</p>
      <p><strong>{{ translations[language].uniqueCodeLabel }}:</strong> {{ helpRequest.uniqueCode }}</p>
      <p>
        <strong>{{ translations[language].reportedDate }}:</strong>
        {{ new Date(helpRequest.reportedDate).toLocaleString() }}
      </p>

      <button
        v-if="helpRequest.status !== 'CLOSED'"
        @click="closeHelpRequest"
        :disabled="isClosing"
      >
        {{ translations[language].closeButton }}
      </button>

      <router-link :to="{ name: 'EditHelpRequest', params: { uniqueCode: helpRequest.uniqueCode } }">
        <button>{{ translations[language].editButton }}</button>
      </router-link>

      <div v-if="closeSuccess" class="success-message">
        <p>{{ translations[language].closeSuccess }}</p>
      </div>

      <div v-if="closeError" class="error-message">
        <p>{{ translations[language].closeError }}</p>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ translations[language].notFound }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  name: 'HelpRequestLookup',
  setup() {
    const uniqueCodeInput = ref('');
    const helpRequest = ref(null);
    const error = ref(false);
    const isClosing = ref(false);
    const closeSuccess = ref(false);
    const closeError = ref(false);

    const language = ref(localStorage.getItem('language') || 'pl');

    const translations = {
      pl: {
        pageTitle: 'Znajdź swoje zgłoszenie zapotrzebowania',
        uniqueCodeLabel: 'Unikalny Kod',
        searchButton: 'Szukaj',
        detailsTitle: 'Szczegóły zgłoszenia:',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        email: 'Email',
        emailLanguageLabel: 'Preferowany język email',
        description: 'Opis',
        status: 'Status',
        reportedDate: 'Data Zgłoszenia',
        editButton: 'Zedytuj Zgłoszenie',
        closeButton: 'Zamknij Zgłoszenie',
        notFound: 'Zgłoszenie o podanym kodzie nie zostało znalezione.',
        closeSuccess: 'Zgłoszenie zostało pomyślnie zamknięte.',
        closeError: 'Wystąpił błąd podczas zamykania zgłoszenia. Spróbuj ponownie.'
      },
      en: {
        pageTitle: 'Find Your Help Request',
        uniqueCodeLabel: 'Unique Code',
        searchButton: 'Search',
        detailsTitle: 'Help Request Details:',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        emailLanguageLabel: 'Email Language',
        description: 'Description',
        status: 'Status',
        reportedDate: 'Reported Date',
        editButton: 'Edit Request',
        closeButton: 'Close Request',
        notFound: 'No help request found for the provided code.',
        closeSuccess: 'The help request has been successfully closed.',
        closeError: 'An error occurred while closing the request. Please try again.'
      }
    };

    const lookupHelpRequest = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/help-requests/${uniqueCodeInput.value}`);
        helpRequest.value = response.data;
        error.value = false;
        closeSuccess.value = false;
        closeError.value = false;
      } catch (err) {
        console.error('Błąd podczas wyszukiwania zgłoszenia:', err);
        helpRequest.value = null;
        error.value = true;
      }
    };

    const closeHelpRequest = async () => {
      if (!helpRequest.value) return;

      const confirmClose = window.confirm(translations[language.value].closeButton + '?');
      if (!confirmClose) return;

      isClosing.value = true;
      closeSuccess.value = false;
      closeError.value = false;

      try {
        await axios.post(`http://localhost:8080/api/help-requests/close/${helpRequest.value.uniqueCode}`);
        helpRequest.value.status = 'CLOSED';
        closeSuccess.value = true;
      } catch (err) {
        console.error('Błąd podczas zamykania zgłoszenia:', err);
        closeError.value = true;
      } finally {
        isClosing.value = false;
      }
    };

    return {
      uniqueCodeInput,
      helpRequest,
      error,
      lookupHelpRequest,
      closeHelpRequest,
      isClosing,
      closeSuccess,
      closeError,
      language,
      translations
    };
  },
};
</script>

<style>
.help-request-lookup {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.help-request-lookup form div {
  margin-bottom: 15px;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid red;
  background-color: #ffe0e0;
  color: red;
}

.success-message {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid green;
  background-color: #e0ffe0;
  color: green;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
