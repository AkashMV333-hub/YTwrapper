import React, { useEffect, useState } from 'react';
import { channelCategories } from '../data/channelCategories';
import axios from 'axios';

const API_KEY = 'AIzaSyBEUjNUkuYf3OLyokSE4wP2Wa8mNxeVF8k'; // Replace with your real key

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Convert ISO 8601 to seconds (e.g. PT3M20S → 200 seconds)
const parseDurationToSeconds = (isoDuration) => {
  const match = isoDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || '0', 10);
  const seconds = parseInt(match?.[2] || '0', 10);
  return minutes * 60 + seconds;
};

const RecommendedVideos = ({ category }) => {
  const [videos, setVideos] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);

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
          console.error(`Error fetching from ${id}`, err);
        }
      }

      const videoIds = allVideos.map((v) => v.id.videoId).filter(Boolean);

      let durations = {};
      try {
        const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            key: API_KEY,
            id: videoIds.join(','),
            part: 'contentDetails',
          },
        });

        res.data.items.forEach((item) => {
          durations[item.id] = parseDurationToSeconds(item.contentDetails.duration);
        });
      } catch (err) {
        console.error('Error fetching durations', err);
      }

      const filtered = allVideos.filter((v) => durations[v.id.videoId] >= 180);
      const selected = getRandomItems(filtered, Math.min(15, filtered.length));
      setVideos(selected);
    };

    fetchVideos();
  }, [category]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Recommended for You</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((vid) => {
          const videoId = vid.id.videoId;
          const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
          const fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

          return (
            <div
              key={videoId}
              className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
            >
              {playingVideoId === videoId ? (
                <iframe
                  width="100%"
                  height="200"
                  className="rounded"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={vid.snippet.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={thumbnail}
                  alt={vid.snippet.title}
                  className="w-full h-48 object-cover rounded cursor-pointer"
                  onClick={() => setPlayingVideoId(videoId)}
                  onError={(e) => (e.target.src = fallback)}
                />
              )}
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



