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
export default {
  name: "ReportResourcesView",
  data() {
    return {
      reportData: {
        timestamp: "2025-01-18T14:07:25.647311848",
        dateFrom: "2022-01-02",
        dateTo: "2024-04-02",
        data: [
          {
            id: 1,
            destinationId: null,
            holderId: 1,
            resourceType: "CLOTHES",
            resourceStatus: "REGISTERED",
            description: "clothes for children",
            amount: 2,
            date_of_registration: "2025-01-18"
          },
          {
            id: 2,
            destinationId: null,
            holderId: 2,
            resourceType: "CLOTHES",
            resourceStatus: "REGISTERED",
            description: "clothes for children",
            amount: 2,
            date_of_registration: "2025-01-18"
          },
          {
            id: 3,
            destinationId: null,
            holderId: 2,
            resourceType: "FOOD",
            resourceStatus: "REGISTERED",
            description: "food for starving children",
            amount: 2,
            date_of_registration: "2025-01-18"
          },
          {
            id: 4,
            destinationId: 1,
            holderId: 1,
            resourceType: "MEDICALSUPPLIES",
            resourceStatus: "REGISTERED",
            description: "medicine with DESTINATION",
            amount: 1,
            date_of_registration: "2025-01-18"
          },
          {
            id: 5,
            destinationId: 1,
            holderId: 1,
            resourceType: "MEDICALSUPPLIES",
            resourceStatus: "REGISTERED",
            description: "medicine with DESTINATION",
            amount: 1,
            date_of_registration: "2025-01-18"
          }
        ],
        reportType: "ACTIVE_NGO_RESOURCES"
      }
    };
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
