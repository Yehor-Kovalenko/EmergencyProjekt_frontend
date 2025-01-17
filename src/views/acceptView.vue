<template>
    <div class="about">

    </div>
  </template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
        catastrophe_data: [ ]
      }
    },
  mounted() {
    axios.get('http://localhost:8080/volunteers/'.concat('2','/actions')).then((response) => this.catastrophe_data = response.data)
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
  