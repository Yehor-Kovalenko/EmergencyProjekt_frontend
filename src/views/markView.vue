<template>
    <div class="about">
        <template v-for="data in volunteer_data">
            <template v-if="data.ratingFromAction===0">
                <div style="width: 0px; height: 0px; font-size: 0px;">{{ this.action_id = data.actionId }}</div>
                <input type="number" id="rate" min="1" max="10"  v-model="rating" ></input>
                <button id="accept_rate" @click="mark">accept mark</button>
            </template>
        </template>
    </div>
  </template>

<script>
import router from '@/router';
import axios from 'axios';

export default {
  setup(){
  const translations = {
      pl: {
        accept_mark:"zaakceptuj ocenę",
      },
      en: {
        accept_mark:"accept mark",
      }
    };
    return translations;
  },
  data() {
      return {
        volunteer_data: [ ]
      }
    },
  mounted() {
    axios.get('http://localhost:8080/volunteers/'.concat(this.$route.params.id,'/actions'), {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },}).then((response) => this.volunteer_data = response.data)
  },
  methods:{
    mark(){
        axios.post('http://localhost:8080/volunteers/'.concat(this.$route.params.id,'/mark?actionId=',this.action_id,'&rating=',this.rating), {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },});
        router.go(-1);
    }
  }
}
</script>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
    }
  }
    .about {
        padding-top: 30%;
    }
  #rate{
    width: 40%;
    height: 10%;
    float: left;
    margin-left: 30%;
    margin-right: 30%;
  }
  #accept_rate{
    margin-top: 10%;
    background-color: green;
    color: white;
    width: 30%;
    height: 20%;
    float: left;
    margin-left: 35%;
    margin-right: 35%;
  }
  </style>
  