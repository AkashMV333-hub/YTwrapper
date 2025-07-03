import React, { useEffect, useState } from 'react';
import { channelCategories } from '../data/channelCategories';
import axios from 'axios';

const API_KEY = 'AIzaSyBEUjNUkuYf3OLyokSE4wP2Wa8mNxeVF8k';

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Parse ISO 8601 YouTube duration to seconds
const parseDurationToSeconds = (isoDuration) => {
  const match = isoDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || '0', 10);
  const seconds = parseInt(match?.[2] || '0', 10);
  return minutes * 60 + seconds;
};

const RecommendedVideos = ({ category }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const channelIds = channelCategories[category];
      const selectedChannels = getRandomItems(channelIds, Math.min(3, channelIds.length));

      const allVideos = [];

      // Step 1: Get recent videos from selected channels
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

      // Step 2: Get durations from `videos` endpoint
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

      // Step 3: Filter out Shorts (< 60s)
      const nonShortVideos = allVideos.filter(
        (vid) => durationMap[vid.id.videoId] >= 120
      );

      const randomVideos = getRandomItems(nonShortVideos, Math.min(15, nonShortVideos.length));
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
          const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

          return (
            <div
              key={videoId}
              className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
            >
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={thumbnailUrl}
                  alt={vid.snippet.title}
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => (e.target.src = fallbackUrl)}
                />
              </a>
              <p className="mt-2 p-2 text-md font-medium line-clamp-2">
                {vid.snippet.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedVideos;

