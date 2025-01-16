<template>
    <div>
      <h2>Rejestracja</h2>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
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
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
</template>
  
<script>
  export default {
    name: 'Register',
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
      };
    },
    methods: {
      handleRegister() {
        if (this.password !== this.confirmPassword) {
          alert('Hasła się nie zgadzają!');
          return;
        }
        console.log('Rejestracja:', this.email, this.password);
        // Wywołanie API dla rejestracji
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
  