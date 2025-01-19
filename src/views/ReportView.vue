<template>
  <div class="report-view">
    <h1>{{ t.reportGenerationHeader }}</h1>
    <p class="report-view-description">
      {{ t.reportGenerationDescription }}
    </p>

    <!-- Example extra content: You can insert more sections or links here. -->
    <div class="report-links">
      <p>{{ t.chooseReportType }}</p>
      <!-- Could be buttons or links to route user to different pages. -->
      <button @click="$router.push('/report-date')">{{ t.archiveReports }}</button>
      <button @click="$router.push('/report-type')">{{ t.currentReports }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

/** 1) Track user's current language (Polish by default). */
const language = ref(localStorage.getItem('language') || 'pl');

/**
 * 2) Translations dictionary for EN/PL.
 *    Feel free to rename or add more keys as needed.
 */
const translations = {
  en: {
    reportGenerationHeader: 'Report Generation for Government Officials',
    reportGenerationDescription: 'Generate data reports for review and analysis.',
    chooseReportType: 'Choose a report type or use the links above to navigate.',
    archiveReports: 'Archive Reports',
    currentReports: 'Current Reports'
  },
  pl: {
    reportGenerationHeader: 'Generowanie Raportów dla Urzędników Państwowych',
    reportGenerationDescription: 'Generuj raporty danych do przeglądu i analizy.',
    chooseReportType: 'Wybierz rodzaj raportu lub skorzystaj z linków powniżej.',
    archiveReports: 'Raporty Archiwalne',
    currentReports: 'Bieżące Raporty'
  }
};

/** 3) Computed reference to the correct language strings. */
const t = computed(() => translations[language.value]);
</script>

<style scoped>
.report-view {
  padding: 16px;
  font-family: Arial, sans-serif;
  background-color: #fdfdfd;
  color: #555;
}

.report-view h1 {
  color: #444;
  margin-bottom: 12px;
}

.report-view-description {
  margin-bottom: 20px;
  line-height: 1.5;
  color: #666;
}

.report-links {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fcfcfc;
}

.report-links p {
  margin: 0;
}

.report-links button {
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.report-links button:hover {
  background-color: #0056b3;
}
</style>
