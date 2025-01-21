<template>
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
import router from "@/router";
import axios from "axios";
import { ref } from "vue";
export default {
  setup() {
    const translations = {
      pl: {
        accept: "zaakceptuj",
        reject: "odrzuć",
      },
      en: {
        accept: "accept",
        reject: "reject",
      },
    };
    const language = ref(localStorage.getItem("language") || "pl");

    return {
      translations,
      language,
    };
  },
  methods: {
    accept() {
      console.log("accept");
      axios.post(
        "http://localhost:8080/volunteers/".concat(
          this.$route.params.vid,
          "/actions/",
          this.$route.params.aid,
          "/accept"
        ),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      router.push("/thanks");
    },
    reject() {
      console.log("reject");
      axios.post(
        "http://localhost:8080/volunteers/".concat(
          this.$route.params.vid,
          "/actions/",
          this.$route.params.aid,
          "/reject"
        ),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      router.push("/thanks");
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
  min-height: 100vh;
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
