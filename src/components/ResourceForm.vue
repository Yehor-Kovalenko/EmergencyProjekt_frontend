<template>
    <h2 v-if="showForm || showDonateForm">
      {{ showForm ? 'Dodaj zasób' : 'Przekaż zasób' }}
    </h2>
    <div class="resource-form-container">
    <h2>Zarządzanie zasobami</h2>

    <div>
    <!-- Formularz dodawania zasobu do katastrofy -->
    <form v-if="showForm" @submit.prevent="submitForm">
      <div>
        <label>Typ:</label>
        <select v-model="form.type">
          <option v-for="type in resourceTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div>
        <label>Opis:</label>
          <input type="text" v-model="form.description" />
        </div>
          <!---<input type="number" v-model.number="form.destinationId" required /> -->
          <!--- WYBÓR KATASTROFY Z LISTY -->
          <div>
            <label>Przeznaczenie:</label>
            <select v-model.number="form.destinationId" @change="loadCatastrophes">
              <option
                v-for="catastrophe in catastrophes"
                :key="catastrophe.id"
                :value="catastrophe.id"
              >
              {{ catastrophe.type }} - {{ catastrophe.location || 'Pobieranie położenia...' }}
              </option>
            </select>
          </div>
      <div>
        <label>Ilość:</label>
        <input type="number" v-model.number="form.amount" required min="1" />
      </div>
      <div>
        <label>Holder ID:</label>
        <input type="number" v-model.number="form.holderId" required />
      </div>
      <button type="submit">Dodaj</button>
      <button type="button" @click="cancelForm">Anuluj</button>
    </form>
  </div>

    <!-- Formularz przekazania zasobu -->
    <form v-if="showDonateForm" @submit.prevent="submitDonateForm">
      <div>
        <label>Typ:</label>
        <select v-model="form.type">
          <option v-for="type in resourceTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div>
        <label>Opis:</label>
        <input type="text" v-model="form.description" />
      </div>
      <div>
        <label>Ilość:</label>
        <input type="number" v-model.number="form.amount" required min="1" />
      </div>
      <div>
        <label>Holder ID:</label>
        <!--- WYBÓR ORGANIZACJI LUB WŁADZ Z LISTY -->
          <select v-model.number="form.holderId" required>
            <optgroup label="Officials">
              <option v-for="official in officials" :key="official.id" :value="official.id">
                {{ official.name }}
              </option>
            </optgroup>
            <optgroup label="NGOs">
              <option v-for="ngo in ngos" :key="ngo.id" :value="ngo.id">
                {{ ngo.name }}
              </option>
            </optgroup>
          </select>
      </div>
      <button type="submit">Przekaż</button>
      <button type="button" @click="cancelForm">Anuluj</button>
    </form>

    <!-- Tabela zasobów -->
    <table v-if="!showForm && !showDonateForm">
      <thead>
        <tr>
          <th>Data rejestracji</th>
          <th>Typ</th>
          <th>Opis</th>
          <th>Status</th>
          <th>Ilość</th>
          <th>Przeznaczenie</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td>{{ resource.date }}</td>
          <td>{{ resource.type }}</td>
          <td>{{ resource.description }}</td>
          <td>{{ resource.status }}</td>
          <td>{{ resource.amount }}</td>
          <td>{{ resource.destinationId }}</td>
          <td>
            <button @click="openStatusMenu(resource.id)">Zmień status</button>
            <button v-if="resource.destinationId === null" @click="openDestinationForm(resource.id)">Dodaj przeznaczenie</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Przyciski dodawania i przekazywania zasobów -->
    <div v-if="!showForm && !showDonateForm">
      <button
        @click="openForm"
        @mouseover="tooltip = 'Przekaż zasób na rzecz wybranej katastrofy'"
        @mouseleave="tooltip = ''"
      >
        Dodaj zasób
      </button>
      <button
        @click="openDonateForm"
        @mouseover="tooltip = 'Przekaż zasób wybranej organizacji pomocowej bądź władzom'"
        @mouseleave="tooltip = ''"
      >
        Przekaż zasób
      </button>
      <div v-if="tooltip" class="tooltip">{{ tooltip }}</div>
      <button @click="$emit('close')">Zamknij</button>
    </div>

    <!-- Menu zmiany statusu -->
    <div v-if="showStatusMenu">
      <h3>Zmień status zasobu</h3>
      <select v-model="selectedStatus">
        <option v-for="status in resourceStatuses" :key="status" :value="status" :disabled="isStatusDisabled(status)">
          {{ status }}
        </option>
      </select>
      <button 
        @click="changeStatus" 
        :disabled="isStatusDisabled(selectedStatus)"
        @mouseover="isStatusDisabled(selectedStatus) ? tooltip = 'Nie możesz zmienić statusu tego zasobu' : tooltip = ''"
        @mouseleave="tooltip = ''">
        Zapisz status
      </button>
      <button @click="closeStatusMenu">Anuluj</button>
    </div>

