import './App.css';
import AddCityForm from './components/add_city_form';
import WeatherWidgets from './components/weather_widgets';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Service</h1>
      </header>
      <WeatherWidgets />
      <AddCityForm />
    </div>
  );
}

export default App;
