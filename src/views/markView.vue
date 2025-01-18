<template>
    <div class="about">
        <template v-for="data in volunteer_data">
            <template v-if="data.ratingFromAction===0">
                <div style="width: 0px; height: 0px;">{{ this.action_id = data.actionId }}</div>
                <input type="number" id="quantity" name="quantity" min="1" max="10"  v-model="rating" ></input>
                <button @click="mark">accept mark</button>
            </template>
        </template>
    </div>
  </template>

<script>
import router from '@/router';
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
  methods:{
    mark(){
        axios.post('http://localhost:8080/volunteers/'.concat(this.$route.params.id,'/mark?actionId=',this.action_id,'&rating=',this.rating));
        router.go(-1);
    }
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
  