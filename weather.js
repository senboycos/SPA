document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("button");
    const input = document.querySelector("input");
    const dataDiv = document.getElementById("data");

    button.addEventListener("click", async () => {
        const city = input.value.trim();

        if (city === "") {
            dataDiv.innerHTML = "<p class='error'>Veuillez entrer une ville.</p>";
            return;
        }

        // Affichage du message de chargement
        dataDiv.innerHTML = "<p>Chargement des données météo...</p>";

        const apiUrl = `https://www.prevision-meteo.ch/services/json/${city}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Ville introuvable");
            }

            const weatherData = await response.json();
            displayWeatherData(weatherData);
        } catch (error) {
            dataDiv.innerHTML = `<p class='error'>Erreur: ${error.message}</p>`;
        }
    });

    function displayWeatherData(data) {
        if (!data || !data.city_info) {
            dataDiv.innerHTML = "<p class='error'>Données introuvables pour cette ville.</p>";
            return;
        }

        const { name } = data.city_info;
        const current = data.current_condition;

        const weatherHTML = `
            <h2>Météo pour ${name}</h2>
            <img src="${current.icon}" alt="${current.condition}">
            <p><strong>Condition actuelle:</strong> ${current.condition}</p>
            <p><strong>Température:</strong> ${current.tmp}°C</p>
            <p><strong>Humidité:</strong> ${current.humidity}%</p>
            <p><strong>Vent:</strong> ${current.wnd_spd} km/h (${current.wnd_dir})</p>
        `;

        dataDiv.innerHTML = weatherHTML;
    }
});
