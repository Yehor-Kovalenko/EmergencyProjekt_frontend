<template>
    <div class="about"> 
        <button @click="accept">Accept Action</button>
        <button @click="reject">Reject Action</button>
    <
    </div>
  </template>

<script>
import axios from 'axios';
export default {
methods:{
    accept(){
        console.log('accept');
        axios.post('http://localhost:8080/volunteers/'.concat(this.$route.params.vid,'/actions/',this.$route.params.aid,'/accept'));
    },
    reject(){
        console.log('reject');
        axios.post('http://localhost:8080/volunteers/'.concat(this.$route.params.vid,'/actions/',this.$route.params.aid,'/reject'));

    },
}
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
  