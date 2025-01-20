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
          <input id="organizationId" v-model="organizationId" type="text" required />
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
import { ref } from "vue";
import axios from '@/axiosConfig';

export default {
  name: 'Register',
  setup() {
    const language = ref(localStorage.getItem("language") || "pl");
    const role = ref("Volunteer");

    const translations = {
      pl: {
        pageName: 'Rejestracja',
        roleLabel: 'Wybierz rolę',
        username: 'Login',
        email: 'Adres email',
        phone: 'Numer telefonu',
        password: 'Hasło',
        confirmPassword: 'Powtórz hasło',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        birthDate: 'Data urodzin',
        organizationId: 'ID organizacji',
        ngoName: 'Nazwa NGO',
        krs: 'Numer KRS',
        officialName: 'Nazwa urzędu',
        regon: 'Numer REGON',
        button: 'Zarejestruj się'
      },
      en: {
        pageName: 'Registration',
        roleLabel: 'Choose role',
        username: 'Login',
        email: 'Email address',
        phone: 'Phone number',
        password: 'Password',
        confirmPassword: 'Repeat password',
        firstName: 'First name',
        lastName: 'Last name',
        birthDate: 'Birth date',
        organizationId: 'Organization ID',
        ngoName: 'NGO name',
        krs: 'KRS number',
        officialName: 'Office name',
        regon: 'REGON number',
        button: 'Register'
      }
    };

    const username = ref('');
    const email = ref('');
    const phone = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const birthDate = ref('');
    const organizationId = ref('');
    const ngoName = ref('');
    const krs = ref('');
    const officialName = ref('');
    const regon = ref('');

    async function handleRegister() {
      if (password.value !== confirmPassword.value) {
        alert("Hasła się nie zgadzają!");
        return;
      }

      try {
        console.log("Rejestracja:", email.value, password.value);

        let userData = {
          username: username.value,
          email: email.value,
          phone: phone.value,
          password: password.value,
          role: role.value,
        };

        switch (role.value) {
          case "Volunteer":
            userData = {
              ...userData,
              firstName: firstName.value,
              lastName: lastName.value,
              birthDate: birthDate.value,
              organizationId: organizationId.value,
            };
            break;
          case "Giver":
            userData = {
              ...userData,
              firstName: firstName.value,
              lastName: lastName.value,
              birthDate: birthDate.value,
            };
            break;
          case "NGO":
            userData = {
              ...userData,
              ngoName: ngoName.value,
              krs: krs.value,
            };
            break;
          case "Official":
            userData = {
              ...userData,
              officialName: officialName.value,
              regon: regon.value,
            };
            break;
          default:
            console.error("Nieprawidłowa rola:", role.value);
        }

        const response = await axios.post("/auth/register", userData);
        console.log("Registration successful");
        alert("Registration successful");
        window.location.href = "/";

      } catch (error) {
        console.error("Błąd rejestracji:", error);
        alert("Nie udało się zarejestrować użytkownika");
      }
    }

    return {
      language,
      translations,
      role,
      username,
      email,
      phone,
      password,
      confirmPassword,
      firstName,
      lastName,
      birthDate,
      organizationId,
      ngoName,
      krs,
      officialName,
      regon,
      handleRegister,
    };
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
  