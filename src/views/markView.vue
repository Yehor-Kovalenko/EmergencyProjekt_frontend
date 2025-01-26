<template>
  <div class="about" v-if="volunteer_data && volunteer_data.actionId">
    <div style="width: 0px; height: 0px; font-size: 0px;">{{ this.action_id = volunteer_data.actionId }}</div>
    <input type="number" id="rate" min="1" max="5" v-model="rating"></input>
    <button id="accept_rate" @click="mark">{{ translations[language].accept_mark }}</button>
  </div>
  <div v-else>
    <p>Loading data...</p>
  </div>
</template>




<script>
import router from '@/router';
import {ref} from "vue";
import axios from 'axios';
if (typeof localStorage.getItem("language") === 'undefined' || localStorage.getItem("language") === null) {
  localStorage.setItem("language", "en");
}

export default {
  setup(){
  const language = ref(localStorage.getItem('language') || 'pl');
  const translations = {
      pl: {
        accept_mark:"zaakceptuj ocenę",
      },
      en: {
        accept_mark:"accept mark",
      }
    };
    return {translations,language};
  },
  data() {
      return {
        volunteer_data: {},
      }
    },
  mounted() {
   
    this.fetchVolunteerData();
  },
  methods:{
    mark() {
  const token = localStorage.getItem("accessToken"); 
  if (!token) {
    console.error("Brak tokenu dostępu. Użytkownik nie jest zalogowany.");
    return;
  }
console.log("action id: ",this.volunteer_data.actionID);
console.log("volun id: ", this.volunteer_data.volunteerID);
  axios.post(
    `http://localhost:8080/volunteers/${this.volunteer_data.volunteerId}/mark`,
    null, 
    {
      params: {
        actionId: this.action_id,
        rating: this.rating,
      },
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  )
  .then(() => {
    router.go(-1); 
  })
  .catch((error) => {
    console.error("Error submitting rating:", error);
  });
},



    async fetchVolunteerData() {
  try {
    const token = localStorage.getItem("accessToken");
    const actionID = this.$route.params.id; 

    const response = await axios.get(
      `http://localhost:8080/volunteers/action/${actionID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    this.volunteer_data = response.data;
    console.log("volunteer data: ", this.volunteer_data);
  } catch (error) {
    console.error("Error fetching volunteer data:", error);
  }
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
  