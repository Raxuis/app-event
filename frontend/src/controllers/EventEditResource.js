import Cookies from 'js-cookie';
import axios from 'axios';
import viewNav from '../views/nav';
import viewEditResource from '../views/eventEditResourcePage';

class EventEditResources {
  constructor() {
    this.el = document.querySelector('#root');
    this.params = this.getParams();
    this.init();
  }

  getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      eventId: urlParams.get('eventId'),
      resourceId: urlParams.get('resourceId')
    };
  }

  async init() {
    this.eventInfos = await this.getEventInfos(this.params.eventId);
    this.resourceInfos = await this.getResourceInfos(this.params.resourceId);
    const sessionId = Cookies.get('PHP_SESSID');

    if (!sessionId) {
      this.userId = null;
      return;
    }

    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/auth/${sessionId}`);
      this.userId = response.data.user_id;
    } catch (e) {
      this.userId = null;
    }
    if (this.userId !== this.eventInfos.author_id) {
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

  async getResourceInfos(resourceId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/resource/${resourceId}`);
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
    <div class="container mx-auto max-sm:h-full">
    ${viewEditResource()}
    </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.navFunction();
  }
}

export default EventEditResources;
