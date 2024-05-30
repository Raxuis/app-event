import Cookies from 'js-cookie';
import axios from 'axios';
import viewNav from '../views/nav';

class EventEditResources {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.init();
  }

  async init() {
    this.response = await this.getEventInfos(this.params);
    const sessionId = Cookies.get('PHP_SESSID');

    if (!sessionId) {
      this.userId = null;
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/auth/${sessionId}`);
      this.userId = response.data.user_id;
    } catch (e) {
      this.userId = null;
    }
    if (this.userId !== this.response.author_id) {
      window.location.href = '/my-events';
    }
    this.run();
  }

  async getEventInfos(eventId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/event/${eventId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  async render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto h-screen p-6 mt-4">
    Edit
    </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.navFunction();
  }
}

export default EventEditResources;
