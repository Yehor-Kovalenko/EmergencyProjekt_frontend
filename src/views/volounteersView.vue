<template>
    <div class="about">
      
        <table>
          <tr>
            <th>{{translations[language].first_name}}</th>
            <th>{{translations[language].last_name}}</th>
            <th>e-mail</th>
            <th>{{translations[language].availability}}</th>
            <th>{{translations[language].mark_volunteer}}</th>
          </tr>
          <template v-for="volunteer in volunteers">
            <tr>
              <td>{{ volunteer.firstName }}</td>
              <td>{{ volunteer.lastName }}</td>
              <td>{{ volunteer.email }}</td>
              <td>
              <template v-if="volunteer.available">
                {{translations[language].available}}
              </template>
              <template v-else>
                {{translations[language].unavailable}}
              </template></td>
              <td>
              <template v-if="!volunteer.available">
                <RouterLink :to="'/mark/' + volunteer.id">{{translations[language].mark_volunteer}}</RouterLink>
              </template>
              <template v-else>
                {{translations[language].dont_mark}}
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
  setup(){
  const translations = {
      pl: {
        first_name:"imię",
        last_name:"nazwisko",
        availability:"dostępność",
        mark_volunteer:"oceń wolontariusza",
        available: "dostępny",
        unavailable: "nie dostępny",
        mark: "oceń",
        dont_mark: "Nie można teraz ocenić"
      },
      en: {
        first_name:"first name",
        last_name:"last name",
        availability:"availability",
        mark_volunteer:"mark volunteer",
        available: "available",
        unavailable: "not available",
        mark: "mark volunteer",
        dont_mark: "can't mark right now"
      }
    };
    return translations;
  },
  data() {
      return {
        volunteers: [ ]
      }
    },
  mounted() {
    console.log(this.$route.params.id);
    axios.get('http://localhost:8080/ngo/'.concat(this.$route.params.id,'/volunteers')).then((response) => this.volunteers = response.data)
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
  