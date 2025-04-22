// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchVolatilityData = async (symbol, startDate, endDate) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/volatility`, {
      symbol,
      start_date: startDate,
      end_date: endDate
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch volatility data');
  }
};

export const fetchEstimatorInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/estimator-info`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch estimator info');
  }
};