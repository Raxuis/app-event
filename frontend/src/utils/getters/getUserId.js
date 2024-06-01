import axios from 'axios';
import Cookies from 'js-cookie';

export default async function getUserId() {
  const sessionId = Cookies.get('PHP_SESSID');

  if (!sessionId) {
    return null;
  }

  try {
    const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/auth/${sessionId}`);
    return response.data.user_id;
  } catch (e) {
    return null;
  }
}
