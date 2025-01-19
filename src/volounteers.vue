<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/auth">Login</RouterLink>
        <RouterLink to="/volounteers/1">volounteer info</RouterLink>
        <RouterLink to="/mark/1"> mark volounteer</RouterLink>
        <RouterLink to="/volunteers/3/actions/1">test accept</RouterLink>
        <RouterLink
          :to="{ name: 'invite', params: { ngoId: '1', eventId: '1001' } }"
        >
          test invite
        </RouterLink>
        <RouterLink to="/messages">Message list</RouterLink>
        <RouterLink to="/resource/getByholder/1">Get user's resources</RouterLink>
        <RouterLink to="/resource/getByDestination/1">Get user's resources</RouterLink>
        <RouterLink to="/report">Reports</RouterLink>
        <RouterLink to="/report-type">Report type</RouterLink>
        <RouterLink to="/report-date">Report date</RouterLink>
        <RouterLink to="/report-giver">Report giver</RouterLink>
        <RouterLink to="/report-resources-view">Report resources view</RouterLink>
        <RouterLink to="/report-volunteers-view">Report volunteers view</RouterLink>
        <RouterLink to="/report-catastrophe-view">Report catastrophe view</RouterLink>
        <RouterLink to="/catastrophes/1"> Catastrophe lookup</RouterLink>
        <RouterLink to="/help-request/edit/1"> Edit help request</RouterLink>
        <RouterLink to="/help-request/create/1"> Create help request</RouterLink>
        <RouterLink to="/help-request/lookup"> Lookup help request</RouterLink>
        <RouterLink to="/map">Map</RouterLink>


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
