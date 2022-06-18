import "/src/styles/main.css";
import themeObject from "/src/scripts/themes.js";
import "/src/styles/style.css";
import "/src/styles/reset.css";
import "/src/styles/weather.css";
import "/src/styles/location.css";

const API_KEY = "a7384ac1b9096cc582d9e0c3d465f999";
const SEARCH_LIMIT = 10;
let timeoutDateTime;

const themes = themeObject;
const units = {
  temp: "fahrenheit",
  speed: "mph",
};

document.getElementById("search").addEventListener("keypress", searchClick);

let cityInfo = {};
let finalLocations = {};

function getSearchLocations(city) {
  return (
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=" +
    SEARCH_LIMIT +
    "&appid=" +
    API_KEY
  );
}

async function getLocations(city) {
  let search = getSearchLocations(city);
  try {
    let locationsCall = await fetch(search, { mode: "cors" });
    let locationsJSON = await locationsCall.json();
    let locations = [];
    for (let location of locationsJSON) {
      let info = {
        city: location.name,
        state: location.state,
        country: location.country,
        longitude: location.lon,
        latitude: location.lat,
      };
      locations.push(info);
    }
    return locations;
  } catch (err) {
    console.log("Error: " + err.message);
  }
}

function buildPlaceString(place) {
  let retStr = place.city;
  if (place.state) {
    retStr += ", " + place.state;
  }
  retStr += ", " + place.country;
  return retStr;
}

async function searchClick(e) {
  if (e.key === "Enter") {
    const city = document.getElementById("search").value;
    let locations = await getLocations(city);
    if (locations.length > 0) {
      showResults(locations);
    }
  }
}

function showResults(locations) {
  let loc = [];
  locations.forEach((place) => {
    const placeStr = buildPlaceString(place);
    if (!loc.includes(placeStr)) {
      finalLocations[placeStr] = place;
      loc.push(placeStr);
    }
  });

  const results = document.querySelector(".search-results");
  loc.forEach((place) => {
    let p = document.createElement("p");
    p.addEventListener("click", cityClick);
    p.textContent = place;
    results.appendChild(p);
  });
  results.style.display = "block";
  document.querySelector(".toggles").style.opacity = "0";
}

async function setWeatherTheme(weather) {
  switch (weather) {
    case "Clouds":
      setTheme(themes["Clouds"]);
      break;
    case "Rain":
      setTheme(themes["Rain"]);
      break;
    case "Drizzle":
      setTheme(themes["Drizzle"]);
      break;
    case "Clear":
      setTheme(themes["Clear"]);
      if (cityInfo.hour >= 18 || cityInfo.hour <= 6) {
        setTheme(themes["Night"]);
      } else {
        setTheme(themes["Clear"]);
      }
      break;
    case "Snow":
      setTheme(themes["Snow"]);
      break;
    case "Thunderstorm":
      setTheme(themes["Thunderstorm"]);
      break;
    default:
      setTheme(themes["Atmosphere"]);
      break;
  }
}

async function setTheme(info) {
  const root = document.querySelector(":root");
  const containerImage = document.querySelector(".container");
  const dividerBot = document.querySelector(".divider-bot");
  const dividerTop = document.querySelector(".divider-top");
  const style = getComputedStyle(root).getPropertyValue(info.gradient);
  const toggles = document.querySelectorAll(".toggles input");
  dividerBot.style.backgroundImage = style;
  dividerTop.style.backgroundImage = style;
  containerImage.style.backgroundImage = style;
  toggles.forEach((toggle) => (toggle.style.backgroundImage = style));

  const weatherImage = document.getElementById("weather-img");
  weatherImage.src = info.imageSrc;
  weatherImage.alt = info.imageAlt;
  weatherImage.style.objectPosition = info.objectPos;

  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.src = info.iconSrc;
  weatherIcon.alt = info.iconAlt;

  const hue = document.querySelectorAll(".info-holder img");
  hue.forEach((img) => (img.style.filter = info.hue));
}

async function setWeatherInfo(info) {
  document.getElementById("weather-desc").textContent = info.weatherDesc;
  document.getElementById("temperature").textContent = Math.round(info.temp);
  document.getElementById("temp-low").textContent = Math.round(info.tempMin);
  document.getElementById("temp-high").textContent = Math.round(info.tempMax);
  document.getElementById("feel-like").textContent = Math.round(info.tempFeel);
  document.getElementById("humidity").textContent = Math.round(info.humidity);
  document.getElementById("persipitation").textContent = Math.round(info.persipitation * 100);
  document.getElementById("wind-speed").textContent = Math.round(info.windSpeed);

  const temp = info.tempFeel;
  const tempIcon = document.querySelector(".feel-img img");
  if (temp >= 89.6) {
    tempIcon.src = "assets/hot.gif";
  } else if (temp <= 59) {
    tempIcon.src = "assets/cold.gif";
  } else {
    tempIcon.src = "assets/temperature.gif";
  }
}

function getSearchCity(city) {
  return (
    "https://api.openweathermap.org/data/2.5/onecall?" +
    "lat=" +
    city.latitude +
    "&lon=" +
    city.longitude +
    "&units=imperial" +
    "&exclude=minutely,alerts" +
    "&appid=" +
    API_KEY
  );
}

