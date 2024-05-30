import Cookies from 'js-cookie';
import axios from 'axios';
import viewNav from '../views/nav';
import viewCheckRessources from '../views/eventCheckResourcesPage';
import renderToastr from '../utils/toastr/renderToastr';

class EventCheckResources {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.init();
  }

  async init() {
    try {
      this.response = await this.getEventResourcesInfos(this.params);
      const sessionId = Cookies.get('PHP_SESSID');

      if (!sessionId) {
        this.userId = null;
        return;
      }

      const response = await axios.get(`http://localhost:8080/auth/${sessionId}`);
      this.userId = response.data.user_id;

      if (this.userId !== this.response.event_author_id) {
        window.location.href = '/my-events';
      } else {
        this.run();
      }
    } catch (e) {
      renderToastr('error', 'Error during initialization:', e.message);
    }
  }

  async getEventResourcesInfos(eventId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/resources/${eventId}`);
      return response.data;
    } catch (error) {
      renderToastr('error', 'Error fetching event resources:', error.message);
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

  attachEventListeners() {
    const goBackButton = document.querySelector('.go-back-check');
    if (goBackButton) {
      goBackButton.addEventListener('click', () => this.goBackToMore(this.params));
    }
  }

  resourcesEventListeners(resources) {
    const resourceArray = Array.isArray(resources) ? resources : [resources];
    resourceArray.forEach((resource) => {
      const deleteButton = document.querySelector(`.delete-${resource.resource_id}`);
      const rowResource = document.querySelector(`.row-${resource.resource_id}`);

      if (deleteButton) {
        deleteButton.addEventListener('click', () => this.deleteEventResource(resource.resource_id, rowResource));
      }
    });
  }

  goBackToMore(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=more&eventId=${eventId}`);
      window.location.reload();
    }
  }

  async deleteEventResource(eventResourceId, rowResource) {
    try {
      await axios.delete(`http://localhost:${process.env.BACKEND_PORT}/resource/${eventResourceId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      rowResource.remove();
      renderToastr('success', 'Success', 'Resource deleted successfully');
    } catch (error) {
      renderToastr('error', 'Error deleting resource:', error.message);
    }
  }

  async render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto h-screen p-6 mt-4">
      <div class="flex flex-wrap gap-4">
        <div class="flex-shrink-0">
          <button type="button" class="go-back-check flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
      </div>
      <div class="w-full mx-auto flex flex-col items-center justify-center">
        ${viewCheckRessources(this.response)}
      </div>
    </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.attachEventListeners();
    this.resourcesEventListeners(this.response);
    this.navFunction();
  }
}

export default EventCheckResources;
