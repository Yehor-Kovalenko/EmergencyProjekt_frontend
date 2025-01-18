<template>
  <div>
    <h1>To jest komponent ReportView z perspektywy Władz</h1>
    <button class="long-button" @click="goToCurrentReport">Teraźniejszy Raport</button>
    <button class="long-button" @click="goToArchiveReport">Archiwalny Raport</button>
    <h1>/Logika oparta o diagram Czynności - Wybieranie raportu przez władze/</h1>
  </div>
</template>

<script>
export default {
  name: 'ReportView',
  methods: {
    goToCurrentReport() {
      this.$router.push({ name: 'report-type' });
    },
    goToArchiveReport() {
      this.$router.push({ name: 'report-date' });
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
</style>
