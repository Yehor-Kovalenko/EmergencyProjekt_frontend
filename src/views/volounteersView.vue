<template>
    <div class="about">
      
        <table>
          <tr>
            <th>first Name</th>
            <th>last Name</th>
            <th>e-mail</th>
            <th>availability</th>
            <th>mark volunteer</th>
          </tr>
          <template v-for="volunteer in volunteers">
            <tr>
              <td>{{ volunteer.firstName }}</td>
              <td>{{ volunteer.lastName }}</td>
              <td>{{ volunteer.email }}</td>
              <td>
              <template v-if="volunteer.available">
                available
              </template>
              <template v-else>
                not available
              </template></td>
              <td>
              <template v-if="volunteer.readyForMark">
                <RouterLink :to="'/mark/' + volunteer.id">Mark Volunteer</RouterLink>
              </template>
              <template v-else>
                can't mark right now
              </template>
              </td>
            </tr>
          </template>
        </table>
    </div>
  </template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
        volunteers: [ ]
      }
    },
  mounted() {
    console.log(this.$route.params.id);
    axios.get('http://localhost:8080/volunteers').then((response) => this.volunteers = response.data)
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
  table{
    width: 90%;
    margin: auto;
    border-collapse: collapse;
    border: 1px solid white;
  }
  td{
    font-size: 90%;
    text-align: center;
    padding: 0.5%;
    width: 1%;  
    border: 1px solid white;
  }
  
  th{
    font-size: 110%;
    text-align: center;
    padding: 0.5%;
    width: 1%;  
    border: 1px solid white;
  }
  </style>
  