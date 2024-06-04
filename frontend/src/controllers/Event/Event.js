import getById from '../../utils/getters/getById';
import getParams from '../../utils/getters/getParams';
import getUserId from '../../utils/getters/getUserId';
import navFunction from '../../utils/navbar/navFunction';
import viewNav from '../../views/components/nav';
import viewEvent from '../../views/myEvents/event';
import EventMore from './EventMore';
import EventEdit from './EventEdit';

class Event {
  constructor() {
    this.el = document.querySelector('#root');
    this.init();
  }

  async init() {
    this.params = getParams();
    this.response = await getById('event', this.params.eventId);
    this.userId = await getUserId();
    this.response.guests.forEach((guest) => {
      if (!guest.guest_id === this.userId) {
        window.location.href = '/my-events';
      }
    });

    this.run();
  }

  attachEventListeners() {
    const readMoreButton = document.querySelector(`.read-more-${this.params.eventId}`);
    const editButton = document.querySelector(`.edit-${this.params.eventId}`);
    if (readMoreButton) {
      readMoreButton.addEventListener('click', () => this.navigateToEventDetail(this.response.event_id));
    }
    if (editButton) {
      editButton.addEventListener('click', () => this.navigateToEventDetail(this.response.event_id));
    }
  }

  render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto h-screen px-6 py-2 sm:p-6 sm:mt-4">
    ${viewEvent(this.response, this.userId)}
    </div>`;
  }

  navigateToEventDetail(eventId) {
    window.history.pushState({ eventId }, '', `?eventId=${eventId}`);
    new EventMore(eventId);
  }

  navigateToEventEdit(eventId) {
    window.history.pushState({ eventId }, '', `?action=edit&eventId=${eventId}`);
    new EventEdit(eventId);
  }

  run() {
    this.el.innerHTML = this.render();
    this.attachEventListeners();
    navFunction();
  }
}
export default Event;
