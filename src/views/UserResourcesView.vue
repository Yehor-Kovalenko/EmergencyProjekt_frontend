<template>
    <div>
      <h2>{{ translations[language].heading }}</h2>
      <ResourceList />
    </div>
  </template>
  
  <script>
  import ResourceList from '../components/ResourceList.vue';
  
  export default {
    components: {
      ResourceList
    },
    setup() {
      const translations = {
        pl: {
          heading: 'Moje zasoby',
        },
        en: {
          heading: 'My resources',
        },
      }
      return { translations };
    },
    data() {
      return {
        language: localStorage.getItem('language') || 'pl',
      };
  },
};
  </script>
  