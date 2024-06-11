import axios from 'axios';
import { init } from 'shareon';
import viewNav from '../../views/components/nav';
import viewEvents from '../../views/myEvents/events';
import EventMore from './EventMore';
import EventEdit from './EventEdit';
import renderToastr from '../../utils/toastr/renderToastr';
import EventAllocateResources from '../EventResource/EventAllocateResource';
import EventEditResources from '../EventResource/EventEditResource';
import EventCheckResources from '../EventResource/EventCheckResources';
import navFunction from '../../utils/navbar/navFunction';
import getAll from '../../utils/getters/getAll';
import getUserId from '../../utils/getters/getUserId';
import Event from './Event';
import getParams from '../../utils/getters/getParams';

class MyEvents {
  constructor() {
    this.el = document.querySelector('#root');
    this.initialize();
    // 👇 This is to prevent issues when going back to the previous page
    window.addEventListener('popstate', () => {
      const { eventId, resourceId } = getParams();
      const action = new URLSearchParams(window.location.search).get('action');

      // Handling different actions based on URL parameters
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

      if (eventId) {
        this.navigateToEvent(eventId, false);
      }
    });
  }

  // Initializing method to set up the initial state
  async initialize() {
    const { eventId, resourceId } = getParams();
    const action = new URLSearchParams(window.location.search).get('action');

    this.userId = await getUserId();

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
      } else {
        this.navigateToEvent(eventId);
      }
    } else {
      const elements = await getAll('events', this.userId);
      if (Array.isArray(elements) && elements.length > 0) {
        this.renderAllEvents(elements);
        this.socialLinksFunction();
      } else {
        this.renderNoEvents();
      }
    }
  }

  socialLinksFunction() {
    init();
    const copyUrl = document.querySelectorAll('.copy-url');
    copyUrl.forEach((urlLink) => {
      urlLink.addEventListener('click', () => {
        renderToastr('success', 'URL Copied', 'URL copied to clipboard');
      });
    });
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

  attachEventListeners(events) {
    events.forEach((event) => {
      const deleteButton = document.querySelector(`.delete-${event.event_id}`);
      const cardEvent = document.querySelector(`.card-${event.event_id}`);
      const readMoreButton = document.querySelector(`.read-more-${event.event_id}`);
      const editButton = document.querySelector(`.edit-${event.event_id}`);
      const acceptButton = document.querySelector(`.accept-${event.event_id}`);
      const declineButton = document.querySelector(`.decline-${event.event_id}`);
      const cancelButton = document.querySelector(`.cancel-${event.event_id}`);
      const exportCSVButton = document.querySelector(`.export-csv-${event.event_id}`);
      const exportPDFButton = document.querySelector(`.export-pdf-${event.event_id}`);

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
      if (exportCSVButton) {
        exportCSVButton.addEventListener('click', () => this.exportEvent(event.event_id, 'csv'));
      }
      if (exportPDFButton) {
        exportPDFButton.addEventListener('click', () => this.exportEvent(event.event_id, 'pdf'));
      }
    });
  }

  async exportEvent(eventId, format) {
    try {
      const exportDatas = {
        event_id: eventId,
        format
      };

      const response = await axios.post(`http://localhost:${process.env.BACKEND_PORT}/export`, exportDatas, {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'blob' // Important for handling binary data
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/pdf'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `event-${eventId}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      renderToastr('error', 'Error exporting event:', error.message || error);
    }
  }

  async userInteraction(eventId, groupId, status) {
    try {
      const eventData = {
        user_id: this.userId,
        group_id: groupId,
        event_id: eventId,
        // 👇 Either registered, canceled or accepted
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
      // Removing the event card from the DOM
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
      <div class="max-w-6xl mx-auto px-2">
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
      // Updating the browser history state and URL with eventId
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
      // Update the browser history state and URL with eventId and resourceId to fill the form
      window.history.pushState({ eventId, resourceId }, '', `?action=edit-resources&eventId=${eventId}&resourceId=${resourceId}`);
    }
    new EventEditResources();
  }

  navigateToEvent(eventId, pushState = true) {
    if (pushState) {
      window.history.pushState({ eventId }, '', `?eventId=${eventId}`);
    }
    new Event(eventId);
  }
}

export default MyEvents;
