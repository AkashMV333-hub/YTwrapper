// src/components/CategorySelector.jsx
import React from 'react';
import { channelCategories } from '../data/channelCategories';
import nature from '../assets/nature.png'
import film from '../assets/film.png'
import finance from '../assets/dollar.png'
import book from '../assets/book.png'
import coding from '../assets/coding.png'
import game from '../assets/game.png'

const CategorySelector = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center text-center bg-white pt-10 ">
      <h1 className="text-5xl font-bold mb-18">Select your category</h1>
      { /* <select
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
        className="border rounded-xl p-2 text-lg"
      >
        <option disabled value="">Select a category</option>
        {Object.keys(channelCategories).map((category) => (
          <option key={category} value={category}>{category}</option>
        ))} 
      </select>
       */}
      <div className='grid grid-rows-3 gap-6'>
        <div className='grid grid-cols-2 gap-6'>
          <div className='bg-amber-400 flex flex-col justify-center items-center w-[140px] h-[140px] rounded-xl overflow-hidden'
          onClick={() => onSelect(Travel)}
          >
            <img src={nature} alt="Nature" className='w-[60px] h-[60px] object-cover'/>
          </div>
          <div className='bg-blue-600 flex flex-col justify-center items-center w-[140px] h-[140px] rounded-xl overflow-hidden'
          onClick={() => onSelect(Movies)}
          >
            <img src={film} alt="film" className='w-[60px] h-[60px] object-cover'/>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='bg-green-300 flex flex-col justify-center items-center w-[140px] h-[140px] rounded-xl overflow-hidden'
          onClick={() => onSelect(Finance)}
          >
            <img src={finance} alt="Finance" className='w-[60px] h-[60px] object-cover'/>
          </div>
          <div className='bg-yellow-900 flex flex-col justify-center items-center w-[140px] h-[140px] rounded-xl overflow-hidden'
          onClick={() => onSelect(Coding)}
          >
            <img src={coding} alt="Coding" className='w-[60px] h-[60px] object-cover'/>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='bg-cyan-500 flex flex-col justify-center items-center w-[140px] h-[140px] rounded-xl overflow-hidden'
          onClick={() => onSelect(Information)}
          >
            <img src={book} alt="Book" className='w-[60px] h-[60px] object-cover'/>
          </div>
          <div className='bg-indigo-500 flex flex-col justify-center items-center w-[140px] h-[140px] rounded-xl overflow-hidden'
          onClick={() => onSelect(Game)}
          >
            <img src={game} alt="game" className='w-[60px] h-[60px] object-cover'/>
          </div>
        </div>
        </div>
    </div>
    
  );
};

export default CategorySelector;
