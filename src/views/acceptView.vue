<template>
    <div class="about"> 
        <button @click="accept">Accept Action</button>
        <button @click="reject">Reject Action</button>
    <
    </div>
  </template>

<script>
import router from '@/router';
import axios from 'axios';
export default {
methods:{
    accept(){
        console.log('accept');
        axios.post('http://localhost:8080/volunteers/'.concat(this.$route.params.vid,'/actions/',this.$route.params.aid,'/accept'));
        router.push('/thanks');
    },
    reject(){
        console.log('reject');
        axios.post('http://localhost:8080/volunteers/'.concat(this.$route.params.vid,'/actions/',this.$route.params.aid,'/reject'));
        router.push('/thanks');

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
  