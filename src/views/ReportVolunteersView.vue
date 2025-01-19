<template>
  <div class="report-volunteers-view">
    <h1>Volunteer Archive Report</h1>
    <h1>Wolontariusze</h1>
    <table>
      <thead>
      <tr>
        <th>Volunteer Username</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Available</th>
        <th>Ready for Mark</th>
        <th>Birth Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="volunteer in reportData.data" :key="volunteer.volunteer.id">
        <td>{{ volunteer.volunteer.username }}</td>
        <td>{{ volunteer.volunteer.email }}</td>
        <td>{{ volunteer.volunteer.phone }}</td>
        <td>{{ volunteer.volunteer.role }}</td>
        <td>{{ volunteer.volunteer.available ? 'Yes' : 'No' }}</td>
        <td>{{ volunteer.volunteer.readyForMark ? 'Yes' : 'No' }}</td>
        <td>{{ volunteer.volunteer.birthDate }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ReportVolunteersView",
  data() {
    return {
      reportData: {
        timestamp: "2025-01-18T14:08:42.882740691",
        dateFrom: "2022-01-02",
        dateTo: "2024-04-02",
        data: [
          {
            volunteer: {
              id: 1,
              username: "Volunteer1",
              email: "vol@gmail.com",
              phone: "string",
              role: "VOLUNTEER",
              available: false,
              readyForMark: false,
              birthDate: "2025-01-18T13:02:57.187+00:00"
            },
            actions: []
          },
          {
            volunteer: {
              id: 2,
              username: "Volunteer2",
              email: "vol2@gmail.com",
              phone: "string",
              role: "VOLUNTEER",
              available: false,
              readyForMark: false,
              birthDate: "2025-01-18T13:02:57.187+00:00"
            },
            actions: []
          }
        ],
        reportType: "ARCHIVE_VOLUNTEERS"
      }
    };
  }
};
</script>

<style scoped>
.report-volunteers-view {
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
