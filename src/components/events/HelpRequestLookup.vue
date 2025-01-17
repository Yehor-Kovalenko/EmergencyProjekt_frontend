<template>
  <div class="help-request/lookup">
    <h2>Znajdź swoje zgłoszenie zapotrzebowania</h2>
    <form @submit.prevent="lookupHelpRequest">
      <div>
        <label for="uniqueCode">Unikalny Kod:</label>
        <input type="text" id="uniqueCode" v-model="uniqueCodeInput" required />
      </div>
      <button type="submit">Szukaj</button>
    </form>

    <div v-if="helpRequest">
      <h3>Szczegóły zgłoszenia:</h3>
      <p><strong>Imię:</strong> {{ helpRequest.firstName }}</p>
      <p><strong>Nazwisko:</strong> {{ helpRequest.lastName }}</p>
      <p><strong>Email:</strong> {{ helpRequest.email }}</p>
      <p><strong>Opis:</strong> {{ helpRequest.description }}</p>
      <p><strong>Status:</strong> {{ helpRequest.status }}</p>
      <p><strong>Unikalny Kod:</strong> {{ helpRequest.uniqueCode }}</p>
      <p><strong>Data Zgłoszenia:</strong> {{ new Date(helpRequest.reportedDate).toLocaleString() }}</p>
      <router-link :to="{ name: 'EditHelpRequest', params: { uniqueCode: helpRequest.uniqueCode } }">
        <button>Zedytuj Zgłoszenie</button>
      </router-link>
    </div>

    <div v-if="error" class="error-message">
      <p>Zgłoszenie o podanym kodzie nie zostało znalezione.</p>
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

    const lookupHelpRequest = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/help-requests/${uniqueCodeInput.value}`);
        helpRequest.value = response.data;
        error.value = false;
      } catch (err) {
        console.error('Błąd podczas wyszukiwania zgłoszenia:', err);
        helpRequest.value = null;
        error.value = true;
      }
    };

    return {
      uniqueCodeInput,
      helpRequest,
      error,
      lookupHelpRequest
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
</style>
