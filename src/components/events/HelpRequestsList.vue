<template>
    <div class="help-requests-list">
      <h2>{{ translations[language].pageTitle }}</h2>
  
      <table>
        <thead>
          <tr>
            <th>{{ translations[language].firstName }}</th>
            <th>{{ translations[language].lastName }}</th>
            <th>{{ translations[language].email }}</th>
            <th>{{ translations[language].status }}</th>
            <th>{{ translations[language].reportedDate }}</th>
            <th>{{ translations[language].actions }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="helpRequest in helpRequests" :key="helpRequest.id">
            <td>{{ helpRequest.firstName }}</td>
            <td>{{ helpRequest.lastName }}</td>
            <td>{{ helpRequest.email }}</td>
            <td>{{ helpRequest.status }}</td>
            <td>{{ formatDate(helpRequest.reportedDate) }}</td>
            <td>
              <router-link
                :to="{ name: 'HelpRequestLookup', params: { uniqueCode: helpRequest.uniqueCode } }"
              >
                {{ translations[language].details }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="error" class="error-message">
        {{ translations[language].errorMessage }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'HelpRequestsList',
    setup() {
      const helpRequests = ref([]);
      const error = ref(false);
  
      const language = ref(localStorage.getItem('language') || 'pl');
  
      const translations = {
        pl: {
          pageTitle: 'Lista wszystkich zgłoszeń',
          firstName: 'Imię',
          lastName: 'Nazwisko',
          email: 'Email',
          status: 'Status',
          reportedDate: 'Data zgłoszenia',
          actions: 'Akcje',
          details: 'Szczegóły',
          errorMessage: 'Wystąpił błąd podczas pobierania danych.',
        },
        en: {
          pageTitle: 'List of all requests',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          status: 'Status',
          reportedDate: 'Reported Date',
          actions: 'Actions',
          details: 'Details',
          errorMessage: 'An error occurred while fetching the data.',
        },
      };
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString();
      };

      const fetchHelpRequests = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/help-requests');
          helpRequests.value = response.data;
        } catch (err) {
          console.error('Błąd podczas pobierania zgłoszeń:', err);
          error.value = true;
        }
      };
  
      onMounted(() => {
        fetchHelpRequests();
      });
  
      return {
        helpRequests,
        error,
        language,
        translations,
        formatDate,
      };
    },
  };
  </script>
  
  <style scoped>
  .help-requests-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  
  thead tr {
    background-color: #f2f2f2;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .error-message {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid red;
    background-color: #ffe0e0;
    color: red;
  }
  </style>
  