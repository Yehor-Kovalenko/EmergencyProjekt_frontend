<template>
  <div>
    <h1>{{ translations[language].title }}</h1>
    <p>{{ translations[language].ngoID }}: {{ ngoId }}</p>
    <p>{{ translations[language].eventID }}: {{ eventId }}</p>
    <button @click="invite" class="btn btn-primary">
      {{ translations[language].invitationButton }}
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "InviteView",
  setup() {
    const route = useRoute();

    // Zmienne
    const language = localStorage.getItem("language") || "pl";
    const ngoId = localStorage.getItem("userId");
    const eventId = route.params.eventId;

    // Funkcja zaproszenia
    const invite = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/ngo/${ngoId}/invite`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            params: {
              eventId: eventId,
              language: language,
            },
          }
        );
        console.log("Response:", response.data);
        alert("Invitation sent!");
      } catch (error) {
        console.error(
          "Error during invitation:",
          error.response?.data || error.message
        );
        alert("Error during invitation!");
      }
    };

    // Tłumaczenia
    const translations = {
      pl: {
        title: "Zaproszenie",
        invitationButton: "Zaproś",
        ngoID: "Numer organizacji",
        eventID: "Numer wydarzenia",
      },
      en: {
        title: "Invitation",
        invitationButton: "Invite",
        ngoID: "NGO ID",
        eventID: "Event ID",
      },
    };

    return { language, ngoId, eventId, invite, translations };
  },
};
</script>

<style scoped>
.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
