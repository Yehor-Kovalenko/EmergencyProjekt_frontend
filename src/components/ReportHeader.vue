<template>
    <header class="report-header">
      <h2>{{ headerTitle }}</h2>
  
      <!-- If date range is relevant, show them -->
      <div v-if="showDateRange">
        <p>
          <strong>Date From:</strong> {{ dateFrom }}
        </p>
        <p>
          <strong>Date To:</strong> {{ dateTo }}
        </p>
      </div>
  
      <!-- If we are dealing with a Giver, show ID (if you want) -->
      <div v-if="giverId">
        <p>
          <strong>Giver ID:</strong> {{ giverId }}
        </p>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'ReportHeader',
    props: {
      reportType: {
        type: String,
        required: true
      },
      dateFrom: {
        type: String,
        default: null
      },
      dateTo: {
        type: String,
        default: null
      },
      giverId: {
        type: String,
        default: null
      }
    },
    computed: {
      headerTitle() {
        // For i18n, you'd do something like $t('reports.' + this.reportType)
        return `Report: ${this.reportType}`;
      },
      showDateRange() {
        // Typically you'd only show date range if it's "ARCHIVE" or "ACTIVE" type
        // Adjust logic as needed
        return (
          this.reportType.includes('ARCHIVE')
        );
      }
    }
  };
  </script>
  
  <style scoped>
  .report-header {
    border-bottom: 1px solid #ccc;
    margin-bottom: 16px;
  }
  </style>
  