import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchUserData = async (token) => {
  const res = await axios.get(`${API_URL}/user/info`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const playGameAPI = async (userChoice, bid, token) => {
  const res = await axios.post(`${API_URL}/game/play`, { userChoice, bid }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const clearGameHistory = async (token) => {
  await axios.delete(`${API_URL}/game/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const transferFunds = async (type, amount, token) => {
  const res = await axios.post(`${API_URL}/user/${type}`, { amount: parseInt(amount) }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
