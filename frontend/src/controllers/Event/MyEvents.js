import axios from 'axios';
import Cookies from 'js-cookie';
import viewNav from '../../views/components/nav';
import viewEvents from '../../views/myEvents/events';
import EventMore from './EventMore';
import EventEdit from './EventEdit';
import renderToastr from '../../utils/toastr/renderToastr';
import EventAllocateResources from '../EventResource/EventAllocateResource';
import EventEditResources from '../EventResource/EventEditResource';
import EventCheckResources from '../EventResource/EventCheckResources';
import navFunction from '../../utils/navbar/navFunction';

class MyEvents {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.el = document.querySelector('#root');
      this.initialize();
      // 👇 This is to prevent issues when going back to the previous page
      window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const eventId = event.state?.eventId;
        const resourceId = event.state?.resourceId;

        if (action === 'more') {
          this.navigateToEventDetail(eventId, false);
        } else if (action === 'edit') {
          this.navigateToEventEdit(eventId, false);
        } else if (action === 'allocate-resources') {
          this.navigateToAllocateResources(eventId, false);
        } else if (action === 'check-resources') {
          this.navigateToCheckResources(eventId, false);
        } else if (action === 'edit-resources') {
          this.navigateToEditResources(eventId, resourceId, false);
        }
      });
    });
  }

  async initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const eventId = urlParams.get('eventId');
    const resourceId = urlParams.get('resourceId');
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

    if (eventId) {
      if (action === 'more') {
        this.navigateToEventDetail(eventId);
      } else if (action === 'edit') {
        this.navigateToEventEdit(eventId);
      } else if (action === 'allocate-resources') {
        this.navigateToAllocateResources(eventId);
      } else if (action === 'edit-resources') {
        this.navigateToEditResources(eventId, resourceId);
      } else if (action === 'check-resources') {
        this.navigateToCheckResources(eventId);
      }
    } else {
      const elements = await this.getElements();
      if (elements !== null && elements.length > 0) {
        this.renderAllEvents(elements);
      } else {
        this.renderNoEvents();
      }
    }
  }

  // 👇 Mapping guests from events
  verifSpecificGuests(elements) {
    const specificGuestsMap = {};
    elements.forEach((event) => {
      if (event.author_id !== this.userId && Array.isArray(event.guests)) {
        specificGuestsMap[event.event_id] = event.guests.filter(
          (guest) => guest.guest_id === this.userId
        );
      }
    });
    return specificGuestsMap;
  }

  async getElements() {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/events/${this.userId}`);
      return response.data;
    } catch (error) {
      renderToastr('error', 'Error', 'Error fetching elements.');
      return null;
    }
  }

  attachEventListeners(events) {
    events.forEach((event) => {
      const deleteButton = document.querySelector(`.delete-${event.event_id}`);
      const cardEvent = document.querySelector(`.card-${event.event_id}`);
      const readMoreButton = document.querySelector(`.read-more-${event.event_id}`);
      const editButton = document.querySelector(`.edit-${event.event_id}`);
      const acceptButton = document.querySelector(`.accept-${event.event_id}`);
      const declineButton = document.querySelector(`.decline-${event.event_id}`);
      const cancelButton = document.querySelector(`.cancel-${event.event_id}`);

      if (deleteButton) {
        deleteButton.addEventListener('click', () => this.deleteEvent(event.event_id, cardEvent));
      }
      if (readMoreButton) {
        readMoreButton.addEventListener('click', () => this.navigateToEventDetail(event.event_id));
      }
      if (editButton) {
        editButton.addEventListener('click', () => this.navigateToEventEdit(event.event_id));
      }
      if (acceptButton) {
        acceptButton.addEventListener('click', () => this.userInteraction(event.event_id, event.group_id, 'accepted'));
      }
      if (declineButton) {
        declineButton.addEventListener('click', () => this.userInteraction(event.event_id, event.group_id, 'registered'));
      }
      if (cancelButton) {
        cancelButton.addEventListener('click', () => this.userInteraction(event.event_id, event.group_id, 'canceled'));
      }
    });
  }

  async userInteraction(eventId, groupId, status) {
    try {
      const eventData = {
        user_id: this.userId,
        group_id: groupId,
        event_id: eventId,
        status
      };
      const response = await axios.put(`http://localhost:${process.env.BACKEND_PORT}/userinteraction`, eventData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        this.initialize();
      }
    } catch (error) {
      renderToastr('error', 'Error updating event:', error);
    }
  }

  async deleteEvent(eventId, cardEvent) {
    try {
      await axios.delete(`http://localhost:${process.env.BACKEND_PORT}/event/${eventId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      cardEvent.remove();
      return true;
    } catch (error) {
      renderToastr('error', 'Error deleting event:', error);
      return false;
    }
  }

  async renderAllEvents(elements) {
    const html = `
    ${viewNav(this.userId)}
      <div class="max-w-6xl mx-auto px-4">
        ${viewEvents(elements, this.userId, this.verifSpecificGuests(elements))}
      </div>
    `;
    this.el.innerHTML = html;
    navFunction();
    this.attachEventListeners(elements);
  }

  renderNoEvents() {
    const html = `
    ${viewNav(this.userId)}
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-3xl py-6">You don't have events.</p>
      </div>
    `;
    this.el.innerHTML = html;
  }

  navigateToEventDetail(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=more&eventId=${eventId}`);
    }
    new EventMore(eventId);
  }

  navigateToEventEdit(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=edit&eventId=${eventId}`);
    }
    new EventEdit(eventId);
  }

  navigateToAllocateResources(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=allocate-resources&eventId=${eventId}`);
    }
    new EventAllocateResources(eventId);
  }

  navigateToCheckResources(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?action=check-resources&eventId=${eventId}`);
    }
    new EventCheckResources();
  }

  navigateToEditResources(eventId, resourceId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId, resourceId }, '', `?action=edit-resources&eventId=${eventId}&resourceId=${resourceId}`);
    }
    new EventEditResources();
  }
}

export default MyEvents;
