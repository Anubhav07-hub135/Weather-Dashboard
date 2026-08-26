console.log("script.js loaded successfully");

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
const message = document.getElementById("message");

function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Light drizzle",
        53: "Drizzle",
        55: "Heavy drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Rain showers",
        82: "Heavy rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail"
    };

    return weatherCodes[code] || "Weather unavailable";
}

function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";

    if (
        code === 51 ||
        code === 53 ||
        code === 55 ||
        code === 61 ||
        code === 63 ||
        code === 65 ||
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return "🌧️";
    }

    if (code === 71 || code === 73 || code === 75) {
        return "❄️";
    }

    if (code === 95 || code === 96 || code === 99) {
        return "⛈️";
    }

    return "🌤️";
}

async function getWeather(city) {
    try {
        message.textContent = "Loading weather data...";
        message.className = "loading";

        searchBtn.disabled = true;

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            message.textContent =
                "City not found. Please check the spelling.";

            message.className = "error";
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        cityName.textContent =
            `${location.name}, ${location.country_code}`;


        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        
        description.textContent =
            getWeatherDescription(current.weather_code);

        
        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        
        windSpeed.textContent =
            `${current.wind_speed_10m.toFixed(1)} km/h`;

        
        const icon =
            getWeatherIcon(current.weather_code);

        weatherIcon.src = "";
        weatherIcon.alt = "";

        
        weatherIcon.style.display = "none";

        let emojiIcon =
            document.getElementById("emojiIcon");

        if (!emojiIcon) {
            emojiIcon = document.createElement("div");
            emojiIcon.id = "emojiIcon";

            weatherIcon.parentNode.insertBefore(
                emojiIcon,
                weatherIcon.nextSibling
            );
        }

        emojiIcon.textContent = icon;

        message.textContent = "";
        message.className = "";

    } catch (error) {
        console.error("Weather error:", error);

        message.textContent =
            "Something went wrong. Please try again.";

        message.className = "error";

    } finally {
        searchBtn.disabled = false;
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city !== "") {
        getWeather(city);
    } else {
        message.textContent =
            "Please enter a city name.";

        message.className = "error";
    }
});


cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});