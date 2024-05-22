import axios from 'axios';
import viewNav from '../views/nav';
import viewEvent from '../views/eventPage';

class Event {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.isLogged = localStorage.getItem('isLogged');
    this.init();
  }

  async init() {
    this.response = await this.getEventInfos(this.params);
    if (parseInt(localStorage.getItem('id'), 10) !== this.response.user_id) {
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
    ${viewNav(this.isLogged)}
    <div class="container mx-auto flex flex-col items-center justify-center h-screen p-6">
      <p>${this.response.id}</p>
      ${viewEvent(this.response)}
    </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.navFunction();
  }
}

export default Event;
