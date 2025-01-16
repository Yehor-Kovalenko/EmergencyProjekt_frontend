<template>
    <div>
      <h2>Przypomnij hasło</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <button type="submit">Przypomnij hasło</button>
      </form>
    </div>
</template>
  
<script>
  export default {
    name: 'Password',
    data() {
      return {
        email: '',
      };
    },
    methods: {
        handleSubmit() {
        console.log('Przypomnij hasło:', this.email);
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
  