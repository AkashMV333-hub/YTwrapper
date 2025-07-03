// src/components/CategorySelector.jsx
import React from 'react';
import { channelCategories } from '../data/channelCategories';

const CategorySelector = ({ onSelect }) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">What do you want to watch?</h1>
      <select
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
        className="border p-2 text-lg"
      >
        <option disabled value="">Select a category</option>
        {Object.keys(channelCategories).map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
