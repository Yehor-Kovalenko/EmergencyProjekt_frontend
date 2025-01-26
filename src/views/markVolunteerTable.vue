<template>
  <div class="actions-page">
    <h1>Volunteer Actions</h1>
    <table>
      <thead>
        <tr>
          <th>{{ translations[language].aid }}</th>
          <th>{{ translations[language].vid }}</th>
          <th>{{ translations[language].cid }}</th>
          <th>{{ translations[language].rate }}</th>
          <th>{{ translations[language].attendance }}</th>
          <th>{{ translations[language].actions }}</th>
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
            <span v-if="action.attendance && action.ratingFromAction == 0">
              <RouterLink :to="'/mark/' + action.actionId">
                {{ translations[language].mark }}
              </RouterLink>
            </span>
            <span v-else>
              {{ translations[language].dont_mark }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
if (
  typeof localStorage.getItem("language") === "undefined" ||
  localStorage.getItem("language") === null
) {
  localStorage.setItem("language", "en");
}
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
export default {
  setup() {
    const translations = {
      pl: {
        aid: "ID akcji",
        vid: "ID wolontariusza",
        cid: "IDkatastrofy",
        rate: "ocena",
        attendance: "obecność",
        actions: "akcje",
        go_to_accept: "przejdź do akceptacji",
        attending: "zgłoszony",
        action_finished: "akcja zakończona",
        mark: "oceń",
        dont_mark: "Nie można ocenić",
      },
      en: {
        aid: "action ID",
        vid: "volunteer ID",
        cid: "catastrophe ID",
        rate: "rate",
        attendance: "attendance",
        actions: "actions",
        go_to_accept: "go to accept",
        attending: "attending",
        action_finished: "action finished",
        mark: "mark volunteer",
        dont_mark: "can't mark",
      },
    };
    const actions = ref([]);
    const userId = localStorage.getItem("selectedVolunteer");

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

    onMounted(() => {
      fetchActions();
    });
    const language = ref(localStorage.getItem("language") || "pl");

    return {
      language,
      translations,
      actions,
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
