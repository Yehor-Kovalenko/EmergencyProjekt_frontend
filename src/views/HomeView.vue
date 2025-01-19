<script setup>
import TheWelcome from '../components/TheWelcome.vue';
import UserResourcesView from './UserResourcesView.vue';
import ResourcesToCatastropheView from './ResourcesToCatastropheView.vue';
import Login from '@/components/Login.vue';
</script>

<template>
  <main>
    <TheWelcome />
    <Login />
    <UserResourcesView /> 
    <ResourcesToCatastropheView />
  </main>
</template>