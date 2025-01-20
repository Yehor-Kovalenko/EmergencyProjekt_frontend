<template>
    <div class="volunteers-report">
      <h1>{{ t.heading }}</h1>
  
      <div
        v-for="volunteerAndActions in reportData.data"
        :key="volunteerAndActions.volunteer.id"
        class="volunteer-item"
      >
        <div class="volunteer-summary" @click="toggleExpand(volunteerAndActions.volunteer.id)">
          <strong class="volunteer-name">
            {{ t.nameLabel }}: 
            {{ volunteerAndActions.volunteer.firstName }} 
            {{ volunteerAndActions.volunteer.lastName }}
          </strong>
          <span class="volunteer-email">
            {{ t.emailLabel }}: {{ volunteerAndActions.volunteer.email }}
          </span>
          <span class="volunteer-ngo">
            {{ t.ngoIdLabel }}: {{ volunteerAndActions.volunteer.organizationId }}
          </span>
          <span class="volunteer-available">
            {{ t.availableLabel }}: 
            {{ volunteerAndActions.volunteer.available ? t.yes : t.no }}
          </span>
          <span class="volunteer-ready">
            {{ t.readyForMarkLabel }}: 
            {{ volunteerAndActions.volunteer.readyForMark ? t.yes : t.no }}
          </span>
        </div>
  
        <transition name="expand">
          <div v-if="expandedId === volunteerAndActions.volunteer.id" class="volunteer-actions">
            <h3>{{ t.actionsHeading }}</h3>
  
            <table
              v-if="volunteerAndActions.actions && volunteerAndActions.actions.length"
              class="actions-table"
            >
              <thead>
                <tr>
                  <th>{{ t.catastropheId }}</th>
                  <th>{{ t.ratingFromAction }}</th>
                  <th>{{ t.attendance }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="action in volunteerAndActions.actions" :key="action.actionId">
                  <td>{{ action.catastropheId }}</td>
                  <td>{{ action.ratingFromAction }}</td>
                  <td>{{ action.attendance ? t.yes : t.no }}</td>
                </tr>
              </tbody>
            </table>
  
            <p v-else class="no-actions">
              {{ t.noActions }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  /** 1) Language handling. */
  const language = ref(localStorage.getItem('language') || 'pl');
  
  /** 2) Translations. */
  const translations = {
    en: {
      heading: 'Volunteers',
      nameLabel: 'Name',
      emailLabel: 'Email',
      ngoIdLabel: 'NGO ID',
      availableLabel: 'Available',
      readyForMarkLabel: 'Ready for Mark',
      yes: 'Yes',
      no: 'No',
      actionsHeading: 'Actions',
      catastropheId: 'Catastrophe ID',
      ratingFromAction: 'Rating from Action',
      attendance: 'Attendance',
      noActions: 'No actions found for this volunteer.'
    },
    pl: {
      heading: 'Wolontariusze',
      nameLabel: 'Imię i Nazwisko',
      emailLabel: 'Email',
      ngoIdLabel: 'ID Organizacji',
      availableLabel: 'Dostępny',
      readyForMarkLabel: 'Gotowy do Oceny',
      yes: 'Tak',
      no: 'Nie',
      actionsHeading: 'Akcje',
      catastropheId: 'ID Katastrofy',
      ratingFromAction: 'Ocena z Akcji',
      attendance: 'Obecność',
      noActions: 'Brak akcji dla tego wolontariusza.'
    }
  };
  
  /** 3) Computed translator. */
  const t = computed(() => translations[language.value]);
  
  /** 4) Props. */
  const props = defineProps({
    reportData: {
      type: Object,
      required: true
    }
  });
  
  /** 5) Expand/collapse logic. */
  const expandedId = ref(null);
  
  function toggleExpand(volunteerId) {
    expandedId.value = (expandedId.value === volunteerId) ? null : volunteerId;
  }
  </script>
  
  <style scoped>
  .volunteers-report {
    padding: 16px;
    font-family: Arial, sans-serif;
    color: #555;
    background-color: #fdfdfd;
  }
  
  .volunteers-report > h1 {
    margin-bottom: 20px;
    color: #444;
  }
  
  /* Each volunteer container */
  .volunteer-item {
    border: 1px solid #ddd;
    margin: 16px 0;
    padding: 12px;
    cursor: pointer;
    background-color: #fcfcfc;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  .volunteer-item:hover {
    background-color: #f2f2f2;
  }
  
  /* Summary row (clickable) */
  .volunteer-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-weight: bold;
    align-items: center;
  }
  .volunteer-name {
    color: #555;
  }
  .volunteer-email {
    color: #666;
  }
  .volunteer-ngo {
    color: #666;
  }
  .volunteer-available {
    margin-left: auto;
    color: #666;
  }
  .volunteer-ready {
    color: #666;
  }
  
  /* Expanded "actions" container */
  .volunteer-actions {
    margin-top: 12px;
    padding: 12px;
    background-color: #fff;
    border-radius: 4px;
  }
  
  /* Actions table */
  .actions-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #fff;
  }
  .actions-table th,
  .actions-table td {
    padding: 8px;
    border: 1px solid #ddd;
  }
  .actions-table thead {
    background-color: #f9f9f9;
  }
  
  .no-actions {
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
  