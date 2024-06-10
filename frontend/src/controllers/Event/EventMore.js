import viewNav from '../../views/components/nav';
import viewEvent from '../../views/eventMore/eventMorePage';
import EventAllocateResources from '../EventResource/EventAllocateResource';
import EventEditResources from '../EventResource/EventEditResource';
import EventCheckResources from '../EventResource/EventCheckResources';
import getById from '../../utils/getters/getById';
import navFunction from '../../utils/navbar/navFunction';
import getUserId from '../../utils/getters/getUserId';

class EventMore {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.init();
  }

  async init() {
    this.response = await getById('event', this.params);
    this.userId = await getUserId();

    let userExists = false;

    this.response.guests.forEach((guest) => {
      if (guest.guest_id === this.userId) {
        userExists = true;
      }
    });

    if (userExists) {
      this.run();
    } else {
      window.location.href = '/my-events';
    }
  }

  async render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto h-screen p-6 mt-4">
    <div class="flex flex-wrap gap-4 max-sm:hidden">
        <div class="flex-shrink-0">
          <button type="button" onclick="window.location.href='/my-events'" class="flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
      </div>
      <div class="w-full mx-auto flex flex-col items-center justify-center">
        ${viewEvent(this.response, this.userId)}
        <div class="flex-shrink-0 max-sm:flex w-full sm:hidden m-4">
          <button type="button" onclick="window.location.href='/my-events'" class="w-full sm:hidden flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
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
    if (this.response && this.userId) {
      this.el.innerHTML = await this.render();
      navFunction();
      this.attachEventListeners();
    } else {
      this.el.innerHTML = '<p>Error loading event details.</p>';
    }
  }

  attachEventListeners() {
    const allocateButton = document.querySelector('.allocate-resources');
    const checkButton = document.querySelector('.check-resources');
    const editButton = document.querySelector('.edit-resources');

    if (allocateButton) {
      allocateButton.addEventListener('click', () => this.allocateResources(this.params));
    }
    if (checkButton) {
      checkButton.addEventListener('click', () => this.checkResources(this.params));
    }
    if (editButton) {
      editButton.addEventListener('click', () => this.editResources(this.params));
    }
  }

  allocateResources(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=allocate-resources&eventId=${eventId}`);
    }
    new EventAllocateResources(eventId);
  }

  checkResources(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=check-resources&eventId=${eventId}`);
    }
    new EventCheckResources(eventId);
  }

  editResources(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=edit-resources&eventId=${eventId}`);
    }
    new EventEditResources(eventId);
  }
}

export default EventMore;
