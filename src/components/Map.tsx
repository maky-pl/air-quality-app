import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import AirQualityDetails from './AirQualityDetails'; // Import the new component
import './AirQualityDetails.css'; // Import CSS for responsiveness

interface MapProps {
  radius: number; // radius passed as a prop from parent
}

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

// Default marker icon for the map
const defaultIcon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map: React.FC<MapProps> = ({ radius }) => {
  const [position, setPosition] = useState<[number, number] | null>(null); // User's current location
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null); // Air quality data from API

  // Fetch the user's current position on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchAirQualityData(latitude, longitude); // Call to fetch air quality data based on location
      });
    }
  }, []);

  // Function to fetch air quality data from API
  const fetchAirQualityData = (latitude: number, longitude: number) => {
    const token = 'd0bada0a40f736ba0aa94ceec3dd85ee0151879b';
    const apiUrl = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${token}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setAirQualityData(data.data); // Set the fetched air quality data
        }
      })
      .catch((error) => {
        console.error('Error fetching air quality data:', error);
      });
  };

  return (
    <div className="app-container">
      {/* Left Column for Air Quality Details */}
      <div className="left-column">
        <AirQualityDetails data={airQualityData} />
      </div>

      {/* Right Column for Map */}
      <div className="right-column">
        {position ? (
          <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            {/* Tile layer for OpenStreetMap */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marker for the user's current position */}
            <Marker position={position} icon={defaultIcon}>
              <Popup>
                <div>
                  <h3>Your Location</h3>
                  {airQualityData ? (
                    <>
                      <p><strong>AQI:</strong> {airQualityData.aqi}</p>
                      <p><strong>Dominant Pollutant:</strong> {airQualityData.dominentpol.toUpperCase()}</p>
                    </>
                  ) : (
                    <p>Loading air quality data...</p>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Circle with 5km radius */}
            <Circle
              center={position}
              radius={5000} // Fixed 5km radius
              pathOptions={{ color: 'blue', fillOpacity: 0.2 }}
            />
          </MapContainer>
        ) : (
          <p>Loading your location...</p>
        )}
      </div>
    </div>
  );
};

export default Map;
