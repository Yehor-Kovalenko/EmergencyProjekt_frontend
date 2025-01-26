<template>
    <div class="giver-resources-report">
      <h1>{{ t.heading }}</h1>
      <div>
        <strong> {{ t.total }}: {{ reportData.data.length }} </strong>
      </div>
      <table
        v-if="reportData && reportData.data && reportData.data.length"
        class="giver-table"
      >
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
  
  /** 1) Language ref. */
  const language = ref(localStorage.getItem('language') || 'pl');
  
  /** 2) Translations. */
  const translations = {
    en: {
      heading: 'Giver Resources',
      resourceType: 'Resource Type',
      description: 'Description',
      amount: 'Amount',
      dateOfRegistration: 'Date of Registration',
      destinationId: 'Destination ID',
      resourceStatus: 'Resource Status',
      noDestination: 'No Destination',
      noData: 'No data available for Giver Resources.',
      total: 'Total Resources'
    },
    pl: {
      heading: 'Zasoby Darczyńcy',
      resourceType: 'Rodzaj Zasobu',
      description: 'Opis',
      amount: 'Ilość',
      dateOfRegistration: 'Data Rejestracji',
      destinationId: 'ID Miejsca Przeznaczenia',
      resourceStatus: 'Status Zasobu',
      noDestination: 'Brak Miejsca',
      noData: 'Brak zasobów darczyńcy.',
      total: 'Wszystkie zasoby'
    }
  };
  
  /** 3) Translator. */
  const t = computed(() => translations[language.value]);
  
  /** 4) Props. */
  const props = defineProps({
    reportData: {
      type: Object,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .giver-resources-report {
    padding: 16px;
    font-family: Arial, sans-serif;
    color: #555;
    background-color: #fdfdfd;
  }
  
  .giver-resources-report > h1 {
    margin-bottom: 20px;
    color: #444;
  }
  
  .giver-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
  }
  .giver-table th,
  .giver-table td {
    padding: 8px;
    border: 1px solid #ddd;
  }
  .giver-table thead {
    background-color: #f9f9f9;
  }
  
  .no-data {
    margin-top: 12px;
    font-style: italic;
    color: #888;
  }
  </style>
  