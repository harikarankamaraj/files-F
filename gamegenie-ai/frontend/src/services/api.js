import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const getGames = async (params = {}) => {
  const response = await api.get('/games', { params });
  return response.data;
};

export const getGameById = async (id) => {
  const response = await api.get(`/games/${id}`);
  return response.data;
};

export const getSimilarGames = async (id) => {
  const response = await api.get(`/similar-games/${id}`);
  return response.data;
};

export const getRecommendations = async (prompt, filters = null) => {
  const response = await api.post('/recommend', {
    prompt,
    user_id: 'default_user',
    filters,
  });
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get('/favorites', {
    params: { user_id: 'default_user' },
  });
  return response.data;
};

export const addFavorite = async (gameId) => {
  const response = await api.post('/favorites', {
    game_id: gameId,
    user_id: 'default_user',
  });
  return response.data;
};

export const removeFavorite = async (gameId) => {
  const response = await api.delete(`/favorites/${gameId}`, {
    params: { user_id: 'default_user' },
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history', {
    params: { user_id: 'default_user' },
  });
  return response.data;
};

export const getPreferences = async () => {
  const response = await api.get('/preferences', {
    params: { user_id: 'default_user' },
  });
  return response.data;
};

export const savePreferences = async (prefData) => {
  const response = await api.post('/preferences', prefData, {
    params: { user_id: 'default_user' },
  });
  return response.data;
};

export const generateGame = async (prompt, similarGameId = null) => {
  const response = await api.post('/generate-game', {
    prompt,
    user_id: 'default_user',
    similar_game_id: similarGameId,
  });
  return response.data;
};

export const getGeneratedGames = async () => {
  const response = await api.get('/generated-games', {
    params: { user_id: 'default_user' },
  });
  return response.data;
};

export const getGeneratedGameById = async (id) => {
  const response = await api.get(`/generated-games/${id}`);
  return response.data;
};

export default api;
