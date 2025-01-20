<template>
    <div>
      <h2>{{ translations[language].pageName }}</h2>
      
      <div>
        <h3>{{ translations[language].roleLabel }}</h3>
        <button @click="role = 'Volunteer'">Volunteer</button>
        <button @click="role = 'Giver'">Giver</button>
        <button @click="role = 'NGO'">NGO</button>
        <button @click="role = 'Official'">Official</button>
      </div>

      <form @submit.prevent="handleRegister">
        <div>
          <label for="username">{{ translations[language].username }}</label>
          <input id="username" v-model="username" type="text" required />
        </div>
        <div>
          <label for="email">{{ translations[language].email }}</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div>
          <label for="phone">{{ translations[language].phone }}</label>
          <input id="phone" v-model="phone" type="tel" 
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}" required />
        </div>
        <div>
          <label for="password">{{ translations[language].password }}</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <div>
          <label for="confirmPassword">{{ translations[language].confirmPassword }}</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
          />
        </div>

        <div v-if="role === 'Volunteer' || role === 'Giver'">
        <div>
          <label for="firstName">{{ translations[language].firstName }}</label>
          <input id="firstName" v-model="firstName" type="text" required />
        </div>
        <div>
          <label for="lastName">{{ translations[language].lastName }}</label>
          <input id="lastName" v-model="lastName" type="text" required />
        </div>
        <div>
          <label for="birthDate">{{ translations[language].birthDate }}</label>
          <input id="birthDate" v-model="birthDate" type="date" required />
        </div>
        <div v-if="role === 'Volunteer'">
          <label for="organizationId">{{ translations[language].organizationId }}</label>
          <!-- <input id="organizationId" v-model="organizationId" type="text" required /> -->
           <select id="organizationId" v-model="organizationId">
              <option v-for="item in items" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
           </select>
        </div>
        </div>

        <div v-if="role === 'NGO'">
          <div>
            <label for="ngoName">{{ translations[language].ngoName }}</label>
            <input id="ngoName" v-model="ngoName" type="text" required />
          </div>
         <div>
            <label for="krs">{{ translations[language].krs }}</label>
            <input id="krs" v-model="krs" type="text" required />
          </div>
        </div>

        <div v-if="role === 'Official'">
          <div>
            <label for="officialName">{{ translations[language].officialName }}</label>
            <input id="officialName" v-model="officialName" type="text" required />
          </div>
          <div>
            <label for="regon">{{ translations[language].regon }}</label>
            <input id="regon" v-model="regon" type="text" required />
          </div>
        </div>

        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
</template>
  
<script>
import axios from "@/axiosConfig";
import { ref, onMounted } from "vue";

export default {
  name: "Register",
  setup(){
    const items = ref([]);
    const selectedValue = ref("");

    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ngo");
        
        console.log(response)
        
        items.value = response.data;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    onMounted(() => {
      fetchItems();
    });

    return {
      items,
      selectedValue,
    };
  },
  data() {
    return {
      language: localStorage.getItem("language") || "pl",
      role: "Volunteer",

      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      firstName: "",
      lastName: "",
      birthDate: "",
      organizationId: "",
      ngoName: "",
      krs: "",
      officialName: "",
      regon: "",

      translations: {
        pl: {
          pageName: "Rejestracja",
          roleLabel: "Wybierz rolę",
          username: "Login",
          email: "Adres email",
          phone: "Numer telefonu",
          password: "Hasło",
          confirmPassword: "Powtórz hasło",
          firstName: "Imię",
          lastName: "Nazwisko",
          birthDate: "Data urodzin",
          organizationId: "ID organizacji",
          ngoName: "Nazwa NGO",
          krs: "Numer KRS",
          officialName: "Nazwa urzędu",
          regon: "Numer REGON",
          button: "Zarejestruj się",
        },
        en: {
          pageName: "Registration",
          roleLabel: "Choose role",
          username: "Login",
          email: "Email address",
          phone: "Phone number",
          password: "Password",
          confirmPassword: "Repeat password",
          firstName: "First name",
          lastName: "Last name",
          birthDate: "Birth date",
          organizationId: "Organization ID",
          ngoName: "NGO name",
          krs: "KRS number",
          officialName: "Office name",
          regon: "REGON number",
          button: "Register",
        },
      },
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("Hasła się nie zgadzają!");
        return;
      }

      try {
        let userData = {
          username: this.username,
          email: this.email,
          phone: this.phone,
          password: this.password,
          role: this.role,
        };

        if (this.role === "Volunteer" || this.role === "Giver") {
          userData.firstName = this.firstName;
          userData.lastName = this.lastName;
          userData.birthDate = this.birthDate;
        }
        if (this.role === "Volunteer") userData.organizationId = this.organizationId;
        if (this.role === "NGO") Object.assign(userData, { ngoName: this.ngoName, krs: this.krs });
        if (this.role === "Official") Object.assign(userData, { officialName: this.officialName, regon: this.regon });

        await axios.post("/auth/register", userData);
        alert("Registration successful");
        window.location.href = "/";
      } catch (error) {
        console.error("Błąd rejestracji:", error);
        alert("Nie udało się zarejestrować użytkownika");
      }
    },
  },
};
</script>
  
<style scoped>
h2, label {
    color:black;
    display: flex;
    justify-content: center;
    align-items: center;
} 
input {
    display: flex;
    justify-content: center;
    align-items: center;   
}
button {
    display: flex;
    margin-left: auto;
}
</style>
  