<!-- Tooltip -->
<div v-if="tooltip" class="tooltip">{{ tooltip }}</div>


    <!-- Menu zmiany destinationId -->
    <div v-if="showDestinationMenu">
      <h3>Wprowadź nowe przeznaczenie zasobu</h3>
      <label>Nowe destinationId:</label>
      <input type="number" v-model.number="newDestinationId" required />
      <button @click="updateDestinationId">Zapisz zmiany</button>
      <button @click="closeDestinationMenu">Anuluj</button>
    </div>

  </div>
</template>


  <script>
  import axios from 'axios';
  export default {
    name: 'ResourceForm',
    data() {
      return {
        resources: [],
        resourceTypes: ['CLOTHES','PUBLICRESOURCE' , 'MEDICALSUPPLIES', 'FOOD', 'TOOLKITS', 'COMMUNICATIONDEVICES', 'TRANSPORT', 'ANOTHER'],
        resourceStatuses: ['REGISTERED', 'ASSIGNED', 'ENROUTE', 'DELIVERED'],
        form: {
          type: '',
          description: '',
          destinationId: null,
          amount: 0,
          holderId: null,
        },
        tooltip: '',
        showForm: false,
        showDonateForm: false,
        showStatusMenu: false,
        showDestinationMenu: false,
        selectedResourceId: null,
        selectedStatus: '',
        catastrophes: [],
        geolocation: '',
        officials: [],
        ngos: [],
      };
    },
    methods: {
      fetchResources() {
        axios
          .get('resource/getByholder/8')
          .then((response) => {
            this.resources = response.data;
          })
          .catch((error) => {
            console.error('Błąd podczas pobierania zasobów:', error);
          });
      },
      // Metoda do dodania zasobu do katastrofy
      submitForm() {
        const params = new URLSearchParams(this.form);
        axios
          .post(`http://localhost:8080/api/resource/destination?${params.toString()}`)
          .then(() => {
            this.showForm = false;
            this.fetchResources(); // Odświeżenie zasobów po zapisaniu
          })
          .catch((error) => {
            console.error('Błąd podczas zapisu:', error);
          });
      },
      submitDonateForm() {
        const params = new URLSearchParams({
          type: this.form.type,
          description: this.form.description,
          amount: this.form.amount,
          holderId: this.form.holderId,
        });
        axios
          .post(`http://localhost:8080/api/resource/donate?${params.toString()}`)
          .then(() => {
            this.showDonateForm = false;
            this.fetchResources();
          })
          .catch((error) => {
            console.error('Błąd podczas przekazywania zasobu:', error);
          });
      },
      openForm() {
        this.showForm = true;
        this.showDonateForm = false;
        this.resetForm();
      },
      openDonateForm() {
        this.showDonateForm = true;
        this.showForm = false;
        this.resetForm();
      },
      cancelForm() {
        this.showForm = false;
        this.showDonateForm = false;
        this.resetForm();
      },
      resetForm() {
        this.form = {
          type: '',
          description: '',
          destinationId: null,
          amount: 0,
          holderId: null,
        };
      },
      openStatusMenu(resourceId) {
        this.selectedResourceId = resourceId;
        this.showStatusMenu = true;
      },
      closeStatusMenu() {
        this.showStatusMenu = false;
        this.selectedResourceId = null;
        this.selectedStatus = '';
      },
      // Funkcja sprawdzająca, czy dany status jest zablokowany
    isStatusDisabled(status) {
      const currentStatus = this.resources.find(resource => resource.id === this.selectedResourceId)?.status;
      if (!currentStatus) return false; // Jeśli nie mamy statusu, nie blokujemy
      switch (status) {
        case 'REGISTERED':
          return currentStatus === 'ASSIGNED' || currentStatus === 'ENROUTE' || currentStatus === 'DELIVERED';
        case 'ASSIGNED':
          return currentStatus === 'ENROUTE' || currentStatus === 'DELIVERED';
        case 'ENROUTE':
          return currentStatus === 'DELIVERED';
        default:
          return false;
      }
    },
      // Zmieniamy status zasobu
    changeStatus() {
      if (this.isStatusDisabled(this.selectedStatus)) return; // Jeśli zmiana statusu jest zablokowana, nie wykonujemy operacji

      axios
        .put(`http://localhost:8080/api/resource/updateStatus/${this.selectedResourceId}`, null, {
          params: { status: this.selectedStatus },
        })
        .then(() => {
          this.closeStatusMenu();
          this.fetchResources();
        })
        .catch((error) => {
          console.error('Błąd podczas zmiany statusu:', error);
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
      // Przykladowe pobieranie katastrof, dostosuj do swojej logiki
      try {
        const response = await axios.get('/catastrophes'); // Endpoint zwracający katastrofy
        const catastrophes = response.data;
        console.log('Katastrofy z load:', catastrophes);

        // Dodaj nazwę lokalizacji do każdej katastrofy
        for (let catastrophe of catastrophes) {
          const address = await this.reverseGeocode(catastrophe.latitude, catastrophe.longitude);
          console.log(address);
          catastrophe.location = address; // Dodaj lokalizację do katastrofy
          console.log(catastrophe.location);
        }

        this.catastrophes = catastrophes;
      } catch (error) {
        console.error('Błąd podczas ładowania katastrof:', error);
      }
    },
      // Metoda aktualizująca geolokację po wybraniu katastrofy
    fetchGeolocation() {
      const selectedCatastrophe = this.catastrophes.find(
        (c) => c.id === this.form.destinationId
      );
      if (selectedCatastrophe) {
        const { latitude, longitude } = selectedCatastrophe;
        this.reverseGeocode(latitude, longitude);
      }
    },
      // Otwiera formularz zmiany destinationId
      openDestinationForm(resourceId) {
        this.selectedResourceId = resourceId;
        this.showDestinationMenu = true;  // Pokazuje formularz
        this.newDestinationId = null;  // Resetujemy nowe destinationId
      },

      // Zamyka formularz zmiany destinationId
      closeDestinationMenu() {
        this.showDestinationMenu = false;  // Ukrywa formularz
        this.selectedResourceId = null;
        this.newDestinationId = null;
      },

      // Wysyła zapytanie do backendu, aby zaktualizować destinationId
      updateDestinationId() {
        if (this.newDestinationId != null) {
          axios
            .put(`http://localhost:8080/api/resource/updateDestination/${this.selectedResourceId}`, null, {
              params: { newDestinationId: this.newDestinationId },
            })
            .then((response) => {
              console.log("Destination updated:", response.data);
              this.fetchResources();  // Odświeżenie zasobów po aktualizacji
              this.closeDestinationMenu();  // Zamykanie formularza
            })
            .catch((error) => {
              console.error("Błąd podczas zmiany destinationId:", error);
            });
        }
      },
      loadOfficialsAndNgos() {
    axios
      .get(`http://localhost:8080/ngo`)  // Endpoint dla NGO i władz
      .then((response) => {
        const data = response.data;
        //this.officials = data.officials || []; // Zakładając, że odpowiedź zawiera 'officials'
        this.ngos = data|| []; // Zakładając, że odpowiedź zawiera 'ngos'
        console.log('NGO:', response);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania NGO i władz:', error);
      });
      
  },
    },
    mounted() {
      this.fetchResources(); // Załadowanie zasobów po załadowaniu komponentu
      this.loadCatastrophes(); // Załadowanie katastrof po załadowaniu komponentu
      this.loadOfficialsAndNgos(); // Załadowanie NGO i władz po załadowaniu komponentu
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
/* Zablokowany przycisk */
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  pointer-events: none; /* Zapewnia, że przycisk nie będzie reagował na kliknięcia */
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
  z-index: 9999;
}

</style>
