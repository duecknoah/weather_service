import React, { Component } from 'react';
import AddCityForm from './add_city_form';
import './weather_ui.css';
import WeatherWidgets from './weather_widgets';

/**
 * A form consisting of a text box and add button to add new weather widgets.
 * Since forms have some internal state in the DOM, we want to make it a controlled
 * component.
 *
 * This means making the React state a 'single source of truth' and combining the two.
 */
class WeatherUI extends Component {

  constructor(props) {
    super(props);

    this.state = {
      widgets: undefined,
    };

    this.handleAddCity = this.handleAddCity.bind(this);
  }

  // Gets raised from AddCityForm within this component when adding
  // a city/widget
  handleAddCity(event) {
    event.preventDefault();
    console.log(event);
  }

  render() {
    return (
      <div>
        {
          <AddCityForm onAdd={this.handleAddCity} />
        }
      </div>
    )
  }
}

export default WeatherUI;
