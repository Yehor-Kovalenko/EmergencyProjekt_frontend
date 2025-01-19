<template>
  <div class="report-type-view">
    <h1>{{ t.chooseReportType }}</h1>

    <button class="long-button" @click="goToReport('resources-view')">
      {{ t.physicalResourcesReport }}
    </button>
    <button class="long-button" @click="goToReport('volunteers-view')">
      {{ t.volunteersReport }}
    </button>
    <button class="long-button" @click="goToReport('catastrophe-view')">
      {{ t.catastrophesReport }}
    </button>

    <button class="long-button" @click="goBack">
      {{ t.back }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/** 1) Track user's current language (Polish by default). */
const language = ref(localStorage.getItem('language') || 'pl');

/**
 * 2) Translations dictionary for EN/PL.
 *    Add or adjust keys as you like.
 */
const translations = {
  en: {
    chooseReportType: 'Choose a report type',
    physicalResourcesReport: 'Physical Resources Report',
    volunteersReport: 'Volunteers Report',
    catastrophesReport: 'Catastrophes Report',
    back: 'Back'
  },
  pl: {
    chooseReportType: 'Wybierz rodzaj raportu',
    physicalResourcesReport: 'Raport zasobów fizycznych',
    volunteersReport: 'Raport wolontariuszy',
    catastrophesReport: 'Raport zdarzeń',
    back: 'Powrót'
  }
};

/** 3) Computed reference to the correct language strings. */
const t = computed(() => translations[language.value]);

/** 4) Use Vue Router to navigate. */
const router = useRouter();
const route = useRoute();

function goBack() {
  router.push({ name: 'report' });
}

/**
 * 5) Build the `reportType` string dynamically and navigate to the chosen route/view.
 *    We check if the route query has dateFrom/dateTo to decide between 'ACTIVE_' or 'ARCHIVE_'.
 */
function goToReport(viewType) {
  let reportType = '';

  if (!route.query.dateFrom || !route.query.dateTo) {
    reportType += 'ACTIVE_';
  } else {
    reportType += 'ARCHIVE_';
  }

  if (viewType === 'resources-view') {
    reportType += 'NGO_RESOURCES';
  } else if (viewType === 'volunteers-view') {
    reportType += 'VOLUNTEERS';
  } else if (viewType === 'catastrophe-view') {
    reportType += 'CATASTROPHES';
  }

  console.log('Navigating to report type:', reportType);
  router.push({
    name: viewType,
    query: {
      reportType,
      dateFrom: route.query.dateFrom,
      dateTo: route.query.dateTo
    }
  });
}
</script>

<style scoped>
.report-type-view {
  font-family: Arial, sans-serif;
  color: #555;
  background-color: #fdfdfd;
  padding: 16px;
}

.report-type-view h1 {
  color: #444;
  margin-bottom: 20px;
}

.long-button {
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fcfcfc;
  transition: background-color 0.2s ease;
}

.long-button:hover {
  background-color: #f0f0f0;
}
</style>
