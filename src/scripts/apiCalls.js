import { getDateTime } from "./dom";

const SEARCH_LIMIT = 10;

async function getCityInfo(search) {
  try {
    let cityCall = await fetch(search, { mode: "cors" });
    let cityJSON = await cityCall.json();
    console.log(cityJSON);
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

async function getCityName(search) {
  try {
    let cityCall = await fetch(search, { mode: "cors" });
    let cityJSON = await cityCall.json();
    let info = {
      city: cityJSON.name,
      country: cityJSON.sys.country,
    };
    return info;
  } catch (err) {
    console.log("Error: " + err.message);
  }
}

async function getLocations(city, key) {
  let search = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${SEARCH_LIMIT}&appid=${key}`;
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

export { getCityInfo, getCityName, getLocations };
