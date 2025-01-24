<template>
  <div class="close-catastrophe">
    <p>{{ translations[language].confirmationMessage }}</p>

    <button @click="closeCatastrophe">
      {{ translations[language].closeButton }}
    </button>

    <div v-if="closeSuccess" class="success-message">
      <p>{{ translations[language].closeSuccess }}</p>
    </div>

    <div v-if="closeError" class="error-message">
      <p>{{ translations[language].closeError }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "CloseCatastrophe",
  setup() {
    const route = useRoute();
    const catastropheId = route.params.catastropheId;

    const closeSuccess = ref(false);
    const closeError = ref(false);

    const language = ref(localStorage.getItem("language") || "pl");

    const translations = {
      pl: {
        confirmationMessage: "Czy na pewno chcesz zamknąć tę katastrofę?",
        closeButton: "Zamknij Katastrofę",
        closeSuccess: "Katastrofa została pomyślnie zamknięta.",
        closeError:
          "Wystąpił błąd podczas zamykania katastrofy. Spróbuj ponownie.",
      },
      en: {
        confirmationMessage: "Are you sure you want to close this catastrophe?",
        closeButton: "Close Catastrophe",
        closeSuccess: "The catastrophe has been successfully closed.",
        closeError:
          "An error occurred while closing the catastrophe. Please try again.",
      },
    };

    const closeCatastrophe = async () => {
      closeSuccess.value = false;
      closeError.value = false;

      try {
        const response = await axios.post(
          `http://localhost:8080/api/catastrophes/close/${catastropheId}`
        );
        console.log("Response:", response);

        if (response.status === 200) {
          closeSuccess.value = true;
        } else {
          closeError.value = true;
        }
      } catch (error) {
        console.error("Error closing catastrophe:", error);
        closeError.value = true;
      }
    };

    return {
      language,
      translations,
      closeCatastrophe,
      closeSuccess,
      closeError,
    };
  },
};
</script>

<style scoped>
.close-catastrophe {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fafafa;
}

.close-catastrophe p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.success-message {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid green;
  background-color: #d4edda;
  color: green;
  border-radius: 4px;
}

.error-message {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid red;
  background-color: #f8d7da;
  color: red;
  border-radius: 4px;
}
</style>
