// src/App.jsx
import React, { useState } from 'react';
import { channelCategories } from './data/channelCategories';
import CategorySelector from './components/CategorySelector';
import RecommendedVideos from './components/RecommendedVideos';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen m-10 md:p-4 bg-white">
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

