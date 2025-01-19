<template>
    <div class="giver-resources-report">
      <!-- i18n: <h1>{{ $t('reportTitles.giverResources') }}</h1> -->
      <h1>Giver Resources</h1>
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
      <p v-else>No data available for Giver Resources.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GiverResourcesReport',
    props: {
      reportData: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .giver-resources-report {

  }
  table {

  }
  </style>
  