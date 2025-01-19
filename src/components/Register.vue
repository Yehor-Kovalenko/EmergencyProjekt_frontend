<template>
    <div>
      <h2>Rejestracja</h2>
      
      <div>
        <h3>Wybierz rolę</h3>
        <button @click="role = 'Volunteer'">Volunteer</button>
        <button @click="role = 'Giver'">Giver</button>
        <button @click="role = 'NGO'">NGO</button>
        <button @click="role = 'Official'">Official</button>
      </div>

      <form @submit.prevent="handleRegister">
        <div>
          <label for="username">Login</label>
          <input id="username" v-model="username" type="text" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div>
          <label for="phone">Numer telefonu</label>
          <input id="phone" v-model="phone" type="tel" 
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}" required />
        </div>
        <div>
          <label for="password">Hasło</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <div>
          <label for="confirmPassword">Potwierdź hasło</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
          />
        </div>

        <div v-if="role === 'Volunteer' || role === 'Giver'">
        <div>
          <label for="firstName">Imię</label>
          <input id="firstName" v-model="firstName" type="text" required />
        </div>
        <div>
          <label for="lastName">Nazwisko</label>
          <input id="lastName" v-model="lastName" type="text" required />
        </div>
        <div>
          <label for="birthDate">Data urodzenia</label>
          <input id="birthDate" v-model="birthDate" type="date" required />
        </div>
        <div v-if="role === 'Volunteer'">
          <label for="organizationId">ID organizacji</label>
          <input id="organizationId" v-model="organizationId" type="text" required />
        </div>
        </div>

        <div v-if="role === 'NGO'">
          <div>
            <label for="ngoName">Nazwa NGO</label>
            <input id="ngoName" v-model="ngoName" type="text" required />
          </div>
         <div>
            <label for="krs">Numer KRS</label>
            <input id="krs" v-model="krs" type="text" required />
          </div>
        </div>

        <div v-if="role === 'Official'">
          <div>
            <label for="officialName">Nazwa urzędu</label>
            <input id="officialName" v-model="officialName" type="text" required />
          </div>
          <div>
            <label for="regon">Numer REGON</label>
            <input id="regon" v-model="regon" type="text" required />
          </div>
        </div>

        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
</template>
  
<script>
  import axios from '@/axiosConfig'

  export default {
    name: 'Register',
    data() {
      return {
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'Volunteer',
        
        firstName: '',
        lastName: '',
        birthDate: '',
        organizationId: '',
        ngoName: '',
        krs: '',
        officialName: '',
        regon: '',
      };
    },
    methods: {
      async handleRegister() {
        console.log('dupa')

        if (this.password !== this.confirmPassword) {
          alert('Hasła się nie zgadzają!')
          return
        }
        
        try {
          console.log('Rejestracja:', this.email, this.password)
          
          let userData = {
            username: this.username,
            email: this.email,
            phone: this.phone,
            password: this.password,
            role: this.role,
          }
          
          switch (this.role) {
            case 'Volunteer':
              userData = {
                ...userData,
                firstName: this.firstName,
                lastName: this.lastName,
                birthDate: this.birthDate,
                organizationId: this.organizationId,
              }
              break
            case 'Giver':
              userData = {
                ...userData,
                firstName: this.firstName,
                lastName: this.lastName,
                birthDate: this.birthDate
              }
              break
            case 'NGO':
              userData = {
                ...userData,
                ngoName: this.ngoName,
                krs: this.krs
              }
              break
            case 'Official':
              userData = {
                ...userData,
                officialName: this.officialName,
                regon: this.regon
              }
              break
            default:
              log.error('Nieprawidłowa rola:', this.role)
          }

          const response = await axios.post('/auth/register', userData)
          
          console.log('Registration successful')
          alert('Registration successful')

          this.$router.push('/auth/login')

        } catch (error) {
          console.error('Błąd rejestracji:', error)
          alert('Nie udało się zarejestrować użytkownika')
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
  