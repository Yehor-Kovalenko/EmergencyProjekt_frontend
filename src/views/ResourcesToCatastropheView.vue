<template>
    <div>
      <h2> {{ translations[language].heading }} </h2>
      <ResourceListByDestination /> <!-- Komponent wewnętrzny -->
    </div>
  </template>
  
  <script>
  import ResourceListByDestination from '@/components/ResourceListByDestination.vue';
  
  export default {
    name: 'ResourcesToCatastropheView',
    components: {
      ResourceListByDestination
    },
    setup() {
      const translations = {
        pl: {
          heading: 'Wyświetl zasoby przypisane do wybranej katastrofy',
        },
        en: {
          heading: 'Display resources assigned to the selected catastrophe',
        },
      };
      return { translations };
  },
  data() {
    return {  
      language: localStorage.getItem('language') || 'pl',
    };
  }
  };
  </script>
  
  <style>
  /* Nagłówki */
h2 {
  color: #620e2c;
  border-bottom: 2px solid #db90be;
  padding-bottom: 5px;
  margin-bottom: 15px;
  font-size: 20px;
}
</style>