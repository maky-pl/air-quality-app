import React from 'react';
import './AirQualityDetails.css'; // Import the CSS file
import { Line } from 'react-chartjs-2'; // Import the Line chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AirQualityData {
  aqi: number;
  idx: number;
  attributions: Array<{ name: string; url: string; logo?: string }>;
  city: { name: string; geo: [number, number]; url: string };
  dominentpol: string;
  iaqi: { [key: string]: { v: number } };
  forecast: {
    daily: {
      o3: Array<{ avg: number; day: string; max: number; min: number }>;
      pm10: Array<{ avg: number; day: string; max: number; min: number }>;
      pm25: Array<{ avg: number; day: string; max: number; min: number }>;
      uvi: Array<{ avg: number; day: string; max: number; min: number }>;
    };
  };
  time: { s: string; tz: string; iso: string };
}

// Get the icon and color class based on AQI value
const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) {
    return { icon: '😊', label: 'Good', className: 'aqi-good' };
  } else if (aqi <= 100) {
    return { icon: '😐', label: 'Moderate', className: 'aqi-moderate' };
  } else if (aqi <= 150) {
    return { icon: '😷', label: 'Unhealthy for Sensitive Groups', className: 'aqi-unhealthy' };
  } else if (aqi <= 200) {
    return { icon: '😨', label: 'Unhealthy', className: 'aqi-very-unhealthy' };
  } else if (aqi <= 300) {
    return { icon: '😱', label: 'Very Unhealthy', className: 'aqi-hazardous' };
  } else {
    return { icon: '💀', label: 'Hazardous', className: 'aqi-hazardous' };
  }
};

// Function to generate chart data for O3, PM10, PM25, UVI
const generateChartData = (pollutantData: Array<{ day: string; avg: number; max: number; min: number }>, label: string) => {
  const labels = pollutantData.map((dayData) => dayData.day);
  const avgValues = pollutantData.map((dayData) => dayData.avg);
  const maxValues = pollutantData.map((dayData) => dayData.max);
  const minValues = pollutantData.map((dayData) => dayData.min);

  return {
    labels: labels,
    datasets: [
      {
        label: `Avg ${label}`,
        data: avgValues,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: `Max ${label}`,
        data: maxValues,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: `Min ${label}`,
        data: minValues,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };
};

// AirQualityDetails Component
const AirQualityDetails: React.FC<{ data: AirQualityData | null }> = ({ data }) => {
  if (!data) {
    return <div>Loading Air Quality Details...</div>;
  }

  // Extracting pollutants
  const pollutants = Object.entries(data.iaqi).map(([key, value]) => ({
    pollutant: key.toUpperCase(),
    value: value.v,
  }));

  const aqiStatus = getAQIStatus(data.aqi);

  // Generate the chart data for O3, PM10, PM25, UVI
  const ozoneChartData = generateChartData(data.forecast.daily.o3, 'Ozone (O3)');
  const pm10ChartData = generateChartData(data.forecast.daily.pm10, 'PM10');
  const pm25ChartData = generateChartData(data.forecast.daily.pm25, 'PM25');
  const uviChartData = generateChartData(data.forecast.daily.uvi, 'UV Index (UVI)');

  return (
    <div className="air-quality-container">
      <h3>Air Quality Data for {data.city.name}</h3>

      {/* AQI Section with Icon */}
      <div className={`aqi-section ${aqiStatus.className}`}>
        <span className="aqi-icon">{aqiStatus.icon}</span>
        <span><strong>AQI:</strong> {data.aqi} ({aqiStatus.label})</span>
      </div>

      <p><strong>Dominant Pollutant:</strong> {data.dominentpol.toUpperCase()}</p>

      {/* Pollutants section */}
      <h4>Pollutants</h4>
      <div className="pollutants-section">
        {pollutants.map((pollutant, index) => (
          <div key={index} className="pollutant-item">
            <strong>{pollutant.pollutant}:</strong>
            <span>{pollutant.value}</span>
          </div>
        ))}
      </div>

      {/* Forecast Section with Graphs */}
      <div className="forecast-section">
        <h4>Ozone (O3) Forecast</h4>
        <div className="chart-container">
          <Line data={ozoneChartData} />
        </div>

        <h4>PM10 Forecast</h4>
        <div className="chart-container">
          <Line data={pm10ChartData} />
        </div>

        <h4>PM25 Forecast</h4>
        <div className="chart-container">
          <Line data={pm25ChartData} />
        </div>

        <h4>UV Index (UVI) Forecast</h4>
        <div className="chart-container">
          <Line data={uviChartData} />
        </div>
      </div>

      {/* Attributions Section */}
      <div className="attributions-section">
        <h4>Attributions</h4>
        <ul>
          {data.attributions.map((attr, idx) => (
            <li key={idx}>
              <a href={attr.url} target="_blank" rel="noopener noreferrer">
                {attr.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="last-updated"><strong>Last Updated:</strong> {data.time.s} (Timezone: {data.time.tz})</p>
    </div>
  );
};

export default AirQualityDetails;

