import React, { useEffect, useState } from 'react';
import { channelCategories } from '../data/channelCategories';
import axios from 'axios';

const API_KEY = 'AIzaSyBEUjNUkuYf3OLyokSE4wP2Wa8mNxeVF8k';

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const parseDurationToSeconds = (isoDuration) => {
  const match = isoDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || '0', 10);
  const seconds = parseInt(match?.[2] || '0', 10);
  return minutes * 60 + seconds;
};

const RecommendedVideos = ({ category }) => {
  const [videos, setVideos] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const fetchVideos = async (forceRefresh = false) => {
    const cacheKey = `recommended_${category}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached && !forceRefresh) {
      const parsed = JSON.parse(cached);
      setVideos(parsed.data);
      return;
    }

    const channelIds = channelCategories[category];
    const selectedChannels = getRandomItems(channelIds, Math.min(10, channelIds.length));
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

    const videoIds = allVideos.map((vid) => vid.id.videoId).filter(Boolean);
    const durationMap = {};

    try {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: API_KEY,
          id: videoIds.join(','),
          part: 'contentDetails',
          maxResults: 50,
        },
      });

      res.data.items.forEach((item) => {
        durationMap[item.id] = parseDurationToSeconds(item.contentDetails.duration);
      });
    } catch (err) {
      console.error('Error fetching durations:', err);
    }

    const nonShortVideos = allVideos.filter(
      (vid) => durationMap[vid.id.videoId] >= 60
    );

    const randomVideos = getRandomItems(nonShortVideos, Math.min(15, nonShortVideos.length));

    // Store in localStorage with timestamp
    localStorage.setItem(cacheKey, JSON.stringify({
      data: randomVideos,
      timestamp: Date.now(),
    }));

    setVideos(randomVideos);
  };

  useEffect(() => {
    fetchVideos(false);
  }, [category]);


  return (
    <div>
      <div className="grid md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((vid) => {
          const videoId = vid.id.videoId;
          const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
          const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

          return (
            <div
              key={videoId}
              className="bg-white shadow hover:shadow-lg transition pb-2.5"
              onClick={() => setPlayingVideoId(videoId)}
            >
              {playingVideoId === videoId ? (
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={vid.snippet.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded"
                />
              ) : (
                <img
                  src={thumbnailUrl}
                  alt={vid.snippet.title}
                  className="w-full h-55 object-cover cursor-pointer"
                  onError={(e) => (e.target.src = fallbackUrl)}
                />
              )}
              <p className="mt-1 p-2 text-md font-medium line-clamp-2">
                {vid.snippet.title}
              </p>
            </div>
          );
        })}
      </div>
      <div className='flex bg-green-200 vw-100 justify-center items-center'>
        <button
          onClick={() => setSelectedCategory(null)}
          className="m-5 px-8 py-4 bg-yellow-300 text-black text-lg rounded-lg"
         >
          Change Category
        </button>
        <button
          onClick={() => fetchVideos(true)}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "pointer"
          }}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default RecommendedVideos;


