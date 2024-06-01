import axios from 'axios';

export default async function getById(table, id) {
  try {
    const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/${table}/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
