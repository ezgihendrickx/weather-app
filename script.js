let hereAPIKey = "ZT-3uBrLouekcar_GoPf-ujFLV8xoCFomG-ZSPbUbts";
let addressDetails = `https://geocode.search.hereapi.com/v1/geocode?q=Ghent&apiKey=${hereAPIKey}`;
//https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-geocode-brief.html
let latitude = 50;
let longitude = 50;
const FORECAST = document.getElementsByClassName("component__forecast-box")[0];

function getLocation(city) {
  fetch(
    `https://geocode.search.hereapi.com/v1/geocode?q=${city}&apiKey=${hereAPIKey}`
  )
    .then((items) => {
      return items.json();
    })
    .then(calcLonLat);
}

function calcLonLat(items) {
  latitude = items.items[0].position.lat;
  longitude = items.items[0].position.lng;
  locationName = items.items[0].title;
  getResults(latitude, longitude);
}

const api = {
  key: "254457a64f43903cef73c88f6d1f45fa",
  base: "https://api.openweathermap.org/data/2.5/",
};
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}
const searchbox = document.querySelector(".search");
let locationName = searchbox.value;
searchbox.addEventListener("keypress", setQuery);
window.onload = getResults(searchbox.value);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    FORECAST.innerHTML = "";
    getLocation(searchbox.value);
    // console.log(searchbox.value);
  }
}

function getResults(location) {
  console.log(latitude);
  fetch(
    `${api.base}onecall?lat=${latitude}&lon=${longitude}&exlude=hourly&units=metric&APPID=${api.key}`
  )
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
  //   console.log(weather);
  let city = document.querySelector(".location .city");
  //city.innerText = `${weather.name}, ${weather.sys.country}`;
  city.innerText = locationName;

  let now = new Date();
  console.log(now);
  let date = document.querySelector(".location .date");
  date.innerText = dateBuilder(now);

  let temp = document.querySelector(".current .temp");
  console.log(temp);
  temp.innerHTML = `${Math.round(weather.current.temp)}<span>°c</span>`;

  let weather_el = document.querySelector(".current .weather");
  weather_el.innerText = weather.current.weather[0].main;
  let hilow = document.querySelector(".hi-low");

  hilow.innerText =
    "feels like " + Math.round(weather.current.feels_like) + "°c";

  weather.daily.forEach((day) => {
    console.log(day);
    let date = new Date(day.dt * 1000);
    let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    let name = days[date.getDay()];
    let dayBlock = document.createElement("div");
    dayBlock.className = "forecast__item";
    dayBlock.innerHTML = `<div class="forecast-item__heading">${name}</div>
        <div class="forecast-item__info"><i class="wi ${applyIcon(
          day.weather[0].icon
        )}"></i> <span class="degrees">${Math.round(
      day.temp.day
    )}<i class="wi wi-degrees"></i></span></div>`;
    FORECAST.appendChild(dayBlock);
  });
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "june",
    "July",
    "August",
    "September",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function applyIcon(icon) {
  let selectedIcon;
  switch (icon) {
    case "01d":
      selectedIcon = "wi-day-sunny";
      break;
    case "01n":
      selectedIcon = "wi-night-clear";
      break;
    case "02d":
    case "02n":
      selectedIcon = "wi-cloudy";
      break;
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      selectedIcon = "wi-night-cloudy";
      break;
    case "09d":
    case "09n":
      selectedIcon = "wi-showers";
      break;
    case "10d":
    case "10n":
      selectedIcon = "wi-rain";
      break;
    case "11d":
    case "11n":
      selectedIcon = "wi-thunderstorm";
      break;
    case "13d":
    case "13n":
      selectedIcon = "wi-snow";
      break;
    case "50d":
    case "50n":
      selectedIcon = "wi-fog";
      break;
    default:
      selectedIcon = "wi-meteor";
  }
  return selectedIcon;
}
