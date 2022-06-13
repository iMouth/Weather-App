import "/src/styles/main.css";

const API_KEY = "a7384ac1b9096cc582d9e0c3d465f999";
const SEARCH_LIMIT = 10;

function getSearchLocations(city) {
  return "http://api.openweathermap.org/geo/1.0/direct?q=" 
        + city + "&limit=" + SEARCH_LIMIT + "&appid=" + API_KEY;
}

async function getLocations(city) {
    let search = getSearchLocations(city);
    try {
        let locationsCall = await fetch(search, {mode: 'cors'});
        let locationsJSON = await locationsCall.json();
        let locations = [];
        for (let location of locationsJSON) {
            let info = {
                city: location.name,
                state: location.state,
                country: location.country,
                longitude: location.lon,
                latitude: location.lat
            };
            locations.push(info);
        }
        return locations
    }
    catch (err) {
        console.log(err);
    }
}


async function searchClick() {
    let city = "seoul" // TODO: get search from DOM
    let locations = await getLocations(city);
    // TODO: Display Locations to user
    let cityInfo = await cityClick(locations[0]);
    console.log(cityInfo);
}

function getSearchCity(city) {
    return "https://api.openweathermap.org/data/2.5/weather?" + "lat=" + city.latitude 
    + "&lon=" + city.longitude + "&units=imperial" + "&appid=" + API_KEY;
}

async function cityClick(city) {
    // TOOD: Get city from a global locations array
    let search = getSearchCity(city);
    try {
        let cityCall = await fetch(search, {mode: 'cors'});
        let cityJSON = await cityCall.json();
        console.log(cityJSON);
        let info = {
            name: cityJSON.name,
            temp: cityJSON.main.temp,
            tempMax: cityJSON.main.temp_max,
            tempMin: cityJSON.main.temp_min,
            humidity: cityJSON.main.humidity,
            tempFeel: cityJSON.main.feels_like,
            windSpeed: cityJSON.wind.speed,
            weather: cityJSON.weather[0].main,
            weatherDesc: cityJSON.weather[0].description,
            weatherIcon: cityJSON.weather[0].icon,
        }
        return info;
    }
    catch (err) {
        console.log(err)
    }
}

searchClick();