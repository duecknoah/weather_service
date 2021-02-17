import React, { Component } from 'react';
import './weather_widget.css';
import originalFetch from 'isomorphic-fetch';
import fetch from 'fetch-retry';
fetch = fetch(originalFetch, {
  retries: 3,
  retryDelay: 1000,
});
class WeatherWidget extends Component {
  state = {
    city: this.props.city || 'Vancouver', // default value
    current: {},
    hourly: {},
    isValid: true,
    hasLoaded: false,
  }

  // When component is ready, we want to fetch the current and hourly weather data
  // and update our weather widget compnent with that data.
  // This goes through our proxy to hit our Express API.
  componentDidMount() {
    const currentWeatherPromise = fetch(`/api/weather/current?city=${this.state.city}`)
    .then(res => res.json())
    .catch((err) => {
      // Fetch-retry makes it so if the request fails due to network reasons
      // it will retry. This catch is here just in case of any operational errors
      console.error(err);
    });

    const hourlyWeatherPromise = fetch(`/api/weather/hourly?city=${this.state.city}`)
    .then(res => res.json())
    .catch((err) => {
      // Fetch-retry makes it so if the request fails due to network reasons
      // it will retry. This catch is here just in case of any operational errors
      console.error(err);
    });

    // Wait for all of the data to come in before updating the state.
    Promise.all([currentWeatherPromise, hourlyWeatherPromise]).then((weatherData) => {
      this.setState({
        current: weatherData[0],
        hourly: weatherData[1],
        isValid: true,
        hasLoaded: true // Mark as all data loaded so we can render
      });
    });
  }

  // openweathermap has all of its icons on its website, the data fetched from the API
  // has only the icon name. We combine the two to get the raw URL
  getWeatherIconURL(icon) {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  // Truncates and converts Kelvin to Celcius, returns a string
  formatTemp(temp) {
    return `${(temp - 273.15).toFixed(0)} °C`;
  }

  // converts Date to the format:
  // H(am/pm)
  formatTime(date) {
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours ? hours : 12; // the hour 0 should be 12

    return hours + ampm;
  }

  // Renders the upcoming weather in 3 hours increments. Each display with
  // the time, weather icon, and temperature.
  renderHourlyWeather() {
    return <ul>{
      (this.state.hourly.hourly || []).map(hourObj =>
      <li key={hourObj.dt}>
        <div className="hourly_weather_time">{this.formatTime(new Date(hourObj.dt))}</div>
        <div className="hourly_weather_icon"><img src={this.getWeatherIconURL(hourObj.icon)} alt={hourObj.description} /></div>
        <div className="hourly_weather_temp_box">{this.formatTemp(this.state.current.temp)}</div>
      </li>)
    }</ul>
  }

  // Displays the entire weather widget, this includes current weather and hourly weather
  // for the city. Waits for data to be loaded before displaying
  render() {
    return this.state.hasLoaded ? (
      <div className="weather_box">
        <div className="current_weather_box">
          <div className="current_weather_city">{this.state.current.city}</div>
          <div className="current_weather_middle_box">
            <div className="current_weather_icon_box">
              <img src={this.getWeatherIconURL(this.state.current.icon)} alt={this.state.current.description} />
            </div>
            <div className="current_weather_temp_box">
              {this.formatTemp(this.state.current.temp)}
            </div>
          </div>
          <div className="current_weather_description_box">
            {this.state.current.description}
          </div>
        </div>
        <div className="hourly_weather_box">
          <div className="hourly_weather_time_greeting">
            Upcoming (UTC)
          </div>
          {this.renderHourlyWeather()}
        </div>
      </div>
    ) : <span>Loading Weather...</span>;
  };
}

export default WeatherWidget;
