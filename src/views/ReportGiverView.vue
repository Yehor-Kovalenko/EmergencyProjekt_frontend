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

<!--Here we have bunch of random example data, that is supposed to be replaced with actual data from api later on-->
<script>
export default {
  name: "GiverReport",
  data() {
    return {
      reportData: {
        timestamp: "2025-01-18T14:06:11.689152185",
        dateFrom: null,
        dateTo: null,
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
        reportType: "GIVER_RESOURCES"
      }
    };
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
