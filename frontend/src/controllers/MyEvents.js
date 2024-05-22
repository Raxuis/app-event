import axios from 'axios';
import viewNav from '../views/nav';
import viewEvents from '../views/events';
import Event from './Event';

class MyEvents {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.el = document.querySelector('#root');
      this.isLogged = localStorage.getItem('isLogged');
      this.userId = localStorage.getItem('id');
      this.initialize();
      window.addEventListener('popstate', (event) => {
        if (event.state && event.state.eventId) {
          this.navigateToEventDetail(event.state.eventId);
        } else {
          this.initialize();
        }
      });
    });
  }

  async initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');

    if (eventId) {
      this.navigateToEventDetail(eventId);
    } else {
      const elements = await this.getElements();
      if (elements !== null && elements.length > 0) {
        this.renderAllEvents(elements);
      } else {
        this.renderNoEvents();
      }
    }
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }
  }

  async getElements() {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/events/${this.userId}`);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching elements:', error);
      return null;
    }
  }

  attachEventListeners(events) {
    events.forEach((event) => {
      const deleteButton = document.getElementById(`delete-${event.event_id}`);
      const cardEvent = document.getElementById(`card-${event.event_id}`);
      const readMoreButton = document.getElementById(`read-more-${event.event_id}`);
      if (deleteButton) {
        deleteButton.addEventListener('click', () => this.deleteEvent(event.event_id, cardEvent));
      }
      if (readMoreButton) {
        readMoreButton.addEventListener('click', () => this.navigateToEventDetail(event.event_id));
      }
    });
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
      // eslint-disable-next-line no-console
      console.error('Error deleting event:', error);
      return false;
    }
  }

  renderAllEvents(elements) {
    const html = `
      ${viewNav(this.isLogged)}
      <div class="max-w-6xl mx-auto px-4">
        ${viewEvents(elements, this.userId)}
      </div>
    `;
    this.el.innerHTML = html;
    this.navFunction();
    this.attachEventListeners(elements);
  }

  renderNoEvents() {
    const html = `
      ${viewNav(this.isLogged)}
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-3xl py-6">You don't have events.</p>
      </div>
    `;
    this.el.innerHTML = html;
  }

  navigateToEventDetail(eventId) {
    window.history.pushState({ eventId }, '', `?eventId=${eventId}`);
    new Event(eventId);
  }
}

export default MyEvents;
