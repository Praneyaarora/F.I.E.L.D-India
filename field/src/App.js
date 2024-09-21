import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
// import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Importing for Chart.js to work
import './App.css';

const App = () => {
  const [location, setLocation] = useState('Delhi');
  const [area, setArea] = useState(300);
  const [, setApiInterval] = useState(null);
  const [sensorData, setSensorData] = useState({});
  const [punjabWeatherData, setPunjabWeatherData] = useState(null); // New state for Punjab weather data
  const [haryanaWeatherData, setHaryanaWeatherData] = useState(null);
  const [delhiWeatherData, setDelhiWeatherData] = useState(null); // New state for Delhi weather data
  const [uttarPradeshWeatherData, setUttarPradeshWeatherData] = useState(null); // New state for UP weather data
  // const [selectedLocation] = useState('Punjab');
  // const [rainfallData, setRainfallData] = useState(0);
  // const [suggestedCrops, setSuggestedCrops] = useState('');



  const stateImages = {
    "Current Location": "/delhi.svg",
    "Haryana": "/haryana.svg",
    "Punjab": "/punjab.svg",
    "Delhi": "/delhi.svg",
    "Uttar Pradesh": "/up.svg",
  };

  const handleLocationChange = async (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);

    // If Punjab is selected, fetch the weather data
    if (selectedLocation === 'Punjab') {
      fetchPunjabWeatherData();
    }
  };

  const handleAreaChange = (e) => {
    setArea(parseInt(e.target.value));
  };

  const calculateYield = () => {
    return area * 10;
  };

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sensordata');
      const data = await response.json();
      console.log("Fetched Sensor Data:", data);

      if (data) {
        setSensorData(data);
      } else {
        console.error('Sensor data is not in expected format:', data);
        setSensorData({});
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setSensorData({});
    }
  };

  // const getRainfallForLocation = (location) => {
  //   switch (location) {
  //     case 'Punjab':
  //       return { rainfall: 886, crops: 'wheat or maize' };
  //     case 'Haryana':
  //       return { rainfall: 762, crops: 'barley or mustard' };
  //     case 'Uttar Pradesh':
  //       return { rainfall: 913, crops: 'rice or sugarcane' };
  //     case 'Current Location':
  //       return { rainfall: 800, crops: 'corn or sunflower' };
  //     default:
  //       return { rainfall: 0, crops: 'unknown' };
  //   }
  // };

  // // UseEffect to update rainfall and crops when the selected location changes
  // useEffect(() => {
  //   const data = getRainfallForLocation(selectedLocation);
  //   setRainfallData(data.rainfall);
  //   setSuggestedCrops(data.crops);
  // }, [selectedLocation]);
  

  const fetchPunjabWeatherData = async () => {
    try {
      const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/punjab/2024-09-21/2024-09-23?unitGroup=metric&include=current&key=9EXTKSSRDDHXVM7H8HMV8DA6Q&contentType=json');
      const data = await response.json();
      console.log("Fetched Punjab Weather Data:", data);

      if (data) {
        setPunjabWeatherData(data);
      } else {
        console.error('Punjab weather data is not in expected format:', data);
        setPunjabWeatherData(null);
      }
    } catch (error) {
      console.error('Error fetching Punjab weather data:', error);
      setPunjabWeatherData(null);
    }
  };

  const fetchHaryanaWeather = async () => {
    try {
      const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/haryana/2024-09-21/2024-09-23?unitGroup=metric&include=current&key=9EXTKSSRDDHXVM7H8HMV8DA6Q&contentType=json');
      const data = await response.json();
      setHaryanaWeatherData(data);
    } catch (error) {
      console.error('Error fetching Haryana weather data:', error);
    }
  };

  useEffect(() => {
    if (location === 'Haryana') {
      fetchHaryanaWeather();
    }
  }, [location]);

  const fetchDelhiWeather = async () => {
    try {
      const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/new%20delhi/2024-09-21/2024-09-23?unitGroup=metric&include=current&key=9EXTKSSRDDHXVM7H8HMV8DA6Q&contentType=json');
      const data = await response.json();
      setDelhiWeatherData(data);
    } catch (error) {
      console.error('Error fetching Delhi weather data:', error);
    }
  };

  useEffect(() => {
    if (location === 'Delhi') {
      fetchDelhiWeather();
    }
  }, [location]);

  // Function to fetch Uttar Pradesh weather data
  const fetchUttarPradeshWeather = async () => {
    try {
      const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/uttar%20pradesh/2024-09-21/2024-09-23?unitGroup=metric&include=current&key=9EXTKSSRDDHXVM7H8HMV8DA6Q&contentType=json');
      const data = await response.json();
      setUttarPradeshWeatherData(data);
    } catch (error) {
      console.error('Error fetching Uttar Pradesh weather data:', error);
    }
  };

  useEffect(() => {
    if (location === 'Uttar Pradesh') {
      fetchUttarPradeshWeather();
    }
  }, [location]);

  const handleFetchData = () => {
    fetchSensorData();
  };

  useEffect(() => {
    const intervalId = setInterval(fetchSensorData, 5000);
    setApiInterval(intervalId);

    return () => clearInterval(intervalId);
  }, []);

  // Data for temperature bar graph
  const temperatureBarData = {
    labels: ['DHT Temperature', 'Probe Temperature'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [sensorData.DHT_temperature, sensorData.probe_temperature],
        backgroundColor: ['#f39c12', '#e74c3c'],
        borderWidth: 1,
      },
    ],
  };

  // Options for the temperature bar graph
  const barOptions = {
    indexAxis: 'y', // Display bars horizontally
    scales: {
      x: { beginAtZero: true },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Data for soil moisture Pie chart
  const moisturePieData = {
    labels: ['Moisture Sensor 1', 'Moisture Sensor 2'],
    datasets: [
      {
        label: 'Soil Moisture',
        data: [sensorData.moisture1 || 0, sensorData.moisture2 || 0],
        backgroundColor: ['#3498db', '#1abc9c'],
        hoverBackgroundColor: ['#2980b9', '#16a085'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      {/* Fixed header with logo and title */}
      <header className="fixed-header">
        <img src="logo.png" alt="F.I.E.L.D Logo" className="logo" />
        <h1 className="field-title">F.I.E.L.D India</h1>
      </header>

      <div className="content">
        <h1>Smart Irrigation System</h1>
        <h2>Dashboard</h2>
        <div id="google_translate_element"></div>

        <h2>Location</h2>
        <div className="location-selection">
        <button
          className={`location-button ${location === 'Delhi' ? 'active' : ''}`}
          value="Delhi"
          onClick={handleLocationChange}
        >
          Current Location
        </button>
        <button
          className={`location-button ${location === 'Haryana' ? 'active' : ''}`}
          value="Haryana"
          onClick={handleLocationChange}
        >
          Haryana
        </button>
        <button
          className={`location-button ${location === 'Punjab' ? 'active' : ''}`}
          value="Punjab"
          onClick={handleLocationChange}
        >
          Punjab
        </button>
        <button
          className={`location-button ${location === 'Uttar Pradesh' ? 'active' : ''}`}
          value="Uttar Pradesh"
          onClick={handleLocationChange}
        >
          Uttar Pradesh
        </button>
      </div>

        <div className="location-details">
          <h3>{location}</h3>
          <img src={stateImages[location] || stateImages["Delhi"]} alt={`${location} Map`} className="location-map" />
          {/* <div className="average-rain">
            <h4>Average Rainfall for {selectedLocation}</h4>
            <span>{rainfallData} mm</span>
            <p>
              Your location, weather conditions, and soil are ideal for growing {suggestedCrops}.
            </p>
          </div> */}

          {/* Punjab Weather Data */}
          {location === 'Punjab' && punjabWeatherData && (
            <div className="punjab-weather">
              <h3>Punjab Weather Forecast</h3>
              <table>
                <thead>
                  <tr>
                    <th>Condition</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Current Temperature</td>
                    <td>{punjabWeatherData.currentConditions.temp}°C</td>
                  </tr>
                  <tr>
                    <td>Weather Description</td>
                    <td>{punjabWeatherData.currentConditions.conditions}</td>
                  </tr>
                  <tr>
                    <td>Humidity</td>
                    <td>{punjabWeatherData.currentConditions.humidity}%</td>
                  </tr>
                  <tr>
                    <td>Wind Speed</td>
                    <td>{punjabWeatherData.currentConditions.windspeed} km/h</td>
                  </tr>
                </tbody>
              </table>

              <h4>Next 2 Days Forecast</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Max Temp (°C)</th>
                    <th>Min Temp (°C)</th>
                    <th>Conditions</th>
                  </tr>
                </thead>
                <tbody>
                  {punjabWeatherData.days.slice(1, 3).map((day, index) => (
                    <tr key={index}>
                      <td>{day.datetime}</td>
                      <td>{day.tempmax}°C</td>
                      <td>{day.tempmin}°C</td>
                      <td>{day.conditions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Haryana Weather Data */}
        {location === 'Haryana' && haryanaWeatherData && (
          <div className="haryana-weather">
            <h3>Haryana Weather Forecast</h3>
            <table>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current Temperature</td>
                  <td>{haryanaWeatherData.currentConditions.temp}°C</td>
                </tr>
                <tr>
                  <td>Weather Description</td>
                  <td>{haryanaWeatherData.currentConditions.conditions}</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td>{haryanaWeatherData.currentConditions.humidity}%</td>
                </tr>
                <tr>
                  <td>Wind Speed</td>
                  <td>{haryanaWeatherData.currentConditions.windspeed} km/h</td>
                </tr>
              </tbody>
            </table>

            <h4>Next 2 Days Forecast</h4>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Max Temp (°C)</th>
                  <th>Min Temp (°C)</th>
                  <th>Conditions</th>
                </tr>
              </thead>
              <tbody>
                {haryanaWeatherData.days.slice(1, 3).map((day, index) => (
                  <tr key={index}>
                    <td>{day.datetime}</td>
                    <td>{day.tempmax}°C</td>
                    <td>{day.tempmin}°C</td>
                    <td>{day.conditions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Delhi Weather Data */}
        {location === 'Delhi' && delhiWeatherData && (
          <div className="delhi-weather">
            <h3>Delhi Weather Forecast</h3>
            <table>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current Temperature</td>
                  <td>{delhiWeatherData.currentConditions.temp}°C</td>
                </tr>
                <tr>
                  <td>Weather Description</td>
                  <td>{delhiWeatherData.currentConditions.conditions}</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td>{delhiWeatherData.currentConditions.humidity}%</td>
                </tr>
                <tr>
                  <td>Wind Speed</td>
                  <td>{delhiWeatherData.currentConditions.windspeed} km/h</td>
                </tr>
              </tbody>
            </table>

            <h4>Next 2 Days Forecast</h4>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Max Temp (°C)</th>
                  <th>Min Temp (°C)</th>
                  <th>Conditions</th>
                </tr>
              </thead>
              <tbody>
                {delhiWeatherData.days.slice(1, 3).map((day, index) => (
                  <tr key={index}>
                    <td>{day.datetime}</td>
                    <td>{day.tempmax}°C</td>
                    <td>{day.tempmin}°C</td>
                    <td>{day.conditions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Uttar Pradesh Weather Data */}
        {location === 'Uttar Pradesh' && uttarPradeshWeatherData && (
          <div className="uttar-pradesh-weather">
            <h3>Uttar Pradesh Weather Forecast</h3>
            <table className="weather-table">
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current Temperature</td>
                  <td>{uttarPradeshWeatherData.currentConditions.temp}°C</td>
                </tr>
                <tr>
                  <td>Weather Description</td>
                  <td>{uttarPradeshWeatherData.currentConditions.conditions}</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td>{uttarPradeshWeatherData.currentConditions.humidity}%</td>
                </tr>
                <tr>
                  <td>Wind Speed</td>
                  <td>{uttarPradeshWeatherData.currentConditions.windspeed} km/h</td>
                </tr>
              </tbody>
            </table>

            <h4>Next 2 Days Forecast</h4>
            <table className="weather-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Max Temp (°C)</th>
                  <th>Min Temp (°C)</th>
                  <th>Conditions</th>
                </tr>
              </thead>
              <tbody>
                {uttarPradeshWeatherData.days.slice(1, 3).map((day, index) => (
                  <tr key={index}>
                    <td>{day.datetime}</td>
                    <td>{day.tempmax}°C</td>
                    <td>{day.tempmin}°C</td>
                    <td>{day.conditions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        </div>

        <h2>Area</h2>
        <div className="area-selection">
          <button className={`area-button ${area === 300 ? 'active' : ''}`} value="300" onClick={handleAreaChange}>300 Acre</button>
          <button className={`area-button ${area === 200 ? 'active' : ''}`} value="200" onClick={handleAreaChange}>200 Acre</button>
          <button className={`area-button ${area === 100 ? 'active' : ''}`} value="100" onClick={handleAreaChange}>100 Acre</button>
        </div>

        <div className="total-yield">
          <h2>Total Yield</h2>
          <div className="yield-value">
            <span>{calculateYield()} Acre</span>
          </div>
        </div>

        <div className="api-fetch">
          <button onClick={handleFetchData}>Fetch Sensor Data</button>
        </div>

        {/* Sensor Data Visualization */}
        <div className="sensor-data">
          <h2>Sensor Data</h2>
          {sensorData.DHT_temperature ? (
            <>
              <div className="sensor-item">
                <h3>Temperature</h3>
                <div style={{ height: '300px', width: '100%' }}>
                  <Bar data={temperatureBarData} options={barOptions} />
                </div>
              </div>

              <div className="sensor-item">
              <h3>Soil Moisture</h3>
              <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
                <Pie data={moisturePieData} options={pieOptions} />
              </div>
            </div>

              <div className="sensor-item">
                <p><strong>Pump Status:</strong> {sensorData.pump}</p>
              </div>
            </>
          ) : (
            <p>No sensor data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
