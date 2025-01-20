<template>
    <div class="ngo-resources-report">
      <h1>{{ t.heading }}</h1>
  
      <table v-if="reportData && reportData.data && reportData.data.length" class="resources-table">
        <thead>
          <tr>
            <th>{{ t.resourceType }}</th>
            <th>{{ t.description }}</th>
            <th>{{ t.amount }}</th>
            <th>{{ t.dateOfRegistration }}</th>
            <th>{{ t.destinationId }}</th>
            <th>{{ t.resourceStatus }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reportData.data" :key="item.id">
            <td>{{ item.resourceType }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.date_of_registration }}</td>
            <td>{{ item.destinationId || t.noDestination }}</td>
            <td>{{ item.resourceStatus }}</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else class="no-data">
        {{ t.noData }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  /** 1) Language selection. */
  const language = ref(localStorage.getItem('language') || 'pl');
  
  /** 2) Translations dictionary. */
  const translations = {
    en: {
      heading: 'NGO Resources',
      resourceType: 'Resource Type',
      description: 'Description',
      amount: 'Amount',
      dateOfRegistration: 'Date of Registration',
      destinationId: 'Destination ID',
      resourceStatus: 'Resource Status',
      noDestination: 'No Destination',
      noData: 'No data available for NGO Resources.'
    },
    pl: {
      heading: 'Zasoby NGO',
      resourceType: 'Rodzaj Zasobu',
      description: 'Opis',
      amount: 'Ilość',
      dateOfRegistration: 'Data Rejestracji',
      destinationId: 'ID Miejsca Przeznaczenia',
      resourceStatus: 'Status Zasobu',
      noDestination: 'Brak Miejsca',
      noData: 'Brak dostępnych danych dla zasobów NGO.'
    }
  };
  
  /** 3) Computed translator. */
  const t = computed(() => translations[language.value]);
  
  /** 4) Props for the data. */
  const props = defineProps({
    reportData: {
      type: Object,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .ngo-resources-report {
    padding: 16px;
    font-family: Arial, sans-serif;
    color: #555;
    background-color: #fdfdfd;
  }
  
  .ngo-resources-report > h1 {
    margin-bottom: 20px;
    color: #444;
  }
  
  .resources-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
  }
  
  .resources-table th,
  .resources-table td {
    padding: 8px;
    border: 1px solid #ddd;
  }
  
  .resources-table thead {
    background-color: #f9f9f9;
  }
  
  .no-data {
    margin-top: 12px;
    font-style: italic;
    color: #888;
  }
  </style>
  