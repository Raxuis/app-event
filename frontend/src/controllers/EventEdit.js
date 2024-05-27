import axios from 'axios';
import Cookies from 'js-cookie';
import flatpickr from 'flatpickr';
import { multipleSelect } from 'multiple-select-vanilla';
import isURL from 'validator/lib/isURL';
import viewNav from '../views/nav';
import viewEvent from '../views/eventEditPage';
import viewCustomField from '../views/customField';
import renderToastr from '../utils/toastr/renderToastr';

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

  async populateUserSelect() {
    const users = await this.getUsers();
    if (users) {
      const selectedUserIds = this.response.guests.map((guest) => guest.guest_id);
      const userOptions = users
        .map((user) => ({
          text: user.email,
          value: user.id,
          selected: selectedUserIds.includes(user.id)
        }));

      this.ms1 = multipleSelect('#select1', {
        name: 'my-select',
        single: false,
        useSelectOptionLabelToHtml: true,
        data: userOptions,
        maxHeight: 5,
        maxHeightUnit: 'row',
        selectAll: false,
        showClear: true
      });
    }
  }

  async getUsers() {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/users`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getEventInfos(eventId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/event/${eventId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  datePickerFunction() {
    const dateString = this.response.time;
    const date = new Date(dateString);
    flatpickr('#datepicker', {
      defaultDate: date,
      locale: {
        firstDayOfWeek: 1
      }
    });
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
        const errorText = document.getElementById('error-text');
        e.preventDefault();
        const formData = new FormData(form);
        const customFields = document.getElementById('custom-field-edit');
        const customFieldsArray = [];
        customFields.querySelectorAll('input[type="text"]').forEach((field) => {
          customFieldsArray.push({ name: field.name, value: field.value });
        });
        formData.append('custom_fields', JSON.stringify(customFieldsArray));
        const requiredFields = ['name', 'description', 'place', 'size', 'time', 'group-name'];
        if (
          requiredFields.every(
            (field) => formData.get(field)
          )
          && this.ms1.getSelects().length > 0
        ) {
          try {
            const inputDate = new Date(formData.get('time'));
            const formattedDate = `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(inputDate.getDate()).padStart(2, '0')} ${String(inputDate.getHours()).padStart(2, '0')}:${String(inputDate.getMinutes()).padStart(2, '0')}:${String(inputDate.getSeconds()).padStart(2, '0')}`;

            const selectedUserIds = this.ms1.getSelects();
            const imageUrl = formData.get('image-url');
            selectedUserIds.push(this.userId);

            const eventData = {
              name: formData.get('name'),
              description: formData.get('description'),
              place: formData.get('place'),
              time: formattedDate,
              user_ids: selectedUserIds,
              user_id: this.userId,
              group_name: formData.get('group-name'),
              custom_fields: formData.get('custom_fields'),
              size: formData.get('size')
            };

            if (imageUrl) {
              if (isURL(imageUrl)) {
                eventData.image = imageUrl;
              } else {
                eventData.image = '';
              }
            }
            const response = await axios.put(`http://localhost:${process.env.BACKEND_PORT}/event/${this.response.event_id}`, eventData, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (response.status === 201) {
              renderToastr('success', 'Success', 'Event updated successfully!');
              setTimeout(() => { window.location.href = '/my-events'; }, 4000);
            }
          } catch (error) {
            renderToastr('error', 'Error', error.response.statusText);
          }
        } else {
          errorText.innerHTML = 'Please fill in all the fields';
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
    this.datePickerFunction();
    await this.populateUserSelect();
    this.navFunction();
    this.addCustomFields();
    this.attachEventListeners();
  }
}

export default Event;
