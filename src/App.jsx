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
          <RecommendedVideos category={selectedCategory} />
          <div className='flex bg-green-200 vw-100 justify-center items-center'>
          <button
            onClick={() => setSelectedCategory(null)}
            className="m-5 px-8 py-4 bg-yellow-300 text-black text-lg rounded-lg"
          >
            Change Category
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default App;

