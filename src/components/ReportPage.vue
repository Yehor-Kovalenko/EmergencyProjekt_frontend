<template>
    <div class="report-page">
      <!-- Reusable Header Component -->
      <ReportHeader
        :report-type="reportType"
        :date-from="dateFrom"
        :date-to="dateTo"
        :giver-id="giverId"
      />
  
      <!-- Dynamically load the sub-component based on reportType -->
      <component :is="currentReportComponent" :report-data="reportData" />
    </div>
  </template>
  
  <script>
  import { reportService } from '@/services/reportService';
  import ReportHeader from '@/components/ReportHeader.vue';
  
  // These are your specialized “view” components. 
  import {ref} from 'vue';
  import GiverResourcesReport from '@/components/GiverResourcesReport.vue';
  import NgoResourcesReport from '@/components/NgoResourcesReport.vue';
  import CatastrophesReport from '@/components/CatastrophesReport.vue';
  import VolunteersReport from '@/components/VolunteersReport.vue' // if/when needed
  
  export default {
    name: 'ReportPage',
    components: {
      ReportHeader,
      GiverResourcesReport,
      NgoResourcesReport,
      CatastrophesReport,
      VolunteersReport,
    },
    data() {
    return {
        reportData: { data: [] },  // Instead of null
        reportType: null,
        dateFrom: null,
        dateTo: null,
        giverId: null,
    };
    },

    computed: {
      // Decide which component to render based on the `reportType`
      currentReportComponent() {
        // You can adapt this map as needed
        const map = {
          GIVER_RESOURCES: 'GiverResourcesReport',
          NGO_RESOURCES: 'NgoResourcesReport',
          CATASTROPHES: 'CatastrophesReport',
          VOLUNTEERS: 'VolunteersReport'
        };
        
        // If we have something like ACTIVE_CATASTROPHES, 
        // you could parse out the actual base type from the string.
        if (this.reportType.includes('CATASTROPHES')) {
          return 'CatastrophesReport';
        } else if (this.reportType.includes('NGO')) {
          return 'NgoResourcesReport';
        } else if (this.reportType.includes('GIVER')) {
          return 'GiverResourcesReport';
        } else if (this.reportType.includes('VOLUNTEERS')) {
          return 'VolunteersReport';
        }
        // etc.
  
        // default fallback if no match
        return 'NgoResourcesReport';
      },
    },
    async created() {
      // Parse query params
      const query = this.$route.query;
  
      this.reportType = query.reportType || 'ACTIVE_NGO_RESOURCES';
      this.dateFrom = query.dateFrom || '1900-01-01';
      this.dateTo = query.dateTo || '2100-01-01';
      this.giverId = query.giverId || null;

      if (this.$route.path === '/report-giver') {
        this.reportType = 'GIVER_RESOURCES';
      }
  
      // Construct the endpoint URL(s)
      // You might want to unify this logic into a separate function or even
      // do a small “reportType -> url” mapping for clarity
      let url;
      if (this.reportType.includes('GIVER_RESOURCES')) {
        const fallbackGiverId = '3';
        const userId = ref(localStorage.getItem('userId') || fallbackGiverId).value;
        url = `/report/getGiver?giverId=${userId}`;
        console.log(url);
      } else {
        // Example: /report/getGovernment?reportType=...&dateFrom=...&dateTo=...
        url = `/report/getGovernment?reportType=${this.reportType}&dateFrom=${this.dateFrom}&dateTo=${this.dateTo}`;
      }
  
      // Fetch data
      try {
        const response = await reportService.fetchReport(url);
        this.reportData = response;
      } catch (error) {
        console.error('Error fetching report data:', error);
        // Potentially handle the error state
        this.reportData = { data: [] };
      }

      console.log('Report data:', this.reportData);
    }
  };
  </script>
  
  <style scoped>
  .report-page {
    /* page-level styling, if any */
  }
  </style>
  