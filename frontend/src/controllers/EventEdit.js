import axios from 'axios';
import Cookies from 'js-cookie';
import viewNav from '../views/nav';
import viewEvent from '../views/eventEditPage';
import viewCustomField from '../views/customField';

class Event {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.init();
  }

  async init() {
    this.response = await this.getEventInfos(this.params);
    const sessionId = Cookies.get('PHP_SESSID');

    if (!sessionId) {
      this.userId = null;
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/auth/${sessionId}`);
      this.userId = response.data.user_id;
    } catch (e) {
      this.userId = null;
    }
    if (this.userId !== this.response.author_id) {
      window.location.href = '/my-events';
    }
    this.run();
  }

  async getEventInfos(eventId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/event/${eventId}`);
      return response.data;
    } catch (error) {
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

  addCustomFields() {
    const customFieldsAddBtn = document.getElementById('custom-field-btn');
    const customFields = document.getElementById('custom-field-edit');
    const errorText = document.getElementById('error-text');
    if (customFieldsAddBtn) {
      customFieldsAddBtn.addEventListener('click', () => {
        if (customFields.children.length < 2) {
          const customFieldsNumber = customFields.children.length + 1;
          customFields.innerHTML += `${viewCustomField(customFieldsNumber)}`;

          const removeBtn = document.getElementById(`remove-${customFieldsNumber}`);
          removeBtn.addEventListener('click', () => {
            removeBtn.parentElement.parentElement.remove();
          });

          const label = document.querySelector(`label[for="${customFieldsNumber}"]`);
          const input = document.getElementById(customFieldsNumber);
          label.addEventListener('input', () => {
            input.name = label.textContent;
          });
        } else {
          errorText.innerHTML = 'Can\'t have more than two custom fields';
        }
      });
    }
  }

  attachEventListeners() {
    const submitButton = document.getElementById('submit-edit');
    const cancelButton = document.getElementById('cancel-edit');
    const form = document.getElementById('form-edit');

    if (cancelButton) {
      cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/my-events';
      });
    }

    if (submitButton) {
      submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const customFields = document.getElementById('custom-field-edit');
        const customFieldsArray = [];
        customFields.querySelectorAll('input[type="text"]').forEach((field) => {
          customFieldsArray.push({ name: field.name, value: field.value });
        });
        formData.append('custom_fields', JSON.stringify(customFieldsArray));
        try {
          const imageUrl = formData.get('image-url');

          const eventData = {
            name: formData.get('event_name'),
            description: formData.get('event_description'),
            date: formData.get('event_date'),
            location: formData.get('event_location'),
            custom_fields: formData.get('custom_fields')
          };

          if (imageUrl) {
            eventData.image = imageUrl;
          }
          // eslint-disable-next-line no-console
          console.log(eventData);
          // const response = await axios.put(`http://localhost:${process.env.BACKEND_PORT}/event/${this.response.event_id}`, eventData, {
          //   headers: {
          //     'Content-Type': 'application/json'
          //   }
          // });
          // if (response.status === 200) {
          //   window.location.href = '/my-events';
          // }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error updating event:', error);
        }
      });
    }
  }

  async render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto h-screen px-6 py-2 sm:p-6 sm:mt-4">
  <div class="flex flex-wrap gap-4 justify-center">
    <h1 class="text-4xl hidden sm:block text-center font-bold">Editing Event n°${this.response.event_id} : ${this.response.event_name}</h1>
  </div>
  <div class="mx-auto flex flex-col items-center justify-center h-screen p-6">
    ${viewEvent(this.response)}
  </div>
</div>

    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.navFunction();
    this.addCustomFields();
    this.attachEventListeners();
  }
}

export default Event;
