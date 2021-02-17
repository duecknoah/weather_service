const express = require('express');
const originalFetch = require('isomorphic-fetch');
const fetch = require('fetch-retry')(originalFetch, {
  retries: 3,
  retryDelay: 1000,
});
const cors = require('cors'); // allows us to access data from a different domain and serve that back to the front-end.
const path = require('path'); // for joining paths

const app = express();
const PORT = process.env.PORT || 5000;
const { API_KEY } = process.env;

if (API_KEY === undefined) {
  throw Error('Please set ENV variable API_KEY to your openweathermap API key');
}
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, (process.env.IS_DEV === '1') ? 'client/public' : 'client/build')));

/**
 * Gets current info of the desired city, see getCurrentWeather() for JSON format
 * query string parameter of city name to get the weather of the desired city.
 * Ex:
 * yourip:port/api/weather/current?city=CITY_NAME_HERE
 */
app.get('/api/weather/current', cors(), (req, res) => {
  const { city } = req.query;

  getCurrentWeather(city).then((json) => res.send(json));
});

/**
 * Gets hourly info of the desired city, see getHourlyWeather() for JSON format
 * query string parameter of city name to get the weather of the desired city.
 * Ex:
 * yourip:port/api/weather/hourly?city=CITY_NAME_HERE
 */
app.get('/api/weather/hourly', cors(), (req, res) => {
  const { city } = req.query;

  getHourlyWeather(city).then((json) => res.send(json));
});

/**
 * Returns a boolean value if the city query string is a valid city. Returned in a JSON
 * Object
 * Ex:
 * yourip:port/api/weather/validate?city=CITY_NAME_HERE
 */
app.get('/api/weather/validate', cors(), (req, res) => {
  const { city } = req.query;

  getCurrentWeather(city).then((json) => {
    // eslint-disable-next-line prefer-const
    let isValidJSON = {
      isValid: false,
    };
    if (json.code !== 200) {
      res.send(isValidJSON);
    } else {
      isValidJSON.isValid = true;
      res.send(isValidJSON);
    }
  });
});

/**
 * Makes an HTTP GET request to the openweathermap
 * API to get the current weather information as a JSON.
 *
 * @param {String} city The name of the city to fetch current weather.
 * @returns {Promise} JSON info of the current weather
 */
function getCurrentWeather(city) {
  return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    .then((res) => res.json())
    .then((json) => {
      // the incoming json response has more data than
      // we need: See https://openweathermap.org/current#JSON
      // We need to extract what we want from the json
      // and return the new modified JSON as the response.
      const newJSON = {
        code: json.cod,
      };
      if (json.cod !== 200) {
        return newJSON;
      }

      newJSON.city = json.name;
      newJSON.description = json.weather[0].description;
      newJSON.icon = json.weather[0].icon;
      newJSON.feels_like = json.main.feels_like;
      newJSON.temp = json.main.temp;

      return newJSON;
    })
    .catch((err) => {
      // Fetch-retry makes it so if the request fails due to network reasons
      // it will retry. This catch is here just in case of any operational errors
      console.error(err);
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
  return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${CNT_LIMIT}&appid=${API_KEY}`)
    .then((res) => res.json())
    .then((json) => {
      // the incoming json response has more data than
      // we need: See https://openweathermap.org/forecast5#JSON
      // We need to extract what we want from the json and
      // return the new modified JSON as the response.
      const newJSON = {
        code: json.cod,
      };

      // If the response code isn't ok, then no other info will exist in the
      // incoming JSON, so respond with just the error code
      if (json.cod !== '200') {
        return newJSON;
      }

      // For each hourly entry, extract what we need and map that into our new hourly array
      const hourlyArr = json.list.map((hourlyObj) => ({
        dt: hourlyObj.dt_txt,
        temp: hourlyObj.main.temp,
        description: hourlyObj.weather[0].description,
        icon: hourlyObj.weather[0].icon,
      }));

      newJSON.city = json.city.name;
      newJSON.hourly = hourlyArr;

      return newJSON;
    }).catch((err) => {
      // Fetch-retry makes it so if the request fails due to network reasons
      // it will retry. This catch is here just in case of any operational errors
      console.error(err);
    });
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// When running a build, express will redirect anything that isn't an API endpoint
// to the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, (process.env.IS_DEV === '1') ? '/client/public/index.html' : '/client/build/index.html'));
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});
