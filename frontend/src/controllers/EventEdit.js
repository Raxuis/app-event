import axios from 'axios';
import Cookies from 'js-cookie';
import flatpickr from 'flatpickr';
import { multipleSelect } from 'multiple-select-vanilla';
import isURL from 'validator/lib/isURL';
import viewNav from '../views/nav';
import viewEvent from '../views/eventEditPage';
import viewCustomFieldCreate from '../views/customFieldCreate';
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
        .filter((user) => user.id !== this.userId)
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
    const customFieldsContainer = document.getElementById('custom-field-edit');
    const errorText = document.getElementById('error-text');

    if (customFieldsAddBtn) {
      customFieldsAddBtn.addEventListener('click', () => {
        if (customFieldsContainer.children.length < 2) {
          const customFieldsNumber = customFieldsContainer.children.length + 1;
          const newCustomFieldHtml = viewCustomFieldCreate({ id: customFieldsNumber, field_name: '', field_value: '' });
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newCustomFieldHtml;
          const newCustomFieldElement = tempDiv.firstElementChild;

          customFieldsContainer.appendChild(newCustomFieldElement);
          this.attachRemoveEventListener(`remove-${customFieldsNumber}`);
        } else {
          errorText.innerHTML = 'Can\'t have more than two custom fields';
        }
      });
    }

    this.response.custom_fields.forEach((custom_field) => {
      this.attachRemoveEventListener(`remove-${custom_field.id}`);
    });
  }

  attachRemoveEventListener(removeBtnId) {
    document.getElementById(removeBtnId).addEventListener('click', (event) => {
      event.target.closest('.flex.flex-col.space-y-2.mt-2').remove();
    });
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
        const customFieldsContainer = document.getElementById('custom-field-edit');
        const customFieldsArray = [];

        customFieldsContainer.querySelectorAll('.flex.flex-col.space-y-2.mt-2').forEach((field) => {
          const fieldName = field.querySelector('input[name^="name-"]').value;
          const fieldValue = field.querySelector('input[name^="value-"]').value;
          if (fieldName && fieldValue) {
            customFieldsArray.push({ name: fieldName, value: fieldValue });
          }
        });

        formData.append('custom_fields', JSON.stringify(customFieldsArray));

        const requiredFields = ['name', 'description', 'place', 'size', 'time', 'group-name'];
        if (
          requiredFields.every(
            (field) => formData.get(field)
          ) && this.ms1.getSelects().length > 0
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
              custom_fields: JSON.parse(formData.get('custom_fields')),
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
              setTimeout(() => { window.location.href = '/my-events'; }, 2000);
            } else {
              renderToastr('error', 'Error', 'An error occurred while updating the event.');
            }
          } catch (error) {
            renderToastr('error', 'Error', 'An error occurred while updating the event.');
          }
        } else {
          errorText.innerHTML = 'Please fill in all fields';
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
