<template>
  <div>
    <h1>Invite View</h1>
    <p>NGO ID: {{ ngoId }}</p>
    <p>Event ID: {{ eventId }}</p>
    <button @click="invite" class="btn btn-primary">Invite</button>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "InviteView",
  setup() {
    const route = useRoute();

    const ngoId = route.params.ngoId;
    const eventId = route.params.eventId;

    const invite = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/ngo/${ngoId}/invite`,
          null,
          {
            params: {
              eventId: eventId,
            },
          }
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error(
          "Error during invitation:",
          error.response?.data || error.message
        );
      }
    };

    return { ngoId, eventId, invite };
  },
};
</script>

<style scoped>
.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
