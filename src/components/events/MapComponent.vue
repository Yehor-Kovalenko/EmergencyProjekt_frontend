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

    const language = ref(localStorage.getItem('language') || 'pl');

    const translations = {
      pl: {
        reported: 'Zgłoszono',
        helpRequestBtn: 'Zgłoś Potrzebę Pomocy',
        catastrophePreviewBtn: 'Podgląd katastrofy',
        submitCatFormTitle: 'Typ Katastrofy:',
        submitCatFormButton: 'Zgłoś'
      },
      en: {
        reported: 'Reported',
        helpRequestBtn: 'Request Help',
        catastrophePreviewBtn: 'View Catastrophe',
        submitCatFormTitle: 'Type of Catastrophe:',
        submitCatFormButton: 'Submit'
      }
    };

    const initializeMap = () => {
      map.value = L.map("map").setView([52.2297, 21.0122], 13); // Warsaw coordinates

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.value);

      map.value.on("click", onMapClick);
    };

    const loadCatastrophes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/catastrophes");
        const data = await response.json();
        catastrophes.value = data;

        // Add markers for existing catastrophes
        data.forEach((catastrophe) => {
          const marker = L.marker([catastrophe.latitude, catastrophe.longitude])
            .addTo(map.value)
            .bindPopup(`
              <h3>${catastrophe.type}</h3>
              <p><strong>${translations[language.value].reported}:</strong> 
                ${new Date(catastrophe.reportedDate).toLocaleString()}</p>
              <a href="/help-request/create/${catastrophe.id}" target="_blank">
                <button>${translations[language.value].helpRequestBtn}</button>
              </a>
              <a href="/catastrophes/${catastrophe.id}" target="_blank">
                <button>${translations[language.value].catastrophePreviewBtn}</button>
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

      // Remove existing temporary marker, if any
      if (newMarker.value) {
        map.value.removeLayer(newMarker.value);
      }

      // Add new marker at the click location
      newMarker.value = L.marker([lat, lng], { draggable: true })
        .addTo(map.value)
        .bindPopup(
          `
          <form id="catastropheForm">
            <label for="type">${translations[language.value].submitCatFormTitle}</label><br />
            <textarea id="type" name="type" required></textarea><br />
            <button type="submit">${translations[language.value].submitCatFormButton}</button>
          </form>
        `
        )
        .openPopup();

      // Remove the marker if the popup is closed (by clicking the X)
      newMarker.value.on("popupclose", () => {
        if (newMarker.value) {
          map.value.removeLayer(newMarker.value);
          newMarker.value = null;
        }
      });

      // Handle form submission inside the popup
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

        // Add marker for newly reported catastrophe
        L.marker([newCatastrophe.latitude, newCatastrophe.longitude])
          .addTo(map.value)
          .bindPopup(`
            <h3>${newCatastrophe.type}</h3>
            <p><strong>${translations[language.value].reported}:</strong> 
              ${new Date(newCatastrophe.reportedDate).toLocaleString()}</p>
            <a href="/help-request/create/${newCatastrophe.id}" target="_blank">
              <button>${translations[language.value].helpRequestBtn}</button>
            </a>
            <a href="/catastrophes/${newCatastrophe.id}" target="_blank">
              <button>${translations[language.value].catastrophePreviewBtn}</button>
            </a>
          `);

        // Remove the temporary marker
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
      language,
      translations
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
