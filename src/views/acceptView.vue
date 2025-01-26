<template>
  <div class="catastrophe-view">
    <div v-if="catastrophe">
      <h3>{{ translations[language].heading }}</h3>
      <p>
        <strong>{{ translations[language].id }}:</strong>
        {{ catastrophe.id }}
      </p>
      <p>
        <strong>{{ translations[language].type }}:</strong>
        {{ catastrophe.type }}
      </p>
      <p>
        <strong>{{ translations[language].lat }}:</strong>
        {{ catastrophe.latitude }}
      </p>
      <p>
        <strong>{{ translations[language].lng }}:</strong>
        {{ catastrophe.longitude }}
      </p>
      <p>
        <strong>{{ translations[language].active }}:</strong>
        {{
          catastrophe.active == true
            ? translations[language].yes
            : translations[language].no
        }}
      </p>
      <p>
        <strong>{{ translations[language].date }}:</strong>
        {{ new Date(catastrophe.reportedDate).toLocaleString() }}
      </p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ translations[language].errorNotFound }}</p>
    </div>
  </div>
  <div class="about">
    <button id="accept" @click="accept">
      {{ translations[language].accept }}
    </button>
    <button id="reject" @click="reject">
      {{ translations[language].reject }}
    </button>
  </div>
</template>

<script>
if (
  typeof localStorage.getItem("language") === "undefined" ||
  localStorage.getItem("language") === null
) {
  localStorage.setItem("language", "en");
}
import router from "@/router";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    const translations = {
      pl: {
        accept: "zaakceptuj",
        reject: "odrzuć",
        heading: "Szczegóły Katastrofy:",
        id: "ID",
        type: "Typ",
        lat: "Szerokość geograficzna",
        lng: "Długość geograficzna",
        active: "Aktywna",
        yes: "Tak",
        no: "Nie",
        date: "Data",
        errorNotFound: "Nie znaleziono katastrofy o podanym ID.",
        backButton: "Wróć",
        invitationButton: "Zaproszenie",
        closeCatastropheButton: "Zamknij katastrofę",
      },
      en: {
        accept: "accept",
        reject: "reject",
        heading: "Catastrophe Details:",
        id: "ID",
        type: "Type",
        lat: "Latitude",
        lng: "Longitude",
        active: "Active",
        yes: "Yes",
        no: "No",
        date: "Date",
        errorNotFound: "No catastrophe found with the provided ID.",
        backButton: "Back",
        invitationButton: "Invitation",
        closeCatastropheButton: "Close catastrophe",
      },
    };
    const language = ref(localStorage.getItem("language") || "pl");
    const action_details = ref(null);
    const error = ref(false);
    const catastropheID = ref(null);
    const catastrophe = ref(null);

    const fetchActionDetails = async (actionID) => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:8080/volunteers/action/${actionID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        action_details.value = response.data;
        catastropheID.value = response.data.catastropheId;
        fetchCatastrophe(catastropheID.value);
        // console.log("catastropheID.value:", catastropheID.value);
        // console.log("action_details.value:", action_details.value);
        error.value = false;
      } catch (err) {
        console.error("Błąd podczas pobierania akcji:", err);
        action_details.value = null;
        error.value = true;
      }
    };
    const fetchCatastrophe = async (catastropheId) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/catastrophes/${catastropheId}`
        );
        catastrophe.value = response.data;
        // console.log("catastrophe.value:", catastrophe.value);
        // console.log("catastrophe.type:", catastrophe.value.type);
        error.value = false;
      } catch (err) {
        console.error("Błąd podczas pobierania katastrofy:", err);
        catastrophe.value = null;
        error.value = true;
      }
    };

    onMounted(() => {
      const actionID = route.params.aid;
      if (actionID) {
        fetchActionDetails(actionID);
      }
    });

    return {
      translations,
      language,
      catastrophe,
      error,
    };
  },
  methods: {
    accept() {
      console.log("accept");

      const url = `http://localhost:8080/volunteers/${this.$route.params.vid}/actions/${this.$route.params.aid}/accept`;

      axios
        .post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then(() => {
          console.log(`Request to ${url} was successful.`);
          router.push("/thanks");
        })
        .catch((error) => {
          console.error("Error during accept request:", error);
          alert("Failed to accept attendance. Please try again.");
        });
    },
    reject() {
      console.log("reject");

      const url = `http://localhost:8080/volunteers/${this.$route.params.vid}/actions/${this.$route.params.aid}/reject`;

      axios
        .post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then(() => {
          console.log(`Request to ${url} was successful.`);
          router.push("/thanks");
        })
        .catch((error) => {
          console.error("Error during reject request:", error);
          alert("Failed to reject attendance. Please try again.");
        });
    },
  },
};
</script>

<style>
.about {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50hv;
  padding: 20px;
  gap: 20px;
}

button {
  border: none;
  border-radius: 8px;
  padding: 15px 30px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#accept {
  background-color: #28a745;
  color: white;
}

#accept:hover {
  background-color: #218838;
}

#reject {
  background-color: #dc3545;
  color: white;
}

#reject:hover {
  background-color: #c82333;
}

@media (min-width: 1024px) {
  .about {
    flex-direction: row;
    gap: 50px;
  }

  button {
    width: 200px;
  }
}
</style>
