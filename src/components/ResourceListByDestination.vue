<template>
  <div>
    <div>
      <label>Wybierz katastrofę:</label>
      <select v-model.number="destinationId" @change="loadResources">
        <option
          v-for="catastrophe in catastrophes"
          :key="catastrophe.id"
          :value="catastrophe.id"
        >
          {{ catastrophe.type }} - {{ catastrophe.location || 'Pobieranie położenia...' }}
        </option>
      </select>
    </div>

    <h2>Lista zasobów dla katastrofy</h2>
    <div v-if="loading">Ładowanie zasobów...</div>
    <div v-else-if="error">{{ error }}</div>

    <!-- Tabela wyświetlana tylko po wybraniu katastrofy -->
    <table v-if="resources.length > 0 && destinationId">
      <thead>
        <tr>
          <th>Data rejestracji</th>
          <th>Typ</th>
          <th>Opis</th>
          <th>Status</th>
          <th>Ilość</th>
          <th>Darczyńca</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td>{{ resource.date }}</td>
          <td>{{ resource.type }}</td>
          <td>{{ resource.description }}</td>
          <td>{{ resource.status }}</td>
          <td>{{ resource.amount }}</td>
          <td>{{ resource.holderId }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>Brak zasobów przypisanych do tej katastrofy.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResourceListByDestination",
  data() {
    return {
      resources: [],
      loading: false,
      error: null,
      destinationId: null,
      catastrophes: [],
    };
  },
  methods: {
    // Funkcja ładująca zasoby po wybraniu katastrofy
    loadResources() {
      if (!this.destinationId) return;

      this.loading = true;
      this.error = null;

      axios
        .get(`http://localhost:8080/api/resource/getBydestination/${this.destinationId}`)
        .then((response) => {
          this.resources = response.data;
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania zasobów:", error);
          this.error = "Nie udało się pobrać zasobów. Spróbuj ponownie później.";
        })
        .finally(() => {
          this.loading = false;
        });
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

    // Funkcja wczytująca katastrofy i uzupełniająca geolokację
    async loadCatastrophes() {
      try {
        const response = await axios.get('/catastrophes'); // Endpoint zwracający katastrofy
        const catastrophes = response.data;
        console.log('Katastrofy z load:', catastrophes);

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
