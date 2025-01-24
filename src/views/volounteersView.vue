<template>
  <div class="about">
    <table>
      <thead>
        <tr>
          <th>{{ translations[language].first_name }}</th>
          <th>{{ translations[language].last_name }}</th>
          <th>e-mail</th>
          <th>{{ translations[language].availability }}</th>
          <th>{{ translations[language].mark_volunteer }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="volunteer in volunteers" :key="volunteer.id">
          <td>{{ volunteer.firstName }}</td>
          <td>{{ volunteer.lastName }}</td>
          <td>{{ volunteer.email }}</td>
          <td>
            <span v-if="volunteer.available">
              {{ translations[language].available }}
            </span>
            <span v-else>
              {{ translations[language].unavailable }}
            </span>
          </td>
          <td>
            <span v-if="volunteer.readyForMark">
              <RouterLink :to="'/mark/' + volunteer.id">
                {{ translations[language].mark_volunteer }}
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
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const translations = {
      pl: {
        first_name: "imię",
        last_name: "nazwisko",
        availability: "dostępność",
        mark_volunteer: "oceń wolontariusza",
        available: "dostępny",
        unavailable: "nie dostępny",
        mark: "oceń",
        dont_mark: "Nie można teraz ocenić",
      },
      en: {
        first_name: "first name",
        last_name: "last name",
        availability: "availability",
        mark_volunteer: "mark volunteer",
        available: "available",
        unavailable: "not available",
        mark: "mark volunteer",
        dont_mark: "can't mark right now",
      },
    };

    const language = ref(localStorage.getItem("language") || "pl");
    const volunteers = ref([]);
    const route = useRoute();

    onMounted(() => {
      axios
        .get(`http://localhost:8080/ngo/${route.params.id}/volunteers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          volunteers.value = response.data;
          // volunteers.value.forEach((volunteer) => {
          //   console.log(volunteer.readyForMark);
          // });
        })
        .catch((error) => console.error("Error fetching volunteers:", error));
    });

    return {
      translations,
      language,
      volunteers,
    };
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
table {
  width: 90%;
  margin: auto;
  border-collapse: collapse;
  border: 1px solid white;
}
td,
th {
  font-size: 90%;
  text-align: center;
  padding: 0.5%;
  border: 1px solid white;
}
th {
  font-size: 110%;
}
</style>
