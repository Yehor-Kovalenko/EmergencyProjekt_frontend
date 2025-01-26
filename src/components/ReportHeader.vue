<template>
    <header class="report-header">
      <!-- Combine "Report:" with user-friendly name for the raw 'reportType' -->
      <h2>{{ t.reportLabel }} {{ displayReportType }}</h2>
  
      <!-- If date range is relevant, show them -->
      <div v-if="showDateRange">
        <p>
          <strong>{{ t.dateFrom }}</strong> {{ dateFrom }}
        </p>
        <p>
          <strong>{{ t.dateTo }}</strong> {{ dateTo }}
        </p>
      </div>
  
      <!-- If we are dealing with a Giver, show ID -->
      <div v-if="giverId">
        <p>
          <strong>{{ t.giverId }}</strong> {{ giverId }}
        </p>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  /** 1) Track the user's language. */
  const language = ref(localStorage.getItem('language') || 'pl');
  
  /** 
   * 2) Translations dictionary for EN/PL,
   *    *including* a sub-dictionary "reportTypeMap" for raw reportType -> user-friendly label.
   */
  const translations = {
    en: {
      reportLabel: 'Report:',
      dateFrom: 'Date From:',
      dateTo: 'Date To:',
      giverId: 'Giver ID:',
      reportTypeMap: {
        ACTIVE_VOLUNTEERS: 'Active Volunteers',
        ARCHIVE_VOLUNTEERS: 'Inactive Volunteers',
        ACTIVE_NGO_RESOURCES: 'Active NGO Resources',
        ARCHIVE_NGO_RESOURCES: 'Archived NGO Resources',
        ACTIVE_CATASTROPHES: 'Active Catastrophes',
        ARCHIVE_CATASTROPHES: 'Archived Catastrophes',
        GIVER_RESOURCES: 'Giver Resources'
        // Add more if needed
      }
    },
    pl: {
      reportLabel: 'Raport:',
      dateFrom: 'Data Od:',
      dateTo: 'Data Do:',
      giverId: 'ID Darczyńcy:',
      reportTypeMap: {
        ACTIVE_VOLUNTEERS: 'Wolontariusze (aktywni)',
        ARCHIVE_VOLUNTEERS: 'Wolontariusze (nieaktywni)',
        ACTIVE_NGO_RESOURCES: 'Zasoby NGO (aktywne)',
        ARCHIVE_NGO_RESOURCES: 'Zasoby NGO (archiwalne)',
        ACTIVE_CATASTROPHES: 'Katastrofy (aktywne)',
        ARCHIVE_CATASTROPHES: 'Katastrofy (archiwalne)',
        GIVER_RESOURCES: 'Zasoby Darczyńcy'
        // Add more if needed
      }
    }
  };
  
  /** 3) Make a computed reference to the currently selected language block. */
  const t = computed(() => translations[language.value]);
  
  /** 4) Define props from the parent. */
  const props = defineProps({
    reportType: {
      type: String,
      required: true
    },
    dateFrom: {
      type: String,
      default: null
    },
    dateTo: {
      type: String,
      default: null
    },
    giverId: {
      type: String,
      default: null
    }
  });
  
  /** 5) Decide if we show date range (your logic). */
  const showDateRange = computed(() => {
    // Example: show date range if "ARCHIVE" is in the string and does not contain "VOLUNTEERS"
    return (props.reportType.includes('ARCHIVE') && !props.reportType.includes('VOLUNTEERS'));
  });
  
  /** 
   * 6) Convert the raw "reportType" (e.g. "ACTIVE_VOLUNTEERS") to
   *    a user-friendly label in the user's language. 
   */
  const displayReportType = computed(() => {
    const map = t.value.reportTypeMap;
    // If not found in the map, just fallback to the raw string.
    return map[props.reportType] || props.reportType;
  });
  </script>
  
  <style scoped>
  .report-header {
    border-bottom: 1px solid #ccc;
    margin-bottom: 16px;
    padding-bottom: 8px;
    color: #555;
    font-family: Arial, sans-serif;
    background-color: #fdfdfd;
    padding: 12px;
    border-radius: 4px;
  }
  
  .report-header h2 {
    color: #444;
    margin: 0 0 12px 0;
  }
  
  .report-header p {
    margin: 4px 0;
    line-height: 1.4;
  }
  </style>
  