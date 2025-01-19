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
  import axios from '@/axiosConfig'
  
  export default {
    name: 'Password',
    data() {
      return {
        email: '',
      };
    },
    methods: {       
        async handleSubmit() {
        console.log('Przypomnij hasło:', this.email);
        
        try {
          const response = await axios.post('/auth/password-reset/request', {
            email: this.email,
          })

          console.log('Link do zmiany hasła przesłany')

        } catch (error) {
          console.error('Błąd:', error)
          alert('Nie udało się przesłać żadania. Spróbuj ponownie')
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