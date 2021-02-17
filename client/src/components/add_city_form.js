import React, { Component } from 'react';
import './add_city_form.css';

/**
 * A form consisting of a text box and add button to add new weather widgets.
 * Since forms have some internal state in the DOM, we want to make it a controlled
 * component.
 *
 * This means making the React state a 'single source of truth' and combining the two.
 */
class AddCityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  // Submit event is raised and handled in the parent WeatherUI component, see WeatherUI for more info
  render() {
    return (
      <form className="addCityForm" onSubmit={(event) => this.props.handleAddCity(event, this.state.value)}>
        <input className="addCityInput" type="text" placeholder="Vancouver" value={this.state.value} onChange={this.handleChange} />
        <input className="addCityButton" type="submit" value="Add City" />
      </form>
    )
  }
}

export default AddCityForm;
