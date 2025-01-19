<template>
  <div class="report-giver">
    <h1>Giver Report</h1>
    <h1>Dziekujemy za wsparcie!</h1>
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
  name: "GiverReport",
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
    const giverId = query.giverId || '1';

    const url = '/report/getGiver?giverId=' + giverId;
    this.reportData = await reportService.fetchReport(url);
  }
};
</script>

<style scoped>
.report-giver {
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
