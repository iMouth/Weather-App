// Theme and Weather Info Changes

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
  document.getElementById("humidity").textContent = Math.round(info.humidity);
  document.getElementById("precipitation").textContent = Math.round(info.precipitation * 100);

  if (units.temp === "fahrenheit") {
    document.getElementById("temperature").textContent = Math.round(info.temp);
    document.getElementById("temp-low").textContent = Math.round(info.tempMin);
    document.getElementById("temp-high").textContent = Math.round(info.tempMax);
    document.getElementById("feel-like").textContent = Math.round(info.tempFeel);
  } else {
    document.getElementById("temperature").textContent = Math.round(convertToC(info.temp));
    document.getElementById("temp-low").textContent = Math.round(convertToC(info.tempMin));
    document.getElementById("temp-high").textContent = Math.round(convertToC(info.tempMax));
    document.getElementById("feel-like").textContent = Math.round(convertToC(info.tempFeel));
  }

  if (units.speed === "mph") {
    document.getElementById("wind-speed").textContent = Math.round(info.windSpeed);
  } else {
    document.getElementById("wind-speed").textContent = Math.round(convertToKmh(info.windSpeed));
  }

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

function showToggles() {
  document.getElementById("search").value = "";
  document.querySelectorAll(".search-results p").forEach((p) => p.remove());
  document.querySelector(".toggles").style.visibility = "visible";
}

// Display Search Results

function displayResults(loc, cityClick) {
  const results = document.querySelector(".search-results");
  loc.forEach((place) => {
    let p = document.createElement("p");
    p.addEventListener("click", cityClick);
    p.textContent = place;
    results.appendChild(p);
  });
  results.style.display = "block";
  document.querySelector(".toggles").style.visibility = "hidden";
}

// Tempature and Speed Changes

const units = {
  temp: "fahrenheit",
  speed: "mph",
};

async function changeTempUnit(cityInfo) {
  if (units.temp === "fahrenheit") {
    tempUnit("°C", "assets/celsius.gif", "celcius", cityInfo);
  } else if (units.temp === "celcius") {
    tempUnit("°F", "assets/fahrenheit.gif", "fahrenheit", cityInfo);
  } else {
    console.log("temperature not C or F");
  }
}

function tempUnit(unit, src, unitFull, cityInfo) {
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
    console.log("unit not celcius or farenheit");
  }
  units.temp = unitFull;
}

function convertToC(farenheit) {
  return Math.round((farenheit - 32) * (5 / 9) * 10) / 10;
}

async function changeSpeedUnit(cityInfo) {
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

// Sets Date and Time

let timeoutDateTime;

function setDateTime(timezone) {
  clearTimeout(timeoutDateTime);
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

export {
  setDateTime,
  setTheme,
  setWeatherInfo,
  changeSpeedUnit,
  changeTempUnit,
  displayResults,
  showToggles,
  getDateTime,
};
