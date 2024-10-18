document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("button");
    const input = document.querySelector("input");
    const dataDiv = document.getElementById("data");

    // Gestion du clic sur le bouton "afficher"
    button.addEventListener("click", async () => {
        const city = input.value.trim(); // On récupère la valeur de l'input

        if (city === "") {
            dataDiv.innerHTML = "<p style='color: red;'>Veuillez entrer une ville.</p>";
            return;
        }

        // URL de l'API de prevision-meteo.ch avec le nom de la ville
        const apiUrl = `https://www.prevision-meteo.ch/services/json/${city}`;

        try {
            // Fetch des données météo
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Ville introuvable");
            }

            const weatherData = await response.json();

            // Affichage des données dans le div
            displayWeatherData(weatherData);
        } catch (error) {
            dataDiv.innerHTML = `<p style='color: red;'>Erreur: ${error.message}</p>`;
        }
    });

    // Fonction pour afficher les données météo
    function displayWeatherData(data) {
        if (!data || !data.city_info) {
            dataDiv.innerHTML = "<p style='color: red;'>Données introuvables pour cette ville.</p>";
            return;
        }

        const { name } = data.city_info;
        const current = data.current_condition;

        const weatherHTML = `
            <h2>Météo pour ${name}</h2>
            <p><strong>Condition actuelle:</strong> ${current.condition}</p>
            <p><strong>Température:</strong> ${current.tmp}°C</p>
            <p><strong>Humidité:</strong> ${current.humidity}%</p>
            <p><strong>Vent:</strong> ${current.wnd_spd} km/h (${current.wnd_dir})</p>
        `;

        dataDiv.innerHTML = weatherHTML;
    }
});
