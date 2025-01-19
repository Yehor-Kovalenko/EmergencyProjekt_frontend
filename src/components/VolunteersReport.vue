<template>
    <div class="volunteers-report">
      <h1>Volunteers</h1>
  
      <div
        v-for="volunteerAndActions in reportData.data"
        :key="volunteerAndActions.volunteer.id"
        class="volunteer-item"
      >
        <div class="volunteer-summary" @click="toggleExpand(volunteerAndActions.volunteer.id)">
          <strong class="volunteer-name">Name: {{ volunteerAndActions.volunteer.firstName + " " + volunteerAndActions.volunteer.lastName }}</strong>
          <span class="volunteer-active">Email: {{ volunteerAndActions.volunteer.email }}</span>
          <span class="volunteer-rating">NGO ID: {{ volunteerAndActions.volunteer.organizationId }}</span>
          <span class="volunteer-active">Available: {{ volunteerAndActions.volunteer.available ? 'Yes' : 'No' }}</span>
          <span class="volunteer-active">Ready for Mark: {{ volunteerAndActions.volunteer.readyForMark ? 'Yes' : 'No' }}</span>
        </div>
  
        <transition name="expand">
          <div v-if="expandedId === volunteerAndActions.volunteer.id" class="volunteer-actions">
            <h3>Actions</h3>
  
            <table
              v-if="volunteerAndActions.actions && volunteerAndActions.actions.length"
              class="actions-table"
            >
              <thead>
                <tr>
                  <th>Catastrophe ID</th>
                  <th>Rating from Action</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="action in volunteerAndActions.actions" :key="action.actionId">
                  <td>{{ action.catastropheId }}</td>
                  <td>{{ action.ratingFromAction }}</td>
                  <td>{{ action.attendance ? 'Yes' : 'No' }}</td>
                </tr>
              </tbody>
            </table>
  
            <p
              v-else
              class="no-actions"
            >
              No actions found for this volunteer.
            </p>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VolunteersReport',
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
      toggleExpand(volunteerId) {
        this.expandedId = (this.expandedId === volunteerId) ? null : volunteerId;
      }
    }
  };
  </script>
  
  <style scoped>
  .volunteers-report {
    padding: 16px;
    font-family: Arial, sans-serif;
    color: #555;
    background-color: #fdfdfd;
  }
  
  .volunteers-report > h1 {
    margin-bottom: 20px;
    color: #444;
  }
  
  /* Each volunteer container */
  .volunteer-item {
    border: 1px solid #ddd;
    margin: 16px 0;
    padding: 12px;
    cursor: pointer;
    background-color: #fcfcfc;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  .volunteer-item:hover {
    background-color: #f2f2f2;
  }
  
  /* Summary row (clickable) */
  .volunteer-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-weight: bold;
    align-items: center;
  }
  .volunteer-name {
    color: #555;
  }
  .volunteer-rating {
    color: #666;
  }
  .volunteer-active {
    margin-left: auto;
  }
  
  /* Expanded "actions" container */
  .volunteer-actions {
    margin-top: 12px;
    padding: 12px;
    background-color: #fff;
    border-radius: 4px;
  }
  
  /* Actions table */
  .actions-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #fff;
  }
  .actions-table th,
  .actions-table td {
    padding: 8px;
    border: 1px solid #ddd;
  }
  .actions-table thead {
    background-color: #f9f9f9;
  }
  
  .no-actions {
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
  