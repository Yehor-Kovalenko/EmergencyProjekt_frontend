<template>
  <p>{{ translations[language].thanks }}</p>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const translations = {
      pl: {
        thanks: "dziękujemy za informację",
      },
      en: {
        thanks: "Thank you for Your availability info",
      },
    };

    const language = ref(localStorage.getItem("language") || "pl");

    return {
      translations,
      language,
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
p {
  font-size: 250%;
}
</style>
