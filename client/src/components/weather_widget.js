import React, { Component } from 'react';
import './weather_widget.css';

class WeatherWidget extends Component {
  constructor() {
    super();
    this.state = {
      current: {},
      hourly: {}
    }
  }

  // When component is ready, we want to fetch the current and hourly weather data
  // and update our weather widget compnent with that data.
  // This goes through our proxy to hit our Express API.
  componentDidMount() {
    fetch('/api/weather/current?city=Vancouver')
      .then(res => res.json())
      .then(weatherObj => this.setState(
        {
          current: weatherObj,
          hourly: this.state.hourly
        }, () => console.log(`Current data.. ${JSON.stringify(weatherObj)}`)));
    fetch('/api/weather/hourly?city=Vancouver')
    .then(res => res.json())
    .then(weatherObj => this.setState(() => {
      return {
        current: this.state.current,
        hourly: weatherObj
      }
    }, () => console.log(`Hourly data.. ${JSON.stringify(weatherObj)}`)));
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

  renderHourlyWeather() {
    return <ul>{
      (this.state.hourly.hourly || []).map(hourObj =>
      <li key={hourObj.dt}>
        <div className="hourly_weather_time">{new Date(hourObj.dt).getHours()}</div>
        <div className="hourly_weather_icon"><img src={this.getWeatherIconURL(hourObj.icon)} alt={hourObj.description} /></div>
        <div className="hourly_weather_temp_box">{this.formatTemp(this.state.current.temp)}</div>
      </li>)
    }</ul>
  }

  render() {
    return (
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
            Upcoming Morning
          </div>
          {this.renderHourlyWeather()}
        </div>
      </div>
    );
  };
}

export default WeatherWidget;
