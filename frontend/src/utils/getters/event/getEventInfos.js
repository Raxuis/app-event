import axios from 'axios';

export default async function getEventInfos(eventId) {
  try {
    const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/event/${eventId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
