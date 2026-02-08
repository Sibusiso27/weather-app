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
        timeElement.textContent = `Local Time: ${currentTimeDate.toLocaleTimeString()}`;
    }, 1000);
}

function killTime()
{
    clearInterval(intervalCode)
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('weather-description').textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

    const currentTime = Math.floor(new Date().getTime() / 1000);
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;

    if (currentTime >= sunrise && currentTime < sunset) {
        // Daytime settings
        document.body.classList.remove('night-sky');
        document.body.style.background = "linear-gradient(to top left, #87CEEB, #00BFFF)";
        document.getElementById('div1').style.backgroundColor = '#fcdb03'; // Yellow sun
        document.querySelector('.container').style.color = '#000'; // Dark text
    } else {
        // Nighttime settings
        document.body.classList.add('night-sky');
        document.body.style.background = "linear-gradient(to bottom right, #0f3580, #000000)";
        document.getElementById('div1').style.backgroundColor = '#a9a9a9'; // Grey sun
        document.querySelector('.container').style.color = '#fff'; // White text
    }
}

