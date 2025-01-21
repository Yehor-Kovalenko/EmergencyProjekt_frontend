<template>
  <div class="actions-page">
    <h1>Volunteer Actions</h1>
    <table>
      <thead>
        <tr>
          <th>Action ID</th>
          <th>Volunteer ID</th>
          <th>Catastrophe ID</th>
          <th>Rating</th>
          <th>Attendance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="action in actions" :key="action.actionId">
          <td>{{ action.actionId }}</td>
          <td>{{ action.volunteerId }}</td>
          <td>{{ action.catastropheId }}</td>
          <td>{{ action.ratingFromAction }}</td>
          <td>{{ action.attendance ? "Yes" : "No" }}</td>
          <td>
            <button
              v-if="!action.attendance"
              @click="goToAccept(action.actionId)"
            >
              Go to accept
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
export default {
  setup() {
    const actions = ref([]);
    const userId = localStorage.getItem("userId");
    const router = useRouter();

    const fetchActions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/volunteers/${userId}/actions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        actions.value = response.data;
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
    };

    const goToAccept = (actionId) => {
      router.push(`/volunteers/${userId}/actions/${actionId}`);
    };

    onMounted(() => {
      fetchActions();
    });

    return {
      actions,
      goToAccept,
    };
  },
};
</script>

<style>
.actions-page {
  padding: 20px;
  text-align: center;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 90%;
}

thead {
  background-color: #f4f4f4;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #4caf50;
  color: white;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
