<template>
  <div class="catastrophe-view">
    <div v-if="catastrophe">
      <h3>{{ translations[language].heading }}</h3>
      <p>
        <strong>{{ translations[language].id }}:</strong> {{ catastrophe.id }}
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

    <a href="/map" target="_blank">
      <button>{{ translations[language].backButton }}</button>
    </a>

    <a id="closeCatastropheLink" href="#" target="_blank">
      <button>{{ translations[language].closeCatastropheButton }}</button>
    </a>

    <a id="invitationLink" href="#" target="_blank">
      <button>{{ translations[language].invitationButton }}</button>
    </a>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "CatastropheView",
  setup() {
    const route = useRoute();
    const catastrophe = ref(null);
    const error = ref(false);

    const language = ref(localStorage.getItem("language") || "pl");

    const translations = {
      pl: {
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

    const fetchCatastrophe = async (catastropheId) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/catastrophes/${catastropheId}`
        );
        catastrophe.value = response.data;
        error.value = false;
      } catch (err) {
        console.error("Błąd podczas pobierania katastrofy:", err);
        catastrophe.value = null;
        error.value = true;
      }
    };

    onMounted(() => {
      const catastropheId = route.params.catastropheId;
      if (catastropheId) {
        const userId = localStorage.getItem("userId");
        let newUrl = `/invite/${userId}/event/${catastropheId}`;
        document.getElementById("invitationLink").href = newUrl;

        newUrl = `/catastrophes/close/${catastropheId}`;
        document.getElementById("closeCatastropheLink").href = newUrl;

        fetchCatastrophe(catastropheId);
      }
    });

    return {
      catastrophe,
      error,
      language,
      translations,
    };
  },
};
</script>

<style>
.catastrophe-view {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid red;
  background-color: #ffe0e0;
  color: red;
}
</style>
