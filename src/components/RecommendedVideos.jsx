// src/components/RecommendedVideos.jsx
import React, { useEffect, useState } from 'react';
import { channelCategories } from '../data/channelCategories';
import axios from 'axios';

const API_KEY = 'AIzaSyBEUjNUkuYf3OLyokSE4wP2Wa8mNxeVF8k';

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const RecommendedVideos = ({ category }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const channelIds = channelCategories[category];
      const selectedChannels = getRandomItems(channelIds, Math.min(3, channelIds.length));

      const allVideos = [];

      for (const id of selectedChannels) {
        try {
          const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              key: API_KEY,
              channelId: id,
              part: 'snippet',
              order: 'date',
              maxResults: 5,
              type: 'video',
            },
          });

          allVideos.push(...res.data.items);
        } catch (err) {
          console.error(`Error fetching for channel ${id}:`, err);
        }
      }

      const randomVideos = getRandomItems(allVideos, Math.min(6, allVideos.length));
      setVideos(randomVideos);
    };

    fetchVideos();
  }, [category]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Recommended for You</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((vid) => {
          const videoId = vid.id.videoId;
          const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

          return (
            <a
              key={videoId}
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded overflow-hidden shadow"
            >
              <img
                src={thumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-48 object-cover"
                onError={(e) =>
                  (e.target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
                }
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedVideos;