async function setInitalLocation() {
  let search = await getSearchCity({
    latitude: 25.7742,
    longitude: -80.1936,
  });
  cityInfo = await getCityInfo(search);

  document.querySelector(".location p").textContent = "Miami, Florida, US";
  clearTimeout(timeoutDateTime);
  setDateTime(cityInfo.timezone);
  setWeatherInfo(cityInfo);
  setWeatherTheme(cityInfo.weather);
}

setInitalLocation();

async function cityClick(e) {
  const place = e.target.textContent;
  let search = await getSearchCity(finalLocations[place]);
  cityInfo = await getCityInfo(search);
  document.getElementById("search").value = "";
  document.querySelector(".location p").textContent = place;
  document.querySelectorAll(".search-results p").forEach((p) => p.remove());
  document.querySelector(".toggles").style.opacity = "1";

  clearTimeout(timeoutDateTime);
  setDateTime(cityInfo.timezone);
  console.log(cityInfo);
  setWeatherInfo(cityInfo);
  setWeatherTheme(cityInfo.weather);
}

async function getCityInfo(search) {
  try {
    let cityCall = await fetch(search, { mode: "cors" });
    let cityJSON = await cityCall.json();
    let info = {
      temp: cityJSON.current.temp,
      tempMax: cityJSON.daily[0].temp.max,
      tempMin: cityJSON.daily[0].temp.min,
      humidity: cityJSON.current.humidity,
      tempFeel: cityJSON.current.feels_like,
      windSpeed: cityJSON.current.wind_speed,
      weather: cityJSON.current.weather[0].main,
      weatherDesc: cityJSON.current.weather[0].description,
      timezone: cityJSON.timezone_offset,
    };
    const hour = getDateTime(info.timezone).getHours();
    info.persipitation = cityJSON.hourly[hour].pop;
    info.hour = hour;
    return info;
  } catch (err) {
    console.log("Error: " + err.message);
  }
}

// Date Changes

function setDateTime(timezone) {
  const date = document.querySelector(".date p");
  const time = document.querySelector(".time p");
  date.textContent = getDateTime(timezone).toLocaleString("en", { dateStyle: "full" });
  time.textContent = getDateTime(timezone).toLocaleString("en", { timeStyle: "medium" });
  timeoutDateTime = setTimeout(setDateTime, 1000, timezone);
}

function getDateTime(timezone) {
  const date = new Date();
  const time = date.getTime();
  const utc = time + date.getTimezoneOffset() * 60000;
  const localTime = utc + timezone * 1000;
  return new Date(localTime);
}

// Temperature and Speed Changes

async function changeTempUnit() {
  if (units.temp === "fahrenheit") {
    tempUnit("°C", "assets/celsius.gif", "celcius");
  } else if (units.temp === "celcius") {
    tempUnit("°F", "assets/fahrenheit.gif", "fahrenheit");
  } else {
    console.log("temperature not C or F");
  }
}

function tempUnit(unit, src, unitFull) {
  const tempVars = document.querySelectorAll(".temp-unit");
  const tempIcon = document.querySelector(".temp-main img");
  const temperature = document.getElementById("temperature");
  const tempLow = document.getElementById("temp-low");
  const tempHigh = document.getElementById("temp-high");
  const tempFeel = document.getElementById("feel-like");
  const toggleName = document.querySelector(".temp-toggle label");

  tempVars.forEach((tempVar) => (tempVar.textContent = unit));
  tempIcon.src = src;

  if (unitFull === "fahrenheit") {
    temperature.textContent = Math.round(cityInfo.temp);
    tempLow.textContent = Math.round(cityInfo.tempMin);
    tempHigh.textContent = Math.round(cityInfo.tempMax);
    tempFeel.textContent = Math.round(cityInfo.tempFeel);
    toggleName.textContent = "Fahrenheit";
  } else if (unitFull === "celcius") {
    temperature.textContent = Math.round(convertToC(cityInfo.temp));
    tempLow.textContent = Math.round(convertToC(cityInfo.tempMin));
    tempHigh.textContent = Math.round(convertToC(cityInfo.tempMax));
    tempFeel.textContent = Math.round(convertToC(cityInfo.tempFeel));
    toggleName.textContent = "Celcius";
  } else {
    console.log("unitFull not celcius or farenheit");
  }
  units.temp = unitFull;
}

function convertToC(farenheit) {
  return Math.round((farenheit - 32) * (5 / 9) * 10) / 10;
}

async function changeSpeedUnit() {
  const speedUnit = document.querySelector(".speed-unit");
  const toggleName = document.querySelector(".speed-toggle label");
  const speed = document.getElementById("wind-speed");
  if (units.speed === "mph") {
    speedUnit.textContent = "km/h";
    units.speed = "km/h";
    toggleName.textContent = "Kilometers";
    speed.textContent = Math.round(convertToKmh(cityInfo.windSpeed));
  } else if (units.speed === "km/h") {
    speedUnit.textContent = "mph";
    units.speed = "mph";
    toggleName.textContent = "Miles";
    speed.textContent = Math.round(cityInfo.windSpeed);
  } else {
    console.log("Speed unit incorrect");
  }
}

function convertToKmh(miles) {
  return miles * 1.609344;
}

document.querySelector(".temp-toggle input").addEventListener("change", changeTempUnit);
document.querySelector(".speed-toggle input").addEventListener("change", changeSpeedUnit);
