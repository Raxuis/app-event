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
    const userOptions = users.map((user) => ({
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
    <div class="container mx-auto flex flex-col items-center justify-center h-screen p-6">
      <h1 class="text-4xl font-bold text-center">Model n°${response.id} : ${response.type[0].toUpperCase() + response.type.slice(1)}</h1>
      ${viewPageModel(response)}
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
