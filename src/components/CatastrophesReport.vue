<template>
    <div class="catastrophes-report">
      <!-- Localized heading for the entire list of catastrophes -->
      <h1>{{ t.catastrophesHeading }}</h1>
  
      <div
        v-for="catastrophe in reportData.data"
        :key="catastrophe.id"
        class="catastrophe-item"
      >
        <div class="catastrophe-summary" @click="toggleExpand(catastrophe.id)">
          <strong class="catastrophe-type">{{ catastrophe.type }}</strong>
          <span class="coordinates">
            (Longitude: {{ catastrophe.longitude }}, Latitude: {{ catastrophe.latitude }})
          </span>
          <span class="reported-date">
            <!-- e.g. "Reported On: 2025-01-01, ID: 123" -->
            {{ t.reportedOn }}: {{ catastrophe.reportedDate.split('T')[0] }},
            {{ t.id }}: {{ catastrophe.id }}
          </span>
          <span class="active-status">
            {{ t.active }}: {{ catastrophe.active ? t.yes : t.no }}
          </span>
        </div>
  
        <!-- Expand area for help requests -->
        <transition name="expand">
          <div v-if="expandedId === catastrophe.id" class="help-requests-container">
            <h3>{{ t.helpRequestsHeading }}</h3>
  
            <!-- If helpRequests exist, render a table. Otherwise, show a fallback message. -->
            <table
              v-if="catastrophe.helpRequests && catastrophe.helpRequests.length"
              class="help-requests-table"
            >
              <thead>
                <tr>
                  <th>{{ t.id }}</th>
                  <th>{{ t.firstName }}</th>
                  <th>{{ t.lastName }}</th>
                  <th>{{ t.email }}</th>
                  <th>{{ t.emailLanguage }}</th>
                  <th>{{ t.description }}</th>
                  <th>{{ t.status }}</th>
                  <th>{{ t.uniqueCode }}</th>
                  <th>{{ t.reportedDate }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="helpReq in catastrophe.helpRequests"
                  :key="helpReq.id"
                >
                  <td>{{ helpReq.id }}</td>
                  <td>{{ helpReq.firstName }}</td>
                  <td>{{ helpReq.lastName }}</td>
                  <td>{{ helpReq.email }}</td>
                  <td>{{ helpReq.emailLanguage }}</td>
                  <td>{{ helpReq.description }}</td>
                  <td>{{ helpReq.status }}</td>
                  <td>{{ helpReq.uniqueCode }}</td>
                  <td>{{ helpReq.reportedDate }}</td>
                </tr>
              </tbody>
            </table>
  
            <p v-else class="no-help-requests">
              {{ t.noHelpRequests }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  /** 1) TRACK USER'S CURRENT LANGUAGE (Polish by default). */
  const language = ref(localStorage.getItem('language') || 'pl');
  
  /**
   * 2) TRANSLATIONS DICTIONARY:
   *    Adjust or expand these keys/values to match your needs.
   */
  const translations = {
    pl: {
      catastrophesHeading: 'Katastrofy',
      reportedOn: 'Data Zgłoszenia',
      active: 'Aktywna',
      yes: 'Tak',
      no: 'Nie',
      helpRequestsHeading: 'Prośby o pomoc',
      noHelpRequests: 'Brak próśb o pomoc dla tej katastrofy.',
      id: 'ID',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'Email',
      emailLanguage: 'Język Emaila',
      description: 'Opis',
      status: 'Status',
      uniqueCode: 'Kod Unikatowy',
      reportedDate: 'Data Zgłoszenia'
    },
    en: {
      catastrophesHeading: 'Catastrophes',
      reportedOn: 'Reported On',
      active: 'Active',
      yes: 'Yes',
      no: 'No',
      helpRequestsHeading: 'Help Requests',
      noHelpRequests: 'No help requests for this catastrophe.',
      id: 'ID',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      emailLanguage: 'Email Language',
      description: 'Description',
      status: 'Status',
      uniqueCode: 'Unique Code',
      reportedDate: 'Reported Date'
    }
  };
  
  /** 3) A computed reference to the correct translation object. */
  const t = computed(() => translations[language.value]);
  
  /** 4) PROPS: We'll receive `reportData` from the parent. */
  defineProps({
    reportData: {
      type: Object,
      required: true
    }
  });
  
  /** 5) Expand/Collapse logic: track which catastrophe is expanded. */
  const expandedId = ref(null);
  
  function toggleExpand(catastropheId) {
    expandedId.value = (expandedId.value === catastropheId) ? null : catastropheId;
  }
  </script>
  
  <style scoped>
  .catastrophes-report {
    padding: 16px;
    font-family: Arial, sans-serif;
    color: #555; /* mild text color */
    background-color: #fdfdfd; /* overall light background */
  }
  
  .catastrophes-report > h1 {
    margin-bottom: 20px;
    color: #444; /* slightly darker for headings */
  }
  
  /* Each catastrophe container */
  .catastrophe-item {
    border: 1px solid #ddd;
    margin: 16px 0;
    padding: 12px;
    cursor: pointer;
    background-color: #fcfcfc;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  .catastrophe-item:hover {
    background-color: #f2f2f2;
  }
  
  /* Summary row (clickable) */
  .catastrophe-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-weight: bold;
    align-items: center;
  }
  .catastrophe-type {
    color: #555;
  }
  .coordinates {
    color: #666;
  }
  .reported-date {
    color: #777;
  }
  .active-status {
    margin-left: auto; /* push to the far right */
  }
  
  /* Expand area (help requests) */
  .help-requests-container {
    margin-top: 12px;
    padding: 12px;
    background-color: #fff;
    border-radius: 4px;
  }
  
  /* Table styling */
  .help-requests-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #fff;
  }
  .help-requests-table th,
  .help-requests-table td {
    padding: 8px;
    border: 1px solid #ddd;
  }
  .help-requests-table thead {
    background-color: #f9f9f9;
  }
  
  .no-help-requests {
    margin-top: 10px;
    font-style: italic;
    color: #888;
  }
  
  /* Transition for expand/collapse */
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s ease;
  }
  .expand-enter,
  .expand-leave-to {
    opacity: 0;
    max-height: 0;
  }
  </style>
  