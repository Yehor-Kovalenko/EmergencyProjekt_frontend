<template>
  <h2 v-if="showForm || showDonateForm">
    {{ showForm ? translations[language].add_resource :  translations[language].donate_resource }}
  </h2>
  <div class="resource-form-container">
  <h2>{{ translations[language].heading }}</h2>

  <div>
  <!-- Formularz dodawania zasobu do katastrofy -->
  <form v-if="showForm" @submit.prevent="submitForm">
    <div>
      <label>{{ translations[language].type }}</label>
      <select v-model="form.type">
        <option v-for="type in resourceTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
    <div>
      <label>{{ translations[language].description }}:</label>
        <input type="text" v-model="form.description" />
      </div>
        <!---<input type="number" v-model.number="form.destinationId" required /> -->
        <!--- WYBÓR KATASTROFY Z LISTY -->
        <div>
          <label>{{ translations[language].destination }}</label>
          <select v-model.number="form.destinationId" @change="loadCatastrophes">
            <option
              v-for="catastrophe in catastrophes"
              :key="catastrophe.id"
              :value="catastrophe.id"
            >
            {{ catastrophe.type }} - {{ catastrophe.location || translations[language].loading }}
            </option>
          </select>
        </div>
    <div>
      <label>{{ translations[language].amount }}</label>
      <input type="number" v-model.number="form.amount" required min="1" />
    </div>
    <div>
      <label>{{ translations[language].holder }}</label>
      <input type="text" :value="username" required disabled />
    </div>
    <button type="submit">{{ translations[language].add }}</button>
    <button type="button" @click="cancelForm">{{ translations[language].cancel }}</button>
  </form>
