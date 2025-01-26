<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
//import HelloWorld from "./components/HelloWorld.vue";
// Store the current user role in a ref to control access to links
const username = ref(null);
const userRole = ref(null);
const language = ref(localStorage.getItem("language") || "pl");
const userId = ref(null);

onMounted(() => {
  // Get the user role from localStorage (assuming 'role' is stored there)
  username.value = localStorage.getItem("username");
  userRole.value = localStorage.getItem("role");
  userId.value = localStorage.getItem("userId");
});

function setLanguage(lang) {
  language.value = lang;
  localStorage.setItem("language", lang);
  location.reload();
}
const translations = {
  pl: {
    home: "Strona główna",
    login: "Zaloguj się",
    catastrophe: "Katastrofa",
    message: "Wiadomości",
    reports: "Raporty",
    request: "Zobacz zgłoszsenie",
    resources: "Zobacz dary",
    destinationResources: "Zobacz dary przekazane do katastrofy",
    destinationResources: "Zobacz dary przekazane do katastrofy",
    ngo: "Wolontariusze",
    username: "Użytkownik",
    role: "Rola",
    logout: "Wyloguj się",
    actions: "Akcje",
  },
  en: {
    home: "Home",
    login: "Login",
    catastrophe: "Catastrophe",
    message: "Message inbox",
    reports: "Reports",
    request: "Lookup request",
    resources: "View my resources",
    destinationResources: "View resources sent to a catastrophe",
    destinationResources: "View resources sent to a catastrophe",
    ngo: "Volounteers",
    username: "User",
    role: "Role",
    logout: "Log out",
    actions: "Actions",
  },
};

const isLoggedIn = computed(() => !!localStorage.getItem("accessToken"));

function logout() {
  localStorage.clear();
  window.location.href = "/auth";
}
</script>

<template>
  <header>
    <div class="loginStatus">
      <span v-if="isLoggedIn">
        {{ translations[language].username }}: <strong>{{ username }}</strong> |
        {{ translations[language].role }}: <strong>{{ userRole }} </strong>
        <button @click="logout">{{ translations[language].logout }}</button>
      </span>
    </div>

    <div class="language-switcher">
      <button @click="setLanguage('en')">EN</button>
      <button @click="setLanguage('pl')">PL</button>
    </div>

    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <!--<HelloWorld msg="You did it!" />-->

      <nav>
        <!-- public2 -->
        <RouterLink to="/">{{ translations[language].home }}</RouterLink>
        <RouterLink to="/auth">{{ translations[language].login }}</RouterLink>
        <RouterLink to="/map">{{
          translations[language].catastrophe
        }}</RouterLink>
        <RouterLink to="/help-request/lookup">{{
          translations[language].request
        }}</RouterLink>

        <RouterLink
          v-if="
            userRole === 'GIVER' ||
            userRole === 'NGO' ||
            userRole === 'OFFICIAL'
          "
          :to="`/resource/getByholder/${userId}`"
        >
          {{ translations[language].resources }}
        </RouterLink>
        <RouterLink to="/resource/getBydestination/1">{{
          translations[language].destinationResources
        }}</RouterLink>
        <RouterLink v-if="userRole === 'NGO'" :to="`/volounteers/${userId}`">
          {{ translations[language].ngo }}
        </RouterLink>
        <RouterLink
          to="/messages"
          v-if="
            userRole === 'NGO' ||
            userRole === 'OFFICIAL' ||
            userRole === 'VOLUNTEER' ||
            userRole === 'GIVER'
          "
          >{{ translations[language].message }}</RouterLink
        >
        <RouterLink
          to="/report"
          v-if="userRole === 'NGO' || userRole === 'OFFICIAL'"
          >{{ translations[language].reports }}</RouterLink
        >
        <RouterLink to="/report-giver" v-if="userRole === 'GIVER'">{{
          translations[language].reports
        }}</RouterLink>
        <RouterLink to="/actions" v-if="userRole === 'VOLUNTEER'">{{
          translations[language].actions
        }}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.loginStatus {
  float: right;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
