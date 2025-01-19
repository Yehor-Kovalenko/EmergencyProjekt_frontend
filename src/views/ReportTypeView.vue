<template>
  <div>
    <h1>Wybierz rodzaj raportu</h1>
    <button class="long-button" @click="goToReport('resources-view')">Raport zasobów fizycznych</button>
    <button class="long-button" @click="goToReport('volunteers-view')">Raport wolontariuszy</button>
    <button class="long-button" @click="goToReport('catastrophe-view')">Raport zdarzeń</button>
    <button class="long-button" @click="goBack">Powrót</button>
  </div>
</template>

<script>
export default {
  name: 'ReportTypeView',
  methods: {
    goBack() {
      this.$router.push({ name: 'report' }); // Go back to the previous or main report page
    },
    goToReport(viewType) {
    // Navigate to the corresponding report view based on the provided viewType
    let reportType = "";

    if (!this.$route.query.dateFrom || !this.$route.query.dateTo) {
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
    this.$router.push({
      name: viewType,
      query: {
        reportType: reportType,
        dateFrom: this.$route.query.dateFrom,
        dateTo: this.$route.query.dateTo
      }
    });
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