</div>

  <!-- Formularz przekazania zasobu -->
  <form v-if="showDonateForm || showDonateForOfficial" @submit.prevent="submitDonateForm">
    <div>
      <label>{{ translations[language].type }}</label>
      <select v-model="form.type">
        <option v-for="type in resourceTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
    <div>
      <label>{{ translations[language].description }}</label>
      <input type="text" v-model="form.description" />
    </div>
    <div>
      <label>{{ translations[language].amount }}</label>
      <input type="number" v-model.number="form.amount" required min="1" />
    </div>
    <div>
      <label>{{ translations[language].choose_org }}</label>
      <div v-if="userRole==='NGO' || (userRole==='OFFICIAL' && !this.showDonateForOfficial)">
        <input type="text" :value="username" required disabled />
      </div>
      <div v-else>
      <!--- WYBÓR ORGANIZACJI LUB WŁADZ Z LISTY -->
        <select v-model.number="form.holderId" required>
          <optgroup :label= "translations[language].official">
            <option v-for="official in officials" :key="official.id" :value="official.id">
              {{ official.name }}
            </option>
          </optgroup>
          <optgroup :label="translations[language].ngo">
            <option v-for="ngo in ngos" :key="ngo.id" :value="ngo.id">
              {{ ngo.name }}
            </option>
          </optgroup>
        </select>
      </div>
    </div>
    <button type="submit">{{ translations[language].donate }}</button>
    <button type="button" @click="cancelForm">{{ translations[language].cancel }}</button>
  </form>

  <!-- Tabela zasobów -->
  <table v-if="!showForm && !showDonateForm">
    <thead>
      <tr>
        <th>{{ translations[language].date }}</th>
        <th>{{ translations[language].type }}</th>
        <th>{{ translations[language].description }}</th>
        <th>{{ translations[language].status }}</th>
        <th>{{ translations[language].amount }}</th>
        <th>{{ translations[language].destination }}</th>
        <th v-if="isNgoOrOfficial">{{ translations[language].actions }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="resource in resources" :key="resource.id">
        <td>{{ resource.date }}</td>
        <td>{{ resource.type }}</td>
        <td>{{ resource.description }}</td>
        <td>{{ resource.status }}</td>
        <td>{{ resource.amount }}</td>
        <!--<td>{{ resource.destinationId }}</td>-->
        <span v-if="resource.destinationId">
          {{ getCatastropheById(resource.destinationId)?.type }} - 
          {{ getCatastropheById(resource.destinationId)?.location || translations[language].unknown_destination  }}
      </span>
      <span v-else>{{ translations[language].no_destination }}</span>

      <td v-if="isNgoOrOfficial">
        <button @click="openStatusMenu(resource.id)">{{ translations[language].change_status }}</button>
        <button v-if="resource.destinationId === null" @click="openDestinationForm(resource.id)">{{ translations[language].add_destination }}</button>
      </td>

      </tr>
    </tbody>
  </table>

  <!-- Przyciski dodawania i przekazywania zasobów -->
  <div v-if="!showForm && !showDonateForm">
    <button
      @click="openForm"
      @mouseover="tooltip =  translations[language].add_tooltip "
      @mouseleave="tooltip = ''"
    >
    {{ translations[language].add_resource }}
    </button>
    <button v-if="userRole === 'NGO' || userRole === 'OFFICIAL'"
      @click="openDonateForm"
      @mouseover="tooltip =  translations[language].add_without_destination_tooltip "
      @mouseleave="tooltip = ''"
    >
    {{ translations[language].add_without_destination }}
    </button>
    <button v-if="userRole !== 'NGO'"
      @click="openDonateForOfficialsForm"
      @mouseover="tooltip =  translations[language].donate_tooltip "
      @mouseleave="tooltip = ''"
    >
    {{ translations[language].donate_resource }}
    </button>
    <div v-if="tooltip" class="tooltip">{{ tooltip }}</div>
    <button @click="$emit('close')">{{ translations[language].close }}</button>
  </div>

  <!-- Menu zmiany statusu -->
  <div v-if="showStatusMenu">
    <h3>{{ translations[language].change_status }}</h3>
    <select v-model="selectedStatus">
      <option v-for="status in resourceStatuses" :key="status" :value="status" :disabled="isStatusDisabled(status)">
        {{ status }}
      </option>
    </select>
    <button
      @click="changeStatus" 
      :disabled="isStatusDisabled(selectedStatus)"
      @mouseover="isStatusDisabled(selectedStatus) ? tooltip = translations[language].status_disabled_tooltip : tooltip = ''"
      @mouseleave="tooltip = ''">
      {{ translations[language].save_status }}
    </button>
    <button @click="closeStatusMenu">{{ translations[language].cancel }}</button>
  </div>

<!-- Tooltip -->
<div v-if="tooltip" class="tooltip">{{ tooltip }}</div>


  <!-- Menu zmiany destinationId -->
  <div v-if="showDestinationMenu">
    <h3>{{ translations[language].new_destination_heading }}</h3>
    <label>{{ translations[language].new_destination }}</label>
    <!--- WYBÓR KATASTROFY Z LISTY -->
    <div>
          <label>{{ translations[language].destination }}</label>
          <select v-model.number="this.newDestinationId" @change="loadCatastrophes">
            <option
              v-for="catastrophe in catastrophes"
              :key="catastrophe.id"
              :value="catastrophe.id"
            >
            {{ catastrophe.type }} - {{ catastrophe.location || translations[language].loading }}
            </option>
          </select>
        </div>
    <button @click="updateDestinationId">{{ translations[language].save_changes }}</button>
    <button @click="closeDestinationMenu">{{ translations[language].cancel }}</button>
  </div>

</div>
</template>


<script>
import axios from '../axiosConfig';
export default {
  name: 'ResourceForm',
  setup() {
    //language = localStorage.getItem('language');
    const translations = {
      pl: {
        heading: 'Zarządzanie zasobami',
        add_resource: 'Dodaj zasób',
        donate_resource: 'Przekaż zasób',
        type: 'Typ',
        description: 'Opis',
        destination: 'Przeznaczenie',
        amount: 'Ilość',
        holder: 'Właściciel',
        add: 'Dodaj',
        cancel: 'Anuluj',
        donate: 'Przekaż',
        choose_org: 'Wybierz organizację której chcesz przekazać zasób: ',
        official: 'Władze',
        ngo: 'NGO',
        actions: 'Akcje',
        status: 'Status',
        change_status: 'Zmień status zasobu',
        save_status: 'Zapisz status',
        add_destination: 'Dodaj przeznaczenie',
        new_destination_heading: 'Wprowadź nowe przeznaczenie zasobu',
        new_destination: 'Nowe przeznanie',
        save_changes: 'Zapisz zmiany',
        no_destination: 'Brak przypisanego przeznaczenia',
        date: 'Data rejestracji',
        change_status: 'Zmień status',
        save_status: 'Zapisz status',
        add_tooltip: 'Przekaż zasób na rzecz wybranej katastrofy',
        donate_tooltip: 'Przekaż zasób wybranej organizacji pomocowej bądź władzom',
        close: 'Zamknij',
        loading: 'Pobieranie położenia...',
        status_disabled_tooltip: 'Nie możesz wybrać tego statusu dla tego zasobu',
        unknown_destination: 'Nieznane położenie',
        add_without_destination_tooltip: 'Zarejestruj zasób bez przypisywania przeznaczenia',
        add_without_destination: 'Dodaj zasób bez przypisania przeznaczenia',
      },
      en: {
        heading: 'Resource Management',
        add_resource: 'Add resource',
        donate_resource: 'Donate resource',
        type: 'Type',
        description: 'Description',
        destination: 'Destination',
        amount: 'Amount',
        holder: 'Holder',
        add: 'Add',
        cancel: 'Cancel',
        donate: 'Donate',
        choose_org: 'Choose organization to donate a resource: ',
        official: 'Officials',
        ngo: 'NGOs',
        actions: 'Actions',
        status: 'Status',
        change_status: 'Change resource status',
        save_status: 'Save status',
        add_destination: 'Add destination',
        new_destination_heading: 'Enter new resource destination',
        new_destination: 'New destination',
        save_changes: 'Save changes',
        no_destination: 'No destination assigned',
        date: 'Registration date',
        change_status: 'Change status',
        save_status: 'Save status',
        add_tooltip: 'Donate resource to selected catastrophe',
        donate_tooltip: 'Donate resource to selected NGO or officials',
        close: 'Close',
        loading: 'Fetching location...',
        status_disabled_tooltip: 'You cannot choose this status for this resource',
        unknown_destination: 'Unknown location',
        donate_for_ngo_tooltip: 'Register resource without assigning destination',
        add_without_destination: 'Add resource without assigning destination',
      },
    };
    return { translations };
    },
  data() {
    return {
      language: localStorage.getItem('language'),
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
      //showResourceForm: true,
      showForm: false,
      showDonateForm: false,
      showDonateForOfficial: false,
      showStatusMenu: false,
      showDestinationMenu: false,
      selectedResourceId: null,
      selectedStatus: '',
      catastrophes: [],
      geolocation: '',
      officials: [],
      ngos: [],
      username: localStorage.getItem('username'),
      userid: localStorage.getItem('userId'),
      userRole: localStorage.getItem('role'),
    };
  },
  computed: {
    // Sprawdzamy, czy rola użytkownika jest zgodna z jednym z wymaganych
    isNgoOrOfficial() {
      const userRole = localStorage.getItem('role'); // Pobieramy 'userRole' z localStorage
      console.log('userrole', userRole);
      return userRole === 'NGO' || userRole === 'OFFICIAL'; // Przycisk widoczny tylko, gdy rola to 'NGO' lub 'Official'
    }
  },
  methods: {
    fetchResources() {
      console.log(localStorage.getItem('userId'));
      console.log('rola', localStorage.getItem('role'));
      axios
        .get(`resource/getByholder/${localStorage.getItem('userId')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then((response) => {
          this.resources = response.data;
        })
        .catch((error) => {
          console.error('Błąd podczas pobierania zasobów:', error);
        });
    },
    // Metoda do dodania zasobu do katastrofy
    submitForm() {
      this.form.holderId = this.userid;
      const params = new URLSearchParams(this.form);
      console.log(params.toString());
      axios
        .post(`resource/destination?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },})
        .then(() => {
          this.showForm = false;
          this.fetchResources(); // Odświeżenie zasobów po zapisaniu
        })
        .catch((error) => {
          console.error('Błąd podczas zapisu:', error);
        });
    },
    submitDonateForm() {
      if (this.userRole === 'NGO' || (this.userRole === 'OFFICIAL' && !this.showDonateForOfficial)) {
        this.form.holderId = this.userid;
      }
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
      this.showDonateForOfficial = false;
      this.resetForm();
    },
    openDonateForOfficialsForm() {
      this.showDonateForm = false;
      this.showDonateForOfficial = true;
      this.showForm = false;
      this.resetForm();
    },
    openDonateForm() {
      this.showDonateForm = true;
      this.showForm = false;
      this.showDonateForOfficial = false;
      this.resetForm();
    },
    cancelForm() {
      this.showForm = false;
      this.showDonateForm = false;
      this.showDonateForOfficial = false;
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
  getCatastropheById(destinationId) {
    return this.catastrophes.find(catastrophe => catastrophe.id === destinationId);
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
      .get(apiUrl, { withCredentials: false })
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
      console.log('Aktualizacja destinationId:', this.newDestinationId);
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
    .get(`http://localhost:8080/ngo`,
    )  // Endpoint dla NGO i władz
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
    
    //roboczo
    //localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYWEiLCJpYXQiOjE3MzczMTAxNDUsImV4cCI6MTczNzMxMDQ0NX0.ib_kwXRgxFvOKSAfSh4PO4utBy66RrPXEByhKPP1rxk');

    localStorage.setItem('language', 'pl');
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
