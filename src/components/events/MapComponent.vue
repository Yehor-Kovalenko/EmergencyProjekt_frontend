<template>
  <div id="map" ref="map" style="height: 600px;"></div>
</template>

<script>
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  name: "MapComponent",
  setup() {
    const map = ref(null);
    const markers = ref([]);
    const catastrophes = ref([]);
    const newMarker = ref(null);

    const initializeMap = () => {
      map.value = L.map("map").setView([52.2297, 21.0122], 13); // Warsaw coordinates

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value);

      map.value.on("click", onMapClick);
    };

    const loadCatastrophes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/catastrophes");
        const data = await response.json();
        catastrophes.value = data;

        // Dodaj markery dla już istniejących katastrof
        data.forEach((catastrophe) => {
          const marker = L.marker([catastrophe.latitude, catastrophe.longitude])
            .addTo(map.value)
            .bindPopup(`
              <h3>${catastrophe.type}</h3>
              <p><strong>Reported:</strong> ${new Date(
                catastrophe.reportedDate
              ).toLocaleString()}</p>
              <a href="/help-request/create/${catastrophe.id}" target="_blank">
                <button>Zgłoś Potrzebę Pomoc</button>
              </a>
              <a href="/catastrophes/${catastrophe.id}" target="_blank">
                <button>Podgląd katastrofy</button>
              </a>
            `);
          markers.value.push(marker);
        });
      } catch (error) {
        console.error("Error fetching catastrophes:", error);
      }
    };

    const onMapClick = (e) => {
      const { lat, lng } = e.latlng;

      // Usuń istniejący tymczasowy marker, jeśli jest
      if (newMarker.value) {
        map.value.removeLayer(newMarker.value);
      }

      // Dodaj nowy marker w miejscu kliknięcia
      newMarker.value = L.marker([lat, lng], { draggable: true })
        .addTo(map.value)
        .bindPopup(
          `
          <form id="catastropheForm">
            <label for="type">Typ Katastrofy:</label><br />
            <textarea id="type" name="type" required></textarea><br />
            <button type="submit">Zgłoś</button>
          </form>
        `
        )
        .openPopup();

      // Po zamknięciu okienka (kliknięciu w X) usuń nowy marker
      newMarker.value.on("popupclose", () => {
        if (newMarker.value) {
          map.value.removeLayer(newMarker.value);
          newMarker.value = null;
        }
      });

      // Obsługa wysłania formularza
      document.getElementById("catastropheForm").onsubmit = (event) => {
        event.preventDefault();
        const type = event.target.type.value;
        submitCatastrophe(type, lat, lng);
      };
    };

    const submitCatastrophe = async (type, lat, lng) => {
      try {
        const response = await fetch("http://localhost:8080/api/catastrophes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, latitude: lat, longitude: lng }),
        });
        const newCatastrophe = await response.json();

        // Dodaj marker dla nowo zgłoszonej katastrofy
        L.marker([newCatastrophe.latitude, newCatastrophe.longitude])
          .addTo(map.value)
          .bindPopup(`
            <h3>${newCatastrophe.type}</h3>
            <p><strong>Zgłoszono:</strong> ${new Date(
              newCatastrophe.reportedDate
            ).toLocaleString()}</p>
            <a href="/help-request/create/${newCatastrophe.id}" target="_blank">
              <button>Zgłoś Potrzebę Pomoc</button>
            </a>
          `);

        // Usuń tymczasowy marker i wyczyść zmienną
        map.value.removeLayer(newMarker.value);
        newMarker.value = null;
      } catch (error) {
        console.error("Error submitting catastrophe:", error);
      }
    };

    onMounted(() => {
      initializeMap();
      loadCatastrophes();
    });

    return {
      map,
    };
  },
};
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}
</style>
