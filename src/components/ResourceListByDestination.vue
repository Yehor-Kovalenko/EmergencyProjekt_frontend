<template>
  <div>
    <div>
      <label>{{translations[language].choose_catastrophes}}</label>
      <select v-model.number="destinationId" @change="loadResources">
        <option
          v-for="catastrophe in catastrophes"
          :key="catastrophe.id"
          :value="catastrophe.id"
        >
          {{ catastrophe.type }} - {{ catastrophe.location || translations[language].loading_location }}
        </option>
      </select>
    </div>

    <h2>{{translations[language].heading}}</h2>
    <div v-if="loading">{{translations[language].loading_resources}}</div>
    <div v-else-if="error">{{ error }}</div>

    <!-- Tabela wyświetlana tylko po wybraniu katastrofy -->
    <table v-if="resources.length > 0 && destinationId">
      <thead>
        <tr>
          <th>{{translations[language].date}}</th>
          <th>{{translations[language].type}}</th>
          <th>{{translations[language].description}}</th>
          <th>{{translations[language].status}}</th>
          <th>{{translations[language].amount}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td>{{ resource.date }}</td>
          <td>{{ this.getTranslatedResourceType(resource.type) }}</td>
          <td>{{ resource.description }}</td>
          <td>{{ this.getTranslatedResourceStatus(resource.status) }}</td>
          <td>{{ resource.amount }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="this.destinationId && !this.failed_to_load">{{translations[language].no_resources}}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResourceListByDestination",
  setup() {
      const translations = {
        pl: {
          heading: 'Lista zasobów dla katastrofy',
          date: 'Data rejestracji',
          type: 'Typ',
          description: 'Opis',
          status: 'Status',
          amount: 'Ilość',
          destination: 'Przeznaczenie',
          giver: 'Darczyńca',
          unknown_location: 'Nieznane położenie',
          choose_catastrophes: 'Wybierz katastrofę:',
          loading_location: 'Pobieranie położenia...',
          loading_resources: 'Ładowanie zasobów...',
          no_resources: 'Brak zasobów przypisanych do tej katastrofy.',
          failed_to_load: "Nie udało się pobrać zasobów. Spróbuj ponownie później.",
          resourceTypes: {
            CLOTHES: 'Ubrania',
            PUBLICRESOURCE: 'Zasoby publiczne',
            MEDICALSUPPLIES: 'Zasoby medyczne',
            FOOD: 'Jedzenie',
            TOOLKITS: 'Narzędzia',
            COMMUNICATIONDEVICES: 'Urządzenia komunikacyjne',
            TRANSPORT: 'Transport',
            ANOTHER: 'Inne',
            },
            resourceStatuses: {
              REGISTERED: 'Zarejestrowane',
              ASSIGNED: 'Przypisane',
              ENROUTE: 'W drodze',
              DELIVERED: 'Dostarczone',
            },
        },
        en: {
          heading: 'Resource List',
          date: 'Registration date',
          type: 'Type',
          description: 'Description',
          status: 'Status',
          amount: 'Amount',
          destination: 'Destination',
          giver: 'Giver',
          unknown_location: 'Unknown location',
          choose_catastrophes: 'Choose catastrophe:',
          loading_location: 'Loading location...',
          loading_resources: 'Loading resources...',
          no_resources: 'No resources assigned to this catastrophe.',
          failed_to_load: "Failed to load resources. Please try again later.",
          resourceTypes: {
            CLOTHES: 'Clothes',
            PUBLICRESOURCE: 'Public Resource',
            MEDICALSUPPLIES: 'Medical Supplies',
            FOOD: 'Food',
            TOOLKITS: 'Toolkits',
            COMMUNICATIONDEVICES: 'Communication Devices',
            TRANSPORT: 'Transport',
            ANOTHER: 'Another',
          },
          resourceStatuses: {
            REGISTERED: 'Registered',
            ASSIGNED: 'Assigned',
            ENROUTE: 'Enroute',
            DELIVERED: 'Delivered',
          },
        },
      };
      return {translations}
    },
  data() {
    return {
      language: localStorage.getItem('language') || 'pl',
      resources: [],
      loading: false,
      error: null,
      destinationId: null,
      catastrophes: [],
      load_failed: false,
    };
  },
  computed: {
    resourceTypes() {
      return this.getTranslatedResourceTypes();
    },
    resourceStatuses() {
      return this.getTranslatedResourceStatuses();
    },
  },
  methods: {
    // Funkcja ładująca zasoby po wybraniu katastrofy
    loadResources() {
      if (!this.destinationId) return;

      this.loading = true;
      this.error = null;

      axios
        .get(`http://localhost:8080/api/resource/getBydestination/${this.destinationId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },})
        .then((response) => {
          this.resources = response.data;
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania zasobów:", error);
          this.error = this.translations[this.language].failed_to_load ;
          this.failed_to_load = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Funkcja dokonująca geolokacji na podstawie współrzędnych
    reverseGeocode(latitude, longitude) {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

      return axios
        .get(apiUrl, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },})
        .then((response) => {
          return response.data.display_name || 'Nieznane położenie';
        })
        .catch((error) => {
          console.error('Błąd podczas pobierania geolokacji:', error);
          return 'Nie udało się określić położenia';
        });
    },

    // Funkcja wczytująca katastrofy i uzupełniająca geolokację
    async loadCatastrophes() {
      try {
        /*
        const response = await axios.get('/catastrophes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }); // Endpoint zwracający katastrofy
        */
        const response = await axios.get(`/catastrophes`);
        const catastrophes = response.data;

        // Dodaj nazwę lokalizacji do każdej katastrofy
        for (let catastrophe of catastrophes) {
          const address = await this.reverseGeocode(catastrophe.latitude, catastrophe.longitude);
          catastrophe.location = address; // Dodaj lokalizację do katastrofy
        }

        this.catastrophes = catastrophes;
      } catch (error) {
        console.error('Błąd podczas ładowania katastrof:', error);
      }
    },
    // Funkcja zwracająca przetłumaczone zasoby
  getTranslatedResourceTypes() {
      const currentLanguage = this.language; // Odwołanie do ref języka
      return Object.keys(this.translations[currentLanguage].resourceTypes).map((key) => ({
        key,
        label: this.translations[currentLanguage].resourceTypes[key],
      }));
    },
    getTranslatedResourceStatuses() {
      const currentLanguage = this.language; // Odwołanie do ref języka
      return Object.keys(this.translations[currentLanguage].resourceStatuses).map((key) => ({
        key,
        label: this.translations[currentLanguage].resourceStatuses[key],
      }));
    },
    getTranslatedResourceType(type) {
      const currentLanguage = this.language;
      return this.translations[currentLanguage].resourceTypes[type] || type;
    },
    getTranslatedResourceStatus(status) {
      const currentLanguage = this.language;
      return this.translations[currentLanguage].resourceStatuses[status] || status;
    },
  },

  mounted() {
    this.loadCatastrophes(); // Załaduj katastrofy po załadowaniu komponentu
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
