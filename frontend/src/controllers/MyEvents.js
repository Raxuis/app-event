import axios from 'axios';
import viewNav from '../views/nav';
import viewAllModels from '../views/allModels';
import viewBuiltModel from '../views/builtModel';

class MyEvents {
  constructor() {
    this.el = document.querySelector('#root');
    this.initialize();
  }

  async initialize() {
    const elements = await this.getElements();
    if (elements !== null && elements.length > 0) {
      this.renderAllEvents(elements);
    } else {
      this.renderNoEvents();
    }
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  async getElements() {
    try {
      // TODO : Add /user_id after /events
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/events`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  renderAllEvents(elements) {
    const html = `
      ${viewNav()}
      <div class="max-w-6xl mx-auto px-4">
        ${viewAllModels(elements)}
        ${viewBuiltModel()}
      </div>
    `;
    this.el.innerHTML = html;
    this.navFunction();
  }

  renderNoEvents() {
    const html = `
      ${viewNav()}
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-3xl py-6">You don't have events.</p>
      </div>
    `;
    this.el.innerHTML = html;
  }
}

export default MyEvents;
