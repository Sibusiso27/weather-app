const weatherEmojis = {
    clear: "☀️",
    clouds: "☁️",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
    fog: "🌫️",
    haze: "🌫️",
    smoke: "🌫️",
    dust: "🌪️",
    sand: "🌪️",
    ash: "🌋",
    squall: "💨",
    tornado: "🌪️"
};


document.getElementById('search-btn').addEventListener('click', () => {
    const location = document.getElementById('location').value;
    if (location) {
        killTime()
        fetchWeather(location);
        fetchTime(location);
    }

});

async function fetchWeather(location) {
    const apiKey = 'b6e14cfb3a8a7b39af414385e025cf08'; // OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            displayWeather(data);
            fetchTime(data.coord.lat, data.coord.lon); // Fetch time after getting weather data
        } else {
            alert('City not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function fetchTime(lat, lon) {
    const apiKey = 'FZSLH7ABKL0N'; // TimeZoneDB API key
    const apiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lon}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'OK') {
            displayTime(data.formatted);
        } else {
            console.error('Error fetching time data:', data.message);
        }
    } catch (error) {
        console.error('Error fetching time data:', error);
    }
}

let intervalCode = null;
function displayTime(currentTime) {
    const timeElement = document.getElementById('local-time');
    if (timeElement) {
        timeElement.textContent = `Local Time: ${currentTime}`;
    }
    else {
        const newTimeElement = document.createElement('p');
        newTimeElement.id = 'local-time';
        newTimeElement.textContent = `Local Time: ${currentTime}`;
        document.querySelector('.container').appendChild(newTimeElement);
    }
    let currentTimeDate = new Date(currentTime);
    intervalCode = setInterval(() => {
        currentTimeDate.setSeconds(currentTimeDate.getSeconds() + 1);
        timeElement.textContent = `◴ Local Time: ${currentTimeDate.toLocaleTimeString()}`;
    }, 1000);
}

function killTime()
{
    clearInterval(intervalCode)
}

function startRain() {
    const rainContainer = document.getElementById('rain-container');
    rainContainer.innerHTML = "";

    for (let i = 0; i < 80; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');

        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + "s";

        rainContainer.appendChild(drop);
    }
}

function stopRain() {
    const rainContainer = document.getElementById('rain-container');
    rainContainer.innerHTML = "";
}


function displayWeather(data) {
    const condition = data.weather[0].main.toLowerCase();
    const emoji = weatherEmojis[condition || "🌡️"];
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `🌡 ${data.main.temp}°C`;
    document.getElementById('weather-description').textContent = `⋆｡ﾟ☁︎｡⋆𓂃 ོ☼𓂃 Condition: ${data.weather[0].description}${emoji}`;
    document.getElementById('humidity').textContent = `｡˚○ Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `꩜ Wind Speed: ${data.wind.speed} m/s`;

    const currentTime = Math.floor(new Date().getTime() / 1000);
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;


    if (currentTime >= sunrise && currentTime < sunset) {
        // Daytime settings
        document.body.classList.remove('night-sky');
        document.body.style.backgroundImage = "url('dayTime.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
        document.querySelector('.container').style.color = '#000'; // Dark text
    } else {
        // Nighttime settings
        document.body.classList.add('night-sky');
        document.body.style.backgroundImage = "url('nightTime.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
        document.querySelector('.container').style.color = '#fff'; // White text
    }

    if (condition.includes("rain")){
        startRain();
    } else {
        stopRain();
    }
}

