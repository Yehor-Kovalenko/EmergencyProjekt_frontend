<template>
    <div class="about"> 
        <button id="accept" @click="accept">{{translations[language].accept}}</button>
        <button id="reject"@click="reject">{{translations[language].accept}}</button>
    </div>
  </template>

<script>
import router from '@/router';
import axios from 'axios';
export default {
  setup(){
  const translations = {
      pl: {
        accept:"zaakceptuj",
        reject:"odrzuć",
      },
      en: {
        accept:"accept",
        reject:"reject",
      }
    };
    return translations;
  },
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
      align-items: center;
    }
  }
  .about{
    padding-top: 40%;
  }
    #accept{
        background-color: green;
        color: white;
        height: 20%;
        width: 30%;
        float: left;
    }
    #reject{
        background-color: red;
        color: white;
        height: 20%;
        width: 30%;
        float: right;
    }
  </style>
  