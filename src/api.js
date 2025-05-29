
import axios from 'axios';

const API_URL = 'http://localhost:3001/photographers';

export const fetchPhotographers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
