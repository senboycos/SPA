document.addEventListener("DOMContentLoaded", () => {
    const dataDiv = document.getElementById("data");

    // Initialisation de la carte avec Leaflet.js
    const map = L.map('map').setView([48.8566, 2.3522], 5); // Position par défaut : Paris

    // Ajouter une couche de tuiles (tiles) OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Événement de clic sur la carte
    map.on('click', async function(e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        let marker; // Déclare une variable pour le marqueur
        // Si un marqueur existe déjà, le supprimer
        if (marker) {
            map.removeLayer(marker);
        }

        // Ajouter un nouveau marqueur à l'emplacement cliqué
        marker = L.marker([lat, lon]).addTo(map);
        // Afficher les coordonnées dans la console
        console.log(`Coordonnées : ${lat}, ${lon}`);

        // Utilisation de l'API Nominatim pour obtenir le nom de la ville à partir des coordonnées
        const locationData = await getCityFromCoordinates(lat, lon);

        if (locationData) {
            // Récupérer et afficher la météo pour la ville
            const city = locationData.address.city || locationData.address.town || locationData.address.village;
            if (city) {
                getWeatherForCity(city);
            } else {
                dataDiv.innerHTML += "<p class='error'>Impossible de trouver une ville pour ces coordonnées.</p>";
            }

            // Afficher les détails du lieu
            displayLocationInfo(locationData);
        } else {
            dataDiv.innerHTML = "<p class='error'>Impossible de trouver une localisation pour ces coordonnées.</p>";
        }
    });

    // Fonction pour obtenir la ville à partir des coordonnées (API Nominatim)
    async function getCityFromCoordinates(lat, lon) {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;

        try {
            const response = await fetch(nominatimUrl);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des données Nominatim", error);
            return null;
        }
    }

    // Fonction pour afficher les informations du lieu
    function displayLocationInfo(locationData) {
        const displayName = locationData.display_name;
        const lat = locationData.lat;
        const lon = locationData.lon;

        const locationHTML = `
            <h2>Détails du lieu</h2>
            <p><strong>Nom du lieu :</strong> ${displayName}</p>
            <p><strong>Latitude :</strong> ${lat}</p>
            <p><strong>Longitude :</strong> ${lon}</p>
        `;

        dataDiv.innerHTML += locationHTML; // Ajouter les détails du lieu à l'élément dataDiv
    }

    // Fonction pour obtenir la météo à partir du nom de la ville (API prévision-meteo.ch)
    async function getWeatherForCity(city) {
        const apiUrl = `https://www.prevision-meteo.ch/services/json/${city}`;
        
        try {
            // Afficher un indicateur de chargement
            dataDiv.innerHTML += "<p>Chargement des données météo...</p>";

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Ville introuvable");
            }

            const weatherData = await response.json();
            displayWeatherData(weatherData);
        } catch (error) {
            dataDiv.innerHTML += `<p class='error'>Erreur: ${error.message}</p>`;
        }
    }

    // Fonction pour afficher les données météo
    function displayWeatherData(data) {
        if (!data || !data.city_info) {
            dataDiv.innerHTML += "<p class='error'>Données introuvables pour cette ville.</p>";
            return;
        }

        const { name } = data.city_info;
        const current = data.current_condition;

        const weatherHTML = `
            <h2>Météo pour ${name}</h2>
            <img src="${current.icon_big}" alt="${current.condition}">
            <p><strong>Condition actuelle:</strong> ${current.condition}</p>
            <p><strong>Température:</strong> ${current.tmp}°C</p>
            <p><strong>Humidité:</strong> ${current.humidity}%</p>
            <p><strong>Vent:</strong> ${current.wnd_spd} km/h (${current.wnd_dir})</p>
        `;

        dataDiv.innerHTML += weatherHTML; // Ajouter les données météo à l'élément dataDiv
    }
});
