<template>
  <div class="actions-page">
    <h1>Volunteer Actions</h1>
    <table>
      <thead>
        <tr>
          <th>{{translations[language].aid}}</th>
          <th>{{translations[language].vid}}</th>
          <th>{{translations[language].cid}}</th>
          <th>{{translations[language].rate}}</th>
          <th>{{translations[language].attendance}}</th>
          <th>{{translations[language].actions}}</th>
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
            <template v-for="catastrophe in catastrophes">
              <template v-if="catastrophe.id == action.catastropheId && catastrophe.active">
                <button v-if="!action.attendance"
                     @click="goToAccept(action.actionId)"
                >
                {{translations[language].go_to_accept}}
                </button>
              </template>

            </template>
            
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
if (typeof localStorage.getItem("language") === 'undefined' || localStorage.getItem("language") === null) {
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
      },
      en: {
        aid: "action ID",
        vid: "volunteer ID",
        cid: "catastrophe ID",
        rate: "rate",
        attendance: "attendance",
        actions: "actions",
        go_to_accept: "go to accept",
      },
    };
    const actions = ref([]);
    const catastrophes = ref([]);
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

    const fetchCatastrophes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/catastrophes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        catastrophes.value = response.data;
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
    };

    const goToAccept = (actionId) => {
      router.push(`/volunteers/${userId}/actions/${actionId}`);
    };

    onMounted(() => {
      fetchActions();
      fetchCatastrophes();
    });
    const language = ref(localStorage.getItem('language') || 'pl');

    return {
      language,
      translations,
      actions,
      catastrophes,
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
