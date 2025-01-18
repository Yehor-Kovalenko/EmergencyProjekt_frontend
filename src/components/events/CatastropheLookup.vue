<template>
  <div class="catastrophe-view">
    <div v-if="catastrophe">
      <h3>Szczegóły Katastrofy:</h3>
      <p><strong>Typ:</strong> {{ catastrophe.type }}</p>
      <p><strong>Szerokość geograficzna:</strong> {{ catastrophe.latitude }}</p>
      <p><strong>Długość geograficzna:</strong> {{ catastrophe.longitude }}</p>
      <p><strong>Aktywna:</strong> {{ catastrophe.isActive === 1 ? 'Tak' : 'Nie' }}</p>
      <p><strong>Data:</strong> {{ new Date(catastrophe.reportedDate).toLocaleString() }}</p>
    </div>

    <div v-if="error" class="error-message">
      <p>Nie znaleziono katastrofy o podanym ID.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'CatastropheView',
  setup() {
    const route = useRoute();
    const catastrophe = ref(null);
    const error = ref(false);

    const fetchCatastrophe = async (catastropheId) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/catastrophes/${catastropheId}`);
        catastrophe.value = response.data;
        error.value = false;
      } catch (err) {
        console.error('Błąd podczas pobierania katastrofy:', err);
        catastrophe.value = null;
        error.value = true;
      }
    };

    onMounted(() => {
      const catastropheId = route.params.catastropheId;
      if (catastropheId) {
        fetchCatastrophe(catastropheId);
      }
    });

    return {
      catastrophe,
      error,
    };
  },
};
</script>

<style>
.catastrophe-view {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid red;
  background-color: #ffe0e0;
  color: red;
}
</style>
