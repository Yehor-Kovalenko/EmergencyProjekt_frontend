<template>
    <div class="about">
    </div>
  </template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
        volunteer_data: [ ]
      }
    },
  mounted() {
    axios.get('http://localhost:8080/volunteers/'.concat(this.$route.params.id,'/actions')).then((response) => this.volunteer_data = response.data)
  },
}
</script>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  