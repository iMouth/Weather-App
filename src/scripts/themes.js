const themes = {};
getThemes();

function getThemes() {
  themes["Atmosphere"] = atmosphere();
  themes["Thunderstorm"] = thunderstorm();
  themes["Drizzle"] = drizzle();
  themes["Rain"] = rain();
  themes["Snow"] = snow();
  themes["Clear"] = clear();
  themes["Clouds"] = clouds();
  themes["Night"] = night();
}

function atmosphere() {
  return {
    gradient: "--atmosphere-grad",
    objectPos: "10% 50%",
    hue: "hue-rotate(180deg) saturate(700%) grayscale(70%)",
    imageSrc: "assets/" + "haze.jpg",
    imageAlt: "Image of Deer",
    iconSrc: "assets/" + "foggy.gif",
    iconAlt: "foggy clouds icon",
  };
}

function thunderstorm() {
  return {
    gradient: "--thunderstorm-grad",
    objectPos: "10% 50%",
    hue: "hue-rotate(180deg) saturate(750%) grayscale(45%)",
    imageSrc: "assets/" + "thunderstorm.jpg",
    imageAlt: "picture of thunderstorm",
    iconSrc: "assets/" + "storm.gif",
    iconAlt: "thunderstorm cloud icon",
  };
}
function drizzle() {
  return {
    gradient: "--drizzle-grad",
    objectPos: "50% 50%",
    hue: "hue-rotate(170deg) saturate(700%) grayscale(40%)",
    imageSrc: "assets/" + "rain-2.avif",
    imageAlt: "man walking in the rain on the road with umbrella",
    iconSrc: "assets/" + "drizzle.gif",
    iconAlt: "raining cloud icon",
  };
}
function rain() {
  return {
    gradient: "--rain-grad",
    objectPos: "50% 50%",
    hue: "hue-rotate(170deg) saturate(700%) grayscale(40%)",
    imageSrc: "assets/" + "rain.jpg",
    imageAlt: "man walking in the rain on the street with umbrella",
    iconSrc: "assets/" + "rain.gif",
    iconAlt: "raining clouds icon",
  };
}
function snow() {
  return {
    gradient: "--snow-grad",
    objectPos: "70% 50%",
    hue: "hue-rotate(180deg) saturate(400%) grayscale(70%)",
    imageSrc: "assets/" + "snow.jpg",
    imageAlt: "cabin in snowy area",
    iconSrc: "assets/" + "snow.gif",
    iconAlt: "snowy clouds icon",
  };
}

function clear() {
  return {
    gradient: "--clear-grad",
    objectPos: "100% 50%",
    hue: "hue-rotate(0deg) saturate(100%) grayscale(0%)",
    imageSrc: "assets/" + "road.jpg",
    imageAlt: "road and mountains",
    iconSrc: "assets/" + "sun.gif",
    iconAlt: "sun icon",
  };
}

function clouds() {
  return {
    gradient: "--cloudy-grad",
    objectPos: "50% 50%",
    hue: "hue-rotate(180deg) saturate(1000%) grayscale(80%)",
    imageSrc: "assets/" + "boardwalk.jpg",
    imageAlt: "boardwalk to the ocean",
    iconSrc: "assets/" + "clouds.gif",
    iconAlt: "clouds icon",
  };
}

function night() {
  return {
    gradient: "--night-grad",
    objectPos: "10% 50%",
    hue: "hue-rotate(180deg) saturate(700%) grayscale(30%)",
    imageSrc: "assets/" + "camp-fire.jpg",
    imageAlt: "picture of campfire",
    iconSrc: "assets/" + "night.gif",
    iconAlt: "moon icon",
  };
}

export default themes;
