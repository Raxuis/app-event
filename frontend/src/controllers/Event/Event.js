import getById from '../../utils/getters/getById';
import getParams from '../../utils/getters/getParams';
import getUserId from '../../utils/getters/getUserId';
import navFunction from '../../utils/navbar/navFunction';
import viewNav from '../../views/components/nav';
import viewEvent from '../../views/myEvents/event';
import EventMore from './EventMore';
import EventEdit from './EventEdit';
import convertEntitiesHTML from '../../views/security/specialChars';

class Event {
  constructor() {
    this.el = document.querySelector('#root');
    this.init();
  }

  async init() {
    this.params = getParams();
    this.response = await getById('event', this.params.eventId);
    this.userId = await getUserId();

    let userExists = false;
    if (Object.keys(this.response).length > 0) {
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
    } else {
      window.location.href = '/my-events';
    }
  }

  attachEventListeners() {
    const responseEventId = this.response.event_id;
    const paramsEventId = this.params.eventId;

    const actions = {
      'read-more': () => this.navigateToEventDetail(responseEventId),
      edit: () => this.navigateToEventEdit(responseEventId)
    };

    Object.keys(actions).forEach((action) => {
      const element = document.querySelector(`.${action}-${paramsEventId}`);
      if (element) {
        element.addEventListener('click', actions[action]);
      }
    });
  }

  // Rendering the event with the sanitized event infos
  render() {
    // Extracting description and event_name from this.response
    const { description, event_name: eventName } = this.response;

    // Sanitizing description and event_name using convertEntitiesHTML function
    const sanitizedDescription = convertEntitiesHTML(description);
    const sanitizedEventName = convertEntitiesHTML(eventName);

    // Creating a sanitized version of this.response with only description and event_name fields
    const sanitizedResponse = {
      ...this.response,
      description: sanitizedDescription,
      event_name: sanitizedEventName
    };

    return `
      ${viewNav(this.userId)}
      <div class="w-screen flex items-center justify-center px-6 py-2 sm:p-6 sm:mt-4">
      ${viewEvent(sanitizedResponse, this.userId)}
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
