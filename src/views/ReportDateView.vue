<template>
  <div class="date-report-view">
    <h1>{{ t.archiveReport }}</h1>

    <div class="date-picker">
      <label for="dateFrom">{{ t.startDateLabel }}</label>
      <input
        type="date"
        id="dateFrom"
        v-model="dateFrom"
        class="date-input"
      />
    </div>

    <div class="date-picker">
      <label for="dateTo">{{ t.endDateLabel }}</label>
      <input
        type="date"
        id="dateTo"
        v-model="dateTo"
        class="date-input"
      />
    </div>

    <button
      class="long-button"
      :disabled="!dateFrom || !dateTo"
      @click="continueReport"
    >
      {{ t.continue }}
    </button>

    <button class="long-button" @click="goBack">
      {{ t.back }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

/** 1) Track user language. */
const language = ref(localStorage.getItem('language') || 'pl');

/** 2) Translations dictionary. */
const translations = {
  en: {
    archiveReport: 'Archive Report',
    startDateLabel: 'Start Date:',
    endDateLabel: 'End Date:',
    continue: 'Continue',
    back: 'Back'
  },
  pl: {
    archiveReport: 'Archiwalny Raport',
    startDateLabel: 'Data początkowa:',
    endDateLabel: 'Data końcowa:',
    continue: 'Kontynuuj',
    back: 'Powrót'
  }
};

/** 3) Computed reference to the correct language strings. */
const t = computed(() => translations[language.value]);

/** 4) State for the date inputs. */
const dateFrom = ref(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10));
const dateTo = ref(new Date().toISOString().substr(0, 10));

const router = useRouter();

function goBack() {
  router.push({ name: 'report' });
}

function continueReport() {
  if (dateFrom.value && dateTo.value) {
    console.log(`Data początkowa: ${dateFrom.value}, Data końcowa: ${dateTo.value}`);
    router.push({
      name: 'report-type',
      query: {
        dateFrom: dateFrom.value,
        dateTo: dateTo.value
      }
    });
  }
}
</script>

<style scoped>
.date-report-view {
  font-family: Arial, sans-serif;
  color: #555;
  background-color: #fdfdfd;
  padding: 16px;
}

.date-report-view h1 {
  color: #444;
  margin-bottom: 20px;
}

.date-picker {
  margin-bottom: 10px;
}

.date-picker label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.date-input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.long-button {
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #007bff;
  transition: background-color 0.2s ease;
}

.long-button:hover {
  background-color: #0056b3;
}
</style>
