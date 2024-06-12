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
    window.addEventListener('popstate', () => {
      const { eventId, resourceId } = getParams();
      const action = new URLSearchParams(window.location.search).get('action');

      const actionMap = {
        more: () => this.navigateToEventDetail(eventId, false),
        edit: () => this.navigateToEventEdit(eventId, false),
        'allocate-resources': () => this.navigateToAllocateResources(eventId, false),
        'check-resources': () => this.navigateToCheckResources(eventId, false),
        'edit-resources': () => this.navigateToEditResources(eventId, resourceId, false)
      };

      if (action && actionMap[action]) {
        actionMap[action]();
      }

      if (eventId) {
        this.navigateToEvent(eventId, false);
      }
    });
  }

  async initialize() {
    const { eventId, resourceId } = getParams();
    const action = new URLSearchParams(window.location.search).get('action');

    this.userId = await getUserId();

    if (eventId) {
      const actionMap = {
        more: () => this.navigateToEventDetail(eventId),
        edit: () => this.navigateToEventEdit(eventId),
        'allocate-resources': () => this.navigateToAllocateResources(eventId),
        'edit-resources': () => this.navigateToEditResources(eventId, resourceId),
        'check-resources': () => this.navigateToCheckResources(eventId)
      };

      if (action && actionMap[action]) {
        actionMap[action]();
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

  verifSpecificGuests(elements) {
    const specificGuestsMap = {};
    elements.forEach((event) => {
      const { author_id: authorId, guests, event_id: eventId } = event;
      if (authorId !== this.userId && Array.isArray(guests)) {
        specificGuestsMap[eventId] = guests.filter(
          (guest) => guest.guest_id === this.userId
        );
      }
    });
    return specificGuestsMap;
  }

  attachEventListeners(events) {
    const actionMap = {
      delete: (eventId, cardEvent) => this.deleteEvent(eventId, cardEvent),
      'read-more': (eventId) => this.navigateToEventDetail(eventId),
      edit: (eventId) => this.navigateToEventEdit(eventId),
      accept: (eventId, groupId) => this.userInteraction(eventId, groupId, 'accepted'),
      decline: (eventId, groupId) => this.userInteraction(eventId, groupId, 'registered'),
      cancel: (eventId, groupId) => this.userInteraction(eventId, groupId, 'canceled'),
      'export-csv': (eventId) => this.exportEvent(eventId, 'csv'),
      'export-pdf': (eventId) => this.exportEvent(eventId, 'pdf')
    };

    events.forEach((event) => {
      const { event_id: eventId } = event;
      const cardEvent = document.querySelector(`.card-${eventId}`);
      const prefixes = ['delete', 'card', 'read-more', 'edit', 'accept', 'decline', 'cancel', 'export-csv', 'export-pdf'];

      prefixes.forEach((prefix) => {
        const element = document.querySelector(`.${prefix}-${eventId}`);
        if (element && actionMap[prefix]) {
          element.addEventListener('click', () => actionMap[prefix](eventId, cardEvent));
        }
      });
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
      if (cardEvent) {
        // 👇 Removing the event card from the DOM
        cardEvent.remove();
        renderToastr('success', 'Deleted', `Deleted event n°${eventId}`);
      }
      return true;
    } catch (error) {
      renderToastr('error', 'Error deleting event:', error);
      return false;
    }
  }

  // Rendering if events
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

  // Rendering if no events
  renderNoEvents() {
    const html = `
    ${viewNav(this.userId)}
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-3xl py-6">You don't have events.</p>
      </div>
    `;
    this.el.innerHTML = html;
  }

  //  Navigating to different pages ⤵️
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
