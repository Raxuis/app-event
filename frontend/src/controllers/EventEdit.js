import axios from 'axios';
import viewNav from '../views/nav';
import viewEvent from '../views/eventMorePage';

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
    <div class="container mx-auto h-screen p-6 mt-4">
    <div class="flex flex-wrap gap-4">
    <div class="flex-shrink-0">
          <button type="button" onclick="window.location.href='/my-events'" class="flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
        <div class="flex-grow text-center">
        <p>Edit :${this.response.id}</p>
        </div>
    </div>
    <div class="mx-auto flex flex-col items-center justify-center h-screen p-6">
    ${viewEvent(this.response)}
      </div>
    </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.navFunction();
  }
}

export default Event;
