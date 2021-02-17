import React, { Component } from 'react';
import WeatherWidget from './weather_widget';

class WeatherWidgets extends Component {
  state = {
    widgets: [
      {id: 0, city: 'Vancouver'},
      {id: 1, city: 'Tokyo'},
    ]
  };

  render() {
    return (
      <div>
        {this.state.widgets.map(widget => <WeatherWidget key={widget.id} city={widget.city}/>)}
      </div>
    )
  }
}

export default WeatherWidgets