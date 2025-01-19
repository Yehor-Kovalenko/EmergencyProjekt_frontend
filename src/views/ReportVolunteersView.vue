<template>
  <div class="report-volunteers-view">
    <h1>Volunteer Archive Report</h1>
    <h1>Wolontariusze</h1>
    <table>
      <thead>
      <tr>
        <th>Volunteer Username</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Available</th>
        <th>Ready for Mark</th>
        <th>Birth Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="volunteer in reportData.data" :key="volunteer.volunteer.id">
        <td>{{ volunteer.username }}</td>
        <td>{{ volunteer.email }}</td>
        <td>{{ volunteer.phone }}</td>
        <td>{{ volunteer.role }}</td>
        <td>{{ volunteer.available ? 'Yes' : 'No' }}</td>
        <td>{{ volunteer.readyForMark ? 'Yes' : 'No' }}</td>
        <td>{{ volunteer.birthDate }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// GET DATA FROM BACKEND

import { reportService } from '@/services/reportService';
export default {
  name: "ReportVolunteersView",
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
    const reportType = query.reportType || 'ACTIVE_VOLUNTEERS';
    const dateFrom = query.dateFrom || '2020-01-01';
    const dateTo = query.dateTo || '2026-01-01';

    const url = '/report/getGovernment?reportType=' + reportType + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
    this.reportData = await reportService.fetchReport(url);
  }
};
</script>


<style scoped>
.report-volunteers-view {
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
