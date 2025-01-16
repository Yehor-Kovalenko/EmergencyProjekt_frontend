<template>
    <div>
      <h2>Logowanie</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div>
          <label for="password">Hasło</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
</template>
  
<script>
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      handleLogin() {
        console.log('Logowanie:', this.email, this.password);
        // Wywołanie API dla logowania
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
  