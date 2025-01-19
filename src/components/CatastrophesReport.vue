<template>
    <div class="catastrophes-report">
      <h1>Catastrophes</h1>
  
      <div
        v-for="catastrophe in reportData.data"
        :key="catastrophe.id"
        class="catastrophe-item"
      >
        <div class="catastrophe-summary" @click="toggleExpand(catastrophe.id)">
          <!-- Basic catastrophe fields displayed -->
          <strong class="catastrophe-type">{{ catastrophe.type }}</strong>
          <span class="coordinates">
            (Longitude: {{ catastrophe.longitude }}, Latitude: {{ catastrophe.latitude }})
          </span>
          <span class="reported-date">Reported On: {{ catastrophe.reportedDate.split('T')[0] + ", ID: " + catastrophe.id}}</span>
          <span class="active-status">Active: {{ catastrophe.active ? 'Yes' : 'No' }}</span>
        </div>
  
        <!-- Show the help requests if expanded -->
        <transition name="expand">
          <div v-if="expandedId === catastrophe.id" class="help-requests-container">
            <h3>Help Requests</h3>
  
            <!-- If there's no helpRequests array or it's empty, you can conditionally show a fallback -->
            <table
              v-if="catastrophe.helpRequests && catastrophe.helpRequests.length"
              class="help-requests-table"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Email Language</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Unique Code</th>
                  <th>Reported Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="helpReq in catastrophe.helpRequests"
                  :key="helpReq.id"
                >
                  <td>{{ helpReq.id }}</td>
                  <td>{{ helpReq.firstName }}</td>
                  <td>{{ helpReq.lastName }}</td>
                  <td>{{ helpReq.email }}</td>
                  <td>{{ helpReq.emailLanguage }}</td>
                  <td>{{ helpReq.description }}</td>
                  <td>{{ helpReq.status }}</td>
                  <td>{{ helpReq.uniqueCode }}</td>
                  <td>{{ helpReq.reportedDate }}</td>
                </tr>
              </tbody>
            </table>
  
            <p
              v-else
              class="no-help-requests"
            >
              No help requests for this catastrophe.
            </p>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CatastrophesReport',
    props: {
      reportData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        expandedId: null
      };
    },
    methods: {
      toggleExpand(catastropheId) {
        this.expandedId = (this.expandedId === catastropheId) ? null : catastropheId;
      }
    }
  };
  </script>
  
  <style scoped>
  /* 
    Mild, neutral palette with simple, light backgrounds and subtle borders.
  */
  
  .catastrophes-report {
    padding: 16px;
    font-family: Arial, sans-serif;
    color: #555; /* mild text color */
    background-color: #fdfdfd; /* overall light background */
  }
  
  /* Header */
  .catastrophes-report > h1 {
    margin-bottom: 20px;
    color: #444; /* slightly darker for headings */
  }
  
  /* Individual catastrophe container */
  .catastrophe-item {
    border: 1px solid #ddd;
    margin: 16px 0;
    padding: 12px;
    cursor: pointer;
    background-color: #fcfcfc;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  .catastrophe-item:hover {
    background-color: #f2f2f2;
  }
  
  /* Summary row (clickable) */
  .catastrophe-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-weight: bold;
    align-items: center;
  }
  .catastrophe-type {
    color: #555;
  }
  .coordinates {
    color: #666;
  }
  .reported-date {
    color: #777;
  }
  .active-status {
    margin-left: auto; /* push to the far right */
  }
  
  /* Expand area (help requests) */
  .help-requests-container {
    margin-top: 12px;
    padding: 12px;
    background-color: #fff;
    border-radius: 4px;
  }
  
  /* Table styling */
  .help-requests-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #fff;
  }
  .help-requests-table th,
  .help-requests-table td {
    padding: 8px;
    border: 1px solid #ddd;
  }
  .help-requests-table thead {
    background-color: #f9f9f9;
  }
  
  .no-help-requests {
    margin-top: 10px;
    font-style: italic;
    color: #888;
  }
  
  /* Transition for expand/collapse */
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s ease;
  }
  .expand-enter,
  .expand-leave-to {
    opacity: 0;
    max-height: 0;
  }
  </style>
  