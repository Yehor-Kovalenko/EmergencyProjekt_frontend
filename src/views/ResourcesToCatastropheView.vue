<template>
    <div>
      <h2>Wyświetl zasoby przypisane do wybranej katastrofy</h2>
      <ResourceListByDestination /> <!-- Komponent wewnętrzny -->
    </div>
  </template>
  
  <script>
  import ResourceListByDestination from '@/components/ResourceListByDestination.vue';
  
  export default {
    name: 'ResourcesToCatastropheView',
    components: {
      ResourceListByDestination
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