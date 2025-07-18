// src/App.jsx
import React, { useState } from 'react';
import { channelCategories } from './data/channelCategories';
import CategorySelector from './components/CategorySelector';
import RecommendedVideos from './components/RecommendedVideos';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen md:p-4 bg-green-200">
      {!selectedCategory ? (
        <CategorySelector onSelect={setSelectedCategory} />
      ) : (
        <>
          <RecommendedVideos category={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </>
      )}
    </div>
  );
};

export default App;

