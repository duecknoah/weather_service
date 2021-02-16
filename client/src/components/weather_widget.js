import React, { Component } from 'react';
import './weather_widget.css';

class WeatherWidget extends Component {
  constructor() {
    super();
    this.state = {

    }
  }

  componentDidMount() {
    fetch('/api/weather/current?city=Vancouver')
      .then(res => res.json())
      .then(weatherObj => this.setState(weatherObj, () => console.log(`Weather data.. ${JSON.stringify(weatherObj)}`)));
  }

  render() {
    return (
      <div>
        <h2>{this.state.city} Weather</h2>
        <p>{(this.state.temp - 273.15).toFixed(0)}°C | {this.state.description}</p>
      </div>
    );
  };
}

export default WeatherWidget;
