import axios from 'axios';
import viewNav from '../../views/components/nav';
import viewCheckRessources from '../../views/eventResource/eventCheckResource/eventCheckResourcesPage';
import renderToastr from '../../utils/toastr/renderToastr';
import EventEditResources from './EventEditResource';
import goBack from '../../utils/navigation/goBack';
import navFunction from '../../utils/navbar/navFunction';
import getAll from '../../utils/getters/getAll';
import getUserId from '../../utils/getters/getUserId';
import getById from '../../utils/getters/getById';
import getParams from '../../utils/getters/getParams';

class EventCheckResources {
  constructor() {
    this.el = document.querySelector('#root');
    this.params = getParams();
    this.init();
  }

  async init() {
    try {
      this.userId = await getUserId();

      this.eventInfos = await getById('event', this.params.eventId);
      if (await this.checkEventResourcesLength() !== true) {
        goBack('more', this.params.eventId);
      }
      if (this.userId !== this.eventInfos.author_id) {
        window.location.href = '/my-events';
      } else {
        this.run();
      }
    } catch (e) {
      renderToastr('error', 'Error during initialization:', e.message);
    }
  }

  async checkEventResourcesLength() {
    this.response = await getAll('resources', this.params.eventId);
    return this.response && Object.keys(this.response).length > 0;
  }

  attachEventListeners() {
    const goBackButton = document.querySelectorAll('.go-back-check');
    if (goBackButton) {
      goBackButton.forEach(
        ((backButton) => {
          backButton.addEventListener('click', () => goBack('more', this.params.eventId));
        })
      );
    }
  }

  resourcesEventListeners(resources) {
    const resourceArray = Array.isArray(resources) ? resources : [resources];

    resourceArray.forEach((resource) => {
      const events = {
        [`delete-${resource.resource_id}`]: () => this.deleteEventResource(resource.resource_id),
        [`edit-${resource.resource_id}`]: () => this.editEventResource(resource.event_id, resource.resource_id),
        [`increment-${resource.event_resource_id}`]: () => this.incrementDecrementQuantity(resource.event_resource_id, 'plus'),
        [`decrement-${resource.event_resource_id}`]: () => this.incrementDecrementQuantity(resource.event_resource_id, 'minus')
      };

      Object.entries(events).forEach(([selector, handler]) => {
        const element = document.querySelector(`.${selector}`);
        if (element) {
          element.addEventListener('click', handler);
        }
      });
    });
  }

  async incrementDecrementQuantity(resource, action) {
    const data = {
      event_resource_id: resource,
      action
    };
    try {
      const response = await axios.put(`http://localhost:${process.env.BACKEND_PORT}/resourcequantityinteraction`, data);
      if (response.status === 200) {
        this.init();
      } else if (response.status === 400) {
        renderToastr('error', 'Error', response.data.message);
      }
    } catch (error) {
      renderToastr('error', 'Error', 'Failed to update quantity');
    }
  }

  async deleteEventResource(resourceId) {
    try {
      await axios.delete(`http://localhost:${process.env.BACKEND_PORT}/resource/${resourceId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      this.init();
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
      <div class="flex flex-wrap gap-4 max-sm:hidden">
        <div class="flex-shrink-0">
          <button type="button" class="flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100 go-back-check">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
      </div>
      <div class="w-full mx-auto flex flex-col items-center justify-center">
      ${viewCheckRessources(this.eventInfos, this.response)}
        <div class="flex-shrink-0 max-sm:flex w-full sm:hidden m-4">
          <button type="button" class="w-full sm:hidden flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100 go-back-check">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
      </div>
    </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.attachEventListeners();
    this.resourcesEventListeners(this.response);
    navFunction();
  }
}

export default EventCheckResources;
