<template>
  <div>
    <h1>Archiwalny Raport</h1>
    <div class="date-picker">
      <label for="dateFrom">Data początkowa:</label>
      <input
          type="date"
          id="dateFrom"
          v-model="dateFrom"
          class="date-input"
      />
    </div>
    <div class="date-picker">
      <label for="dateTo">Data końcowa:</label>
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
        @click="continueReport">
      Kontynuuj
    </button>
    <button class="long-button" @click="goBack">Powrót</button>
  </div>
</template>

<script>
export default {
  name: 'DateReport',
  data() {
    return {
      dateFrom: '',
      dateTo: '',
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'report' });
    },
    continueReport() {
      if (this.dateFrom && this.dateTo) {
        console.log(`Data początkowa: ${this.dateFrom}, Data końcowa: ${this.dateTo}`);
        this.$router.push({name: 'report-type',
          query: {dateFrom: this.dateFrom, dateTo: this.dateTo}
        }); // Przekierowanie do widoku wyboru rodzaju raportu
      }
    }
  }
};
</script>

<style scoped>
.long-button {
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.long-button:hover {
  background-color: #f0f0f0;
}

.date-picker {
  margin-bottom: 10px;
}

.date-input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
