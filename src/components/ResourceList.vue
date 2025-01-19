<template>
  <div>
    <h2> {{translations[language].heading}} </h2>
    <table>
      <thead>
      <tr>
        <th>{{translations[language].date}}</th>
        <th>{{translations[language].type}}</th>
        <th>{{translations[language].description}}</th>
        <th>{{translations[language].description}}</th>
        <th>{{translations[language].amount}}</th>
        <th>{{translations[language].destination}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="resource in resources" :key="resource.id">
        <td>{{ resource.date }}</td>
        <td>{{ resource.type }}</td>
        <td>{{ resource.description }}</td>
        <td>{{ resource.status }}</td>
        <td>{{ resource.amount }}</td>
        <span v-if="resource.destinationId">
            {{ getCatastropheById(resource.destinationId)?.type }} - 
            {{ getCatastropheById(resource.destinationId)?.location || translations[language].unknown_location }}
        </span>
      </tr>
      </tbody>
    </table>
    <!-- Przycisk do zarządzania zasobami -->
    <button class="manage-resources-button" @click="toggleResourceForm">
      {{translations[language].resource_management}}
    </button>

    <!-- Dynamiczne renderowanie ResourceForm -->
    <ResourceForm v-if="showResourceForm" @close="toggleResourceForm" />
  </div>
</template>

<script>
import axios from 'axios';
import ResourceForm from './ResourceForm.vue';

export default {
  name: 'ResourceList',
  components: { ResourceForm },
  setup() {
    const userid = localStorage.getItem('userId');
      const translations = {
        'pl': {
          heading: 'Lista zasobów',
          date: 'Data rejestracji',
          type: 'Typ',
          description: 'Opis',
          status: 'Status',
          amount: 'Ilość',
          destination: 'Przeznaczenie',
          unknown_location: 'Nieznane położenie',
          resource_management: 'Zarządzanie zasobami',          
        },
        en: {
          heading: 'Resource list',
          date: 'Registration date',
          type: 'Type',
          description: 'Description',
          status: 'Status',
          amount: 'Amount',
          destination: 'Destination',
          unknown_location: 'Unknown location',          
        },
      };
      return { translations };
    },
  data() {
    return {
      language : localStorage.getItem('language'),
      userid: localStorage.getItem('userId'),
      //language: 'pl',
      resources: [], // Tablica zasobów
      showResourceForm: false,
      catastrophes: [], // Tablica katastrof
    };
  },
  methods: {
    toggleResourceForm() {
      this.showResourceForm = !this.showResourceForm;
    },
    fetchResources() {
      console.log(this.userid);
      console.log(localStorage.getItem('accessToken'));
      axios
        .get(`resource/getByholder/${localStorage.getItem('userId')}`, {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`, // Zastąp 'authToken' poprawną nazwą
          },
        })
        .then((response) => {
          // Przypisz dane do tablicy resources
          this.resources = response.data;
          console.log(this.resources);
        })
        .catch((error) => {
          console.error('Błąd podczas pobierania zasobów:', error);
        });
    },
    editResource(id) {
      // Przekierowanie do edycji zasobu
      this.$router.push({ name: 'EditResource', params: { id } });
    },
    getCatastropheById(destinationId) {
      return this.catastrophes.find(catastrophe => catastrophe.id === destinationId);
    },
    async loadCatastrophes() {
      try {
        const response = await axios.get('/catastrophes');
        const catastrophes = response.data;

        // Dodajemy lokalizację do każdej katastrofy
        for (let catastrophe of catastrophes) {
          const address = await this.reverseGeocode(catastrophe.latitude, catastrophe.longitude);
          catastrophe.location = address; // Dodaj lokalizację do katastrofy
        }

        this.catastrophes = catastrophes;
      } catch (error) {
        console.error('Błąd podczas ładowania katastrof:', error);
      }
    },
        // Funkcja dokonująca geolokacji na podstawie współrzędnych
        reverseGeocode(latitude, longitude) {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

      return axios
        .get(apiUrl)
        .then((response) => {
          return response.data.display_name || 'Nieznane położenie';
        })
        .catch((error) => {
          console.error('Błąd podczas pobierania geolokacji:', error);
          return 'Nie udało się określić położenia';
        });
    },

  },
  updated() {
    // Pobierz dane po załadowaniu komponentu
    this.fetchResources();
    this.loadCatastrophes();
  },
  mounted() {
    /*
     //roboczo
     localStorage.setItem('userId', 1);
    localStorage.setItem('role', 'NGO');
    */
    localStorage.setItem('language', 'pl');
    console.log(localStorage.getItem('role'));
    // Pobierz dane po załadowaniu komponentu
    this.fetchResources();
    this.loadCatastrophes();
    

  },
};
</script>

<style scoped>
/* Tabela zasobów */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f5bcc1; /* Jasne tło dla tabeli */
  color: #3f0a29; /* Ciemniejszy tekst */
  font-size: 14px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

table th {
  background-color: #94426a; /* Kolor nagłówków */
  color: #fff;
  text-align: left;
  padding: 10px;
  border-bottom: 2px solid #620e2c; /* Dodanie wyróżnienia */
}

table td {
  padding: 10px;
  border: 1px solid #db90be; /* Delikatne obramowanie */
}

table tr:nth-child(even) {
  background-color: #db90be; /* Delikatny kolor dla co drugiego wiersza */
}

table tr:hover {
  background-color: #94426a; /* Wyróżnienie wiersza po najechaniu */
  color: #fff;
}

/* Formularze */
form {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5bcc1;
  border: 2px solid #db90be;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

form label {
  display: block;
  font-weight: bold;
  color: #620e2c;
  margin-bottom: 5px;
}

form input,
form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #db90be;
  border-radius: 4px;
  background-color: #fff;
  color: #3f0a29;
}

form button {
  background-color: #94426a;
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

form button:hover {
  background-color: #620e2c;
}

/* Przyciski */
button {
  margin: 10px 5px;
  padding: 10px 15px;
  background-color: #94426a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #620e2c;
}

/* Tooltip */
.tooltip {
  position: absolute;
  background-color: #620e2c;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Nagłówki */
h2 {
  color: #620e2c;
  border-bottom: 2px solid #db90be;
  padding-bottom: 5px;
  margin-bottom: 15px;
  font-size: 20px;
}

h3 {
  color: #3f0a29;
  font-size: 18px;
  margin-top: 20px;
}
</style>
