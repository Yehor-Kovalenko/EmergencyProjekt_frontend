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
export default {
  name: "ReportCatastrophesView",
  data() {
    return {
      reportData: {
        timestamp: "2025-01-18T14:09:17.935380433",
        dateFrom: "2022-01-02",
        dateTo: "2024-04-02",
        data: [
          {
            id: 1,
            type: "FLOOD",
            longitude: 6232,
            latitude: 9872,
            reportedDate: "2025-01-18T14:04:24.631036",
            active: false
          },
          {
            id: 2,
            type: "BAD_THING",
            longitude: 6232,
            latitude: 9872,
            reportedDate: "2025-01-18T14:04:28.698986",
            active: false
          }
        ],
        reportType: "ARCHIVE_CATASTROPHES"
      }
    };
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
