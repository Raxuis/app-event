import Cookies from 'js-cookie';
import axios from 'axios';
import viewNav from '../../views/components/nav';
import viewCheckRessources from '../../views/eventCheckResourcesPage';
import renderToastr from '../../utils/toastr/renderToastr';
import EventEditResources from './EventEditResource';
import goBack from '../../utils/navigation/goBack';

class EventCheckResources {
  constructor() {
    this.el = document.querySelector('#root');
    this.params = this.getParams();
    this.init();
  }

  getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      eventId: urlParams.get('eventId')
    };
  }

  async init() {
    try {
      this.response = await this.getEventResourcesInfos(this.params.eventId);
      const sessionId = Cookies.get('PHP_SESSID');

      if (!sessionId) {
        this.userId = null;
        return;
      }

      const authResponse = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/auth/${sessionId}`);
      this.userId = authResponse.data.user_id;

      this.eventInfos = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/event/${this.params.eventId}`);
      await this.checkEventResourcesLength();
      if (this.userId !== this.eventInfos.data.author_id) {
        window.location.href = '/my-events';
      } else {
        this.run();
      }
    } catch (e) {
      renderToastr('error', 'Error during initialization:', e.message);
    }
  }

  async checkEventResourcesLength(rowResource = null) {
    if (rowResource) {
      rowResource.remove();
      const resources = await this.getEventResourcesInfos(this.params.eventId);
      if (!resources || Object.keys(resources).length < 1) {
        goBack('more', this.params.eventId);
      }
    } else if (!this.response || Object.keys(this.response).length < 1) {
      goBack('more', this.params.eventId);
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
      goBackButton.addEventListener('click', () => goBack('more', this.params.eventId));
    }
  }

  resourcesEventListeners(resources) {
    const resourceArray = Array.isArray(resources) ? resources : [resources];
    resourceArray.forEach((resource) => {
      const deleteButton = document.querySelector(`.delete-${resource.resource_id}`);
      const editButton = document.querySelector(`.edit-${resource.resource_id}`);
      const rowResource = document.querySelector(`.row-${resource.event_resource_id}`);
      const incrementQuantityButton = document.querySelector(`.increment-${resource.event_resource_id}`);
      const decrementQuantityButton = document.querySelector(`.decrement-${resource.event_resource_id}`);

      if (deleteButton) {
        deleteButton.addEventListener('click', () => this.deleteEventResource(resource.resource_id, rowResource));
      }
      if (editButton) {
        editButton.addEventListener('click', () => this.editEventResource(resource.event_id, resource.resource_id));
      }
      if (incrementQuantityButton) {
        incrementQuantityButton.addEventListener('click', () => this.incrementDecrementQuantity(resource.event_resource_id, 'plus'));
      }
      if (decrementQuantityButton) {
        decrementQuantityButton.addEventListener('click', () => this.incrementDecrementQuantity(resource.event_resource_id, 'minus'));
      }
    });
  }

  async incrementDecrementQuantity(resource, action) {
    const datas = {
      event_resource_id: resource,
      action
    };
    try {
      const response = await axios.put(`http://localhost:${process.env.BACKEND_PORT}/resourcequantityinteraction`, datas);
      if (response.status === 200) {
        this.init();
      } else if (response.status === 400) {
        renderToastr('error', 'Error', response.data.message);
      }
    } catch (error) {
      renderToastr('error', 'Error', 'Failed to update quantity');
    }
  }

  async deleteEventResource(resourceId, rowResource) {
    try {
      await axios.delete(`http://localhost:${process.env.BACKEND_PORT}/resource/${resourceId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.checkEventResourcesLength(rowResource);
      renderToastr('success', 'Success', 'Resource deleted successfully');
    } catch (error) {
      renderToastr('error', 'Error deleting resource:', error.message);
    }
  }

  editEventResource(eventId, resourceId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId, resourceId }, '', `?action=edit-resources&eventId=${eventId}&resourceId=${resourceId}`);
    }
    new EventEditResources();
  }

  async render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto h-screen p-6 mt-4">
      <div class="flex flex-wrap gap-4">
        <div class="flex-shrink-0">
          <button type="button" class="go-back-check flex items-center justifycenter px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
      </div>
      <div class="w-full mx-auto flex flex-col items-center justify-center">
        ${viewCheckRessources(this.eventInfos.data, this.response)}
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