import axios from 'axios';
import flatpickr from 'flatpickr';
import { multipleSelect } from 'multiple-select-vanilla';
import isURL from 'validator/lib/isURL';
import viewNav from '../../views/components/nav';
import viewEvent from '../../views/eventEdition/eventEditPage';
import viewCustomFieldCreate from '../../views/customField/customFieldCreate';
import renderToastr from '../../utils/toastr/renderToastr';
import getById from '../../utils/getters/getById';
import navFunction from '../../utils/navbar/navFunction';
import getAll from '../../utils/getters/getAll';
import getUserId from '../../utils/getters/getUserId';

class Event {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.init();
  }

  async init() {
    this.response = await getById('event', this.params);
    this.userId = await getUserId();

    if (this.userId !== this.response.author_id) {
      window.location.href = '/my-events';
    }
    this.run();
  }

  async populateUserSelect() {
    const users = await getAll('users');
    if (users) {
      const selectedUserIds = this.response.guests.map((guest) => guest.guest_id);
      const userOptions = users
        .filter((user) => user.id !== this.userId)
        .map((user) => ({
          text: user.email,
          value: user.id,
          selected: selectedUserIds.includes(user.id),
          guest_status: this.response.guests.find((guest) => guest.guest_id === user.id)?.guest_status || 'registered'
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

  addCustomFields() {
    const customFieldsAddBtn = document.querySelector('.custom-field-btn');
    const customFieldsContainer = document.querySelector('.custom-field-edit');
    const errorText = document.querySelector('.error-text-edit');

    if (customFieldsAddBtn) {
      customFieldsAddBtn.addEventListener('click', () => {
        if (customFieldsContainer.children.length < 2) {
          const customFieldsNumber = customFieldsContainer.children.length + 1;
          const newCustomFieldHtml = viewCustomFieldCreate({ id: customFieldsNumber, field_name: '', field_value: '' });
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newCustomFieldHtml;
          const newCustomFieldElement = tempDiv.firstElementChild;

          customFieldsContainer.appendChild(newCustomFieldElement);
          this.attachRemoveEventListener(`.remove-${customFieldsNumber}`);
        } else {
          errorText.innerHTML = 'No more than 2 custom fields.';
        }
      });
    }

    this.response.custom_fields.forEach((custom_field) => {
      this.attachRemoveEventListener(`.remove-${custom_field.id}`);
    });
  }

  attachRemoveEventListener(removeBtnId) {
    document.querySelector(removeBtnId).addEventListener('click', (event) => {
      event.target.closest('.flex.flex-col.space-y-2.mt-2').remove();
    });
  }

  attachEventListeners() {
    const submitButton = document.querySelector('.submit-edit');
    const cancelButton = document.querySelector('.cancel-edit');
    const form = document.querySelector('.form-edit');

    if (cancelButton) {
      cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/my-events';
      });
    }

    if (submitButton) {
      submitButton.addEventListener('click', async (e) => {
        const errorText = document.querySelector('.error-text-edit');
        e.preventDefault();
        const formData = new FormData(form);
        const customFieldsContainer = document.querySelector('.custom-field-edit');
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

            const imageUrl = formData.get('image-url');
            const selectedUserIds = this.ms1.getSelects();
            const guestStatuses = selectedUserIds.map((userId) => {
              const userOption = this.ms1.data.find((option) => option.value === userId);
              return userOption.guest_status || 'registered'; // default to 'registered' if no status is found
            });

            // Ensure the author is included and set their status to 'confirmed'
            selectedUserIds.push(this.userId);
            guestStatuses.push('confirmed');

            const eventData = {
              name: formData.get('name'),
              description: formData.get('description'),
              place: formData.get('place'),
              time: formattedDate,
              user_ids: selectedUserIds,
              guest_statuses: guestStatuses,
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
              renderToastr('success', 'Success', 'Event updated!');
            } else {
              renderToastr('error', 'Error', 'An error occurred.');
            }
          } catch (error) {
            renderToastr('error', 'Error', 'An error occurred.');
          }
        } else {
          errorText.innerHTML = 'Please fill in the following fields.';
        }
      });
    }
  }

  async render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto h-screen px-6 py-2 sm:p-6 sm:mt-4">
      <div class="flex flex-wrap gap-4 justify-center items-center">
        <div class="flex-shrink-0 order-1 max-sm:pt-6 max-sm:w-full">
          <button type="button" onclick="window.location.href='/my-events'" class="max-sm:w-full flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
        <div class="flex-grow order-2 max-sm:hidden">
          <h1 class="text-4xl text-center font-bold">Edit event n°${this.response.event_id} : ${this.response.event_name}</h1>
        </div>
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
    navFunction();
    this.addCustomFields();
    this.attachEventListeners();
  }
}

export default Event;
