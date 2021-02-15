const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
let CONF_DATA;

/**
 * Loads the config.json file which stores data needed to start our app
 *
 * FORMAT:
 * {
 *  'API_KEY': 'YOUR_API_KEY_HERE'
 * }
 */
const data = fs.readFileSync('./config.json');

try {
  CONF_DATA = JSON.parse(data);
  console.dir(CONF_DATA);
  app.listen(CONF_DATA.LISTEN_PORT, () => console.log(`Listening on port ${CONF_DATA.LISTEN_PORT}`));
} catch (err) {
  console.log('There has been an error parsing the config.json file.');
  console.log(err);
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

/**
 * Gets current info of the desired city, see getCurrentWeather() for JSON format
 * query string parameter of city name to get the weather of the desired city.
 * Ex:
 * yourip:port/api/weather/current?city=CITY_NAME_HERE
 */
app.get('/api/weather/current', (req, res) => {
  const { city } = req.query;

  getCurrentWeather(city).then((json) => res.send(json));
});

/**
 * Gets hourly info of the desired city, see getHourlyWeather() for JSON format
 * query string parameter of city name to get the weather of the desired city.
 * Ex:
 * yourip:port/api/weather/hourly?city=CITY_NAME_HERE
 */
app.get('/api/weather/hourly', (req, res) => {
  const { city } = req.query;

  getHourlyWeather(city).then((json) => res.send(json));
});

/**
 * Makes an HTTP GET request to the openweathermap
 * API to get the current weather information as a JSON.
 *
 * @param {String} city The name of the city to fetch current weather.
 * @returns {Promise} JSON info of the current weather
 */
function getCurrentWeather(city) {
  return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${CONF_DATA.API_KEY}`)
    .then((res) => res.json())
    .then((json) => {
      // the incoming json response has more data than
      // we need: See https://openweathermap.org/current#JSON
      // We need to extract what we want from the json
      // and return the new modified JSON as the response.
      const newJSON = {
        cod: json.cod,
      };
      if (json.cod !== 200) {
        return newJSON;
      }

      newJSON.cod = json.cod;
      newJSON.city = json.name;
      newJSON.description = json.weather[0].description;
      newJSON.icon = json.weather[0].icon;
      newJSON.feels_like = json.main.feels_like;
      newJSON.temp = json.main.temp;

      return Promise.resolve(newJSON);
    });
}

/**
 * Makes an HTTP GET request to the openweathermap
 * API to get every 3 hours of weather information as a JSON.
 *
 * @param {String} city The name of the city to fetch current weather.
 * @returns {Promise} JSON info of the current weather
 */
function getHourlyWeather(city) {
  const CNT_LIMIT = 3; // limits how many entries of 3 hours we recieve
  return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${CNT_LIMIT}&appid=${CONF_DATA.API_KEY}`)
    .then((res) => res.json())
    .then((json) => {
      // the incoming json response has more data than
      // we need: See https://openweathermap.org/forecast5#JSON
      // We need to extract what we want from the json and
      // return the new modified JSON as the response.
      const newJSON = {
        cod: json.cod,
      };
      if (json.cod !== '200') {
        return newJSON;
      }

      // For each hourly entry, extract what we need and map that into our new hourly array
      const hourlyArr = json.list.map((hourlyObj) => ({
        dt: hourlyObj.dt,
        temp: hourlyObj.main.temp,
        description: hourlyObj.weather[0].description,
        icon: hourlyObj.weather[0].icon,
      }));

      newJSON.cod = json.cod;
      newJSON.city = json.city.name;
      newJSON.hourly = hourlyArr;

      return Promise.resolve(newJSON);
    });
}
