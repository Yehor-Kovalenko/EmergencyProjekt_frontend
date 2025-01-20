<template>
    <div class="auth-container">
      <div class="buttons">
        <button @click="currentView = 'Login'">{{ translations[language].loginButton }}</button>
        <button @click="currentView = 'Register'">{{ translations[language].registerButton }}</button>
      </div>
  
      <component :is="currentView" />
      <p v-if="currentView === 'Login'" @click="currentView = 'Password'">
        {{ translations[language].forgotten }}
      </p>
    </div>
</template>
  
<script>
  import Login from '@/components/Login.vue';
  import Register from '@/components/Register.vue';
  import Password from '@/components/Password.vue';
  import { ref } from 'vue';

  export default {
    name: 'AuthView',
    components: {
      Login,
      Register,
      Password,
    },
    data() {
      return {
        currentView: 'Login',
      };
    },
    setup(){
      const language = ref(localStorage.getItem('language') || 'pl');
      const translations = {
        pl: {
          loginButton: 'Logowanie',
          registerButton: 'Rejestracja',
          forgotten: 'Nie pamiętam hasła'
        }, 
        en: {
          loginButton: 'Log in',
          registerButton: 'Register',
          forgotten: 'Forgot password?'
        }
      }
    
      const currentView = ref('Login');

      return {
        language,
        translations,
        currentView,
      };
    }
  };


</script>
  
<style scoped>
  .auth-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button:hover {
    background-color: #f0f0f0;
  }
  
  p {
    color:black;
    cursor: pointer;
    margin: 0; 
    text-decoration: underline;
  }
</style>
