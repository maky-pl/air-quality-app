import React, { useState } from 'react';

interface RadiusInputProps {
  onRadiusChange: (radius: number) => void;
}

const RadiusInput: React.FC<RadiusInputProps> = ({ onRadiusChange }) => {
  const [inputValue, setInputValue] = useState<number>(5000); // default radius is 5km

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setInputValue(value);
    onRadiusChange(value); // Call the parent's handler to pass the radius
  };

  return (
    <div className="mb-6">
      <label htmlFor="radius-input" className="block text-lg font-medium text-gray-700 mb-2">
        Enter radius in meters:
      </label>
      <input
        type="number"
        id="radius-input"
        value={inputValue}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        min={0}
        step={100}
        placeholder="Enter radius"
      />
    </div>
  );
};

export default RadiusInput;
