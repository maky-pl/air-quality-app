import React, { useState } from 'react';
import Map from './components/Map';
// import RadiusInput from './components/RadiusInput';

const App: React.FC = () => {
  const [radius, setRadius] = useState<number>(5000); // Default radius is 5 km

  // const handleRadiusChange = (newRadius: number) => {
  //   setRadius(newRadius);
  // };

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-md">
        {/* Radius input component */}
        {/* <RadiusInput onRadiusChange={handleRadiusChange} /> */}
      </div>

      <div className="w-full">
        {/* Map component that receives radius as a prop */}
        <Map radius={radius} />
      </div>
    </div>
  );
};

export default App;
