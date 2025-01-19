<template>
    <div class="ngo-resources-report">
      <h1>NGO Resources</h1>
  
      <table v-if="reportData && reportData.data">
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
      <p v-else>No data available for NGO Resources.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NgoResourcesReport',
    props: {
      reportData: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .ngo-resources-report {
    
  }
  </style>
  