import axios from 'axios';

export default async function getAll(table, userId = null) {
  if (userId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/${table}/${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
  try {
    const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/${table}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
