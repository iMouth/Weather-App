import "/src/styles/main.css";

const API_KEY = "a7384ac1b9096cc582d9e0c3d465f999";
const SEARCH_LIMIT = 10;

function getSearch(city) {
  const search = "http://api.openweathermap.org/geo/1.0/direct?q=" 
  + city + "&limit=" + SEARCH_LIMIT + "&appid=" + API_KEY;
  return search
}

async function getLocations(city) {
    let search = getSearch(city);
    try {
        let locationsCall = await fetch(search, {mode: 'cors'});
        let locationsJSON = await locationsCall.json();
        let locations = [];
        for (let location of locationsJSON) {
            let info = {
                city: location.name,
                state: location.state,
                country: location.country,
                logitude: location.lon,
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
    let city = "tucson" // TODO: get search from DOM
    let locations = await getLocations(city);
    // TODO: Display Locations to user

    cityClick(locations[0])
}

async function cityClick(city) {
    console.log(city);
}

searchClick();