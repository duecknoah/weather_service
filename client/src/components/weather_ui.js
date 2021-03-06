import React, { Component } from 'react';
import AddCityForm from './add_city_form';
import './weather_ui.css';
import WeatherWidget from './weather_widget';
import originalFetch from 'isomorphic-fetch';
import fetch from 'fetch-retry';
fetch = fetch(originalFetch, {
  retries: 3,
  retryDelay: 1000,
});

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
      widgets: []
    };

    this.handleAddCity = this.handleAddCity.bind(this);
    this.addWidget = this.addWidget.bind(this);
  }

  // Gets raised from AddCityForm within this component when adding
  // a city/widget
  handleAddCity(event, value) {
    event.preventDefault();
     this.addWidget(value);
  }

  // Essentially append the new widget to the existing widgets in the state
  addWidget(city) {
    if (this.state.widgets.length >= 20) {
      alert("Max number of weather widgets is 20!");
      return;
    }
    // Verify the city is valid
    fetch(`/api/weather/validate?city=${city}`)
    .then(res => res.json())
    .then(json => {
      if (json.isValid) {
        this.setState({
          widgets: [...this.state.widgets, {id: this.state.widgets.length, city: city}]
        });
      } else {
        alert('Invalid city');
      }
    })
    .catch((err) => {
      // Fetch-retry makes it so if the request fails due to network reasons
      // it will retry. This catch is here just in case of any operational errors
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        {this.state.widgets.map(widget => <WeatherWidget key={widget.id} city={widget.city}/>)}
        <AddCityForm handleAddCity={this.handleAddCity} />
      </div>
    )
  }
}

export default WeatherUI;
