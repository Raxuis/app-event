import axios from 'axios';
import { multipleSelect } from 'multiple-select-vanilla';
import viewNav from '../views/nav';
import viewPageModel from '../views/modelPage';

const Model = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.isLogged = localStorage.getItem('isLogged');

    this.run();
  }

  async initialize() {
    const users = await this.getUsers();
    if (users) {
      this.populateUserSelect(users);
    }
  }

  attachEventListeners() {
    const submitBtn = document.getElementById('submit-model');
    const cancelBtn = document.getElementById('cancel-model');
    const form = document.getElementById('form-model');

    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const response = await this.formSubmit(form);
      if (response === true) {
        const url = new URL(window.location);
        url.searchParams.delete('modelId');
        window.history.replaceState({}, '', url);
        window.location.reload();
      }
    });
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = new URL(window.location);
      url.searchParams.delete('modelId');
      window.history.replaceState({}, '', url);
      window.location.reload();
    });
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  populateUserSelect(users) {
    const userId = parseInt(localStorage.getItem('id'), 10);
    const userOptions = users
      .filter((user) => user.id !== userId)
      .map((user) => ({
        text: user.email,
        value: user.id
      }));

    this.ms1 = multipleSelect('#select1', {
      name: 'my-select',
      single: false,
      useSelectOptionLabelToHtml: true,
      data: userOptions,
      maxHeight: 5,
      maxHeightUnit: 'row'
    });
  }

  async getUsers() {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/users`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getModelInfos(modelId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/model/${modelId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  datePickerFunction() {
    // eslint-disable-next-line no-undef
    flatpickr('#datepicker', {});
  }

  async formSubmit(elForm) {
    const errorText = document.getElementById('error-text');
    const formData = new FormData(elForm);

    const requiredFields = ['name', 'description', 'place', 'time', 'group-name'];
    if (requiredFields.every((field) => formData.get(field)) && this.ms1.getSelects().length > 0) {
      try {
        const inputDate = new Date(formData.get('time'));
        const formattedDate = `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(inputDate.getDate()).padStart(2, '0')} ${String(inputDate.getHours()).padStart(2, '0')}:${String(inputDate.getMinutes()).padStart(2, '0')}:${String(inputDate.getSeconds()).padStart(2, '0')}`;

        const selectedUserIds = this.ms1.getSelects();
        const response = await this.getModelInfos(this.params);
        // Push the id of the user who has made the event
        selectedUserIds.push(11);
        const imageUrl = formData.get('image-url');
        const eventData = {
          name: formData.get('name'),
          description: formData.get('description'),
          place: formData.get('place'),
          size: response.size,
          time: formattedDate,
          user_ids: selectedUserIds,
          user_id: 11,
          group_name: formData.get('group-name')
        };
        if (imageUrl) {
          eventData.image = imageUrl;
        }
        await axios.post(`http://localhost:${process.env.BACKEND_PORT}/event`, eventData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return true;
      } catch (error) {
        errorText.innerHTML = error.message;
        return false;
      }
    } else {
      errorText.innerHTML = 'Please fill in all the fields';
      return false;
    }
  }

  async render() {
    const response = await this.getModelInfos(this.params);
    return `
    ${viewNav(this.isLogged)}
    <div class="container mx-auto h-screen p-6 mt-4">
    <div class="flex flex-wrap gap-4">
    <div class="flex-shrink-0">
          <button type="button" onclick="window.location.href='/models'" class="flex items-center justify-center px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
            <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
        <div class="flex-grow text-center">
          <h1 class="hidden text-4xl sm:block font-bold">Model n°${response.id} : ${response.type[0].toUpperCase() + response.type.slice(1)}</h1>
        </div>
    </div>
    <div class="mx-auto flex flex-col items-center justify-center h-screen p-6">
      ${viewPageModel(response)}
      </div>
    </div>
    `;
  }

  async run() {
    this.datePickerFunction();
    this.el.innerHTML = await this.render();
    this.navFunction();
    this.initialize();
    this.attachEventListeners();
  }
};

export default Model;
