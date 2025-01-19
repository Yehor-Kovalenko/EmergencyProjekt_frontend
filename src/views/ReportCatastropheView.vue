<template>
  <div class="report-catastrophes-view">
    <h1>Catastrophes Archive Report</h1>
    <h1>Katastrofy</h1>
    <table>
      <thead>
      <tr>
        <th>Catastrophe Type</th>
        <th>Longitude</th>
        <th>Latitude</th>
        <th>Reported Date</th>
        <th>Active</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="catastrophe in reportData.data" :key="catastrophe.id">
        <td>{{ catastrophe.type }}</td>
        <td>{{ catastrophe.longitude }}</td>
        <td>{{ catastrophe.latitude }}</td>
        <td>{{ catastrophe.reportedDate }}</td>
        <td>{{ catastrophe.active ? 'Yes' : 'No' }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { reportService } from '@/services/reportService';

// GET DATA FROM BACKEND
export default {
  name: "ReportCatastrophesView",
  data() {
    return {
      reportData: {
        data: []
      }
    };
  },
  async created() {
    // REPLACE WITH DATA FROM PREVIOUS PAGE
    const query = this.$route.query;
    const reportType = query.reportType || 'ARCHIVE_CATASTROPHES';
    const dateFrom = query.dateFrom || '2020-01-01';
    const dateTo = query.dateTo || '2026-01-01';

    const url = '/report/getGovernment?reportType=' + reportType + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    this.reportData = await reportService.fetchReport(url);
  }
};
</script>

<style scoped>
.report-catastrophes-view {
  padding: 20px;
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: rgba(0, 189, 126, 0.2);
}
</style>
