<template>
  <div class="report-resources-view">
    <h1>NGO Resource Report</h1>
    <h1>Zaosby NGO</h1>
    <table>
      <thead>
      <tr>
        <th>Resource Type</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Date of Registration</th>
        <th>Destination ID</th>
        <th>Resource Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in reportData.data" :key="item.id">
        <td>{{ item.resourceType }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.date_of_registration }}</td>
        <td>{{ item.destinationId || 'No Destination' }}</td>
        <td>{{ item.resourceStatus }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// GET DATA FROM BACKEND

import { reportService } from '@/services/reportService';
export default {
  name: "ReportResourcesView",
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
    const reportType = query.reportType || 'ACTIVE_NGO_RESOURCES';
    const dateFrom = query.dateFrom || '2020-01-01';
    const dateTo = query.dateTo || '2026-01-01';

    const url = '/report/getGovernment?reportType=' + reportType + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    this.reportData = await reportService.fetchReport(url);
  }
};
</script>


<style scoped>
.report-resources-view {
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
