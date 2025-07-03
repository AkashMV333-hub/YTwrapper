// src/App.jsx
import React, { useState } from 'react';
import { channelCategories } from './data/channelCategories';
import CategorySelector from './components/CategorySelector';
import RecommendedVideos from './components/RecommendedVideos';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {!selectedCategory ? (
        <CategorySelector onSelect={setSelectedCategory} />
      ) : (
        <>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Change Category
          </button>
          <RecommendedVideos category={selectedCategory} />
        </>
      )}
    </div>
  );
};

export default App;

