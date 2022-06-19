import "./styles/main.css";
import themeObject from "/src/scripts/themes.js";
import {
  setTheme,
  setWeatherInfo,
  changeSpeedUnit,
  changeTempUnit,
  displayResults,
  showToggles,
  setDateTime,
} from "./scripts/dom";
import { getCityInfo, getCityName, getLocations } from "./scripts/apiCalls";

const API_KEY = "a7384ac1b9096cc582d9e0c3d465f999";

const themes = themeObject;

let cityInfo = {};
let finalLocations = {};

document.querySelector(".temp-toggle input").addEventListener("change", (e) => {
  changeTempUnit(cityInfo);
});
document.querySelector(".speed-toggle input").addEventListener("change", (e) => {
  changeSpeedUnit(cityInfo);
});
document.getElementById("search").addEventListener("keypress", searchClick);

document.querySelector(".container").style.display = "none";

setCurrentLoctaion();

async function setCurrentLoctaion() {
  await setInitalLocation(
    {
      latitude: 25.7742,
      longitude: -80.1936,
    },
    "Miami, Flordia, US"
  );
  document.querySelector(".container").style.display = "flex";
  try {
    const coords = await getCoords();
    let searchName = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=a7384ac1b9096cc582d9e0c3d465f999`;
    let cityNameInfo = await getCityName(searchName);
    await setInitalLocation(coords, cityNameInfo.city + ", " + cityNameInfo.country);
  } catch (err) {
    console.log(err.message);
  }
}

async function setInitalLocation(coords, name) {
  let search = await getSearchCity(coords);
  cityInfo = await getCityInfo(search);
  document.querySelector(".location p").textContent = name;

  setDateTime(cityInfo.timezone);
  setWeatherInfo(cityInfo);
  setWeatherTheme(cityInfo.weather);
}

async function getCoords() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  return {
    longitude: pos.coords.longitude,
    latitude: pos.coords.latitude,
  };
}

window.addEventListener("click", (e) => {
  if (!document.querySelector(".search-results").contains(e.target)) {
    showToggles();
  }
});

async function searchClick(e) {
  if (e.key === "Enter") {
    document.querySelectorAll(".search-results p").forEach((p) => p.remove());
    const city = document.getElementById("search").value;
    let locations = await getLocations(city, API_KEY);
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
  displayResults(loc, cityClick);
}

function buildPlaceString(place) {
  let retStr = place.city;
  if (place.state) {
    retStr += ", " + place.state;
  }
  retStr += ", " + place.country;
  return retStr;
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

function getSearchCity(city) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${city.latitude}&lon=${city.longitude}&units=imperial&exclude=minutely,alerts&appid=${API_KEY}`;
}

async function cityClick(e) {
  const place = e.target.textContent;
  document.querySelector(".location p").textContent = place;

  let search = getSearchCity(finalLocations[place]);
  cityInfo = await getCityInfo(search);

  showToggles();
  setDateTime(cityInfo.timezone);
  setWeatherInfo(cityInfo);
  setWeatherTheme(cityInfo.weather);
}
