<template>
  <div>
    <h2>Logowanie</h2>

    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Login</label>
        <input id="username" v-model="username" type="text" required />
      </div>

      <div>
        <label for="password">Hasło</label>
        <input id="password" v-model="password" type="password" required />
      </div>

      <button type="submit">Zaloguj się</button>
    </form>
  </div>
</template>

<script>
import axios from "@/axiosConfig";
import { ref } from "vue";

function setLanguage(lang) {
  language.value = lang;
  localStorage.setItem("language", lang);
  location.reload();
}

export default {
  name: "Login",
  setup() {
    const language = ref(localStorage.getItem("language") || "pl");
    const translations = {
      pl: {
        pageName: "Logowanie",
        login: "Login",
        password: "Hasło",
      },
      en: {
        pageName: "Log In",
        login: "Login",
        password: "Password",
      },
    };
    const currentView = ref("Login");

    return {
      language,
      translations,
      currentView,
    };
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        console.log("Logowanie:", this.username, this.password);

        const response = await axios.post("/auth/login", {
          username: this.username,
          password: this.password,
        });

        console.log(response.data);
        const accessToken = response.data.accessToken;
        const localUsername = response.data.userData.username;
        const localUserId = response.data.userData.userId;
        const localRole = response.data.userData.role;
        const localEmail = response.data.userData.email;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", localUsername);
        localStorage.setItem("userId", localUserId);
        localStorage.setItem("role", localRole);
        localStorage.setItem("email", localEmail)

        console.log("Logowanie powiodło się, token:", accessToken);

        this.$router.push("/").then(() => {
          window.location.reload(); // Przeładowanie strony
        });
      } catch (error) {
        console.error("Błąd logowania:", error);
        alert("Nie udało się zalogować. Spróbuj ponownie");
      }
    },
  },
};
</script>

<style scoped>
h2,
label {
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
input {
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  display: flex;
  margin-left: auto;
}
</style>
