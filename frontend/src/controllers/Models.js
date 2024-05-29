import axios from 'axios';
import Cookies from 'js-cookie';
import { multipleSelect } from 'multiple-select-vanilla';
import flatpickr from 'flatpickr';
import isURL from 'validator/lib/isURL';
import viewNav from '../views/nav';
import viewModels from '../views/models';
import viewBuiltModel from '../views/builtModel';
import Model from './Model';
import renderToastr from '../utils/toastr/renderToastr';

class AllModelsController {
  constructor() {
    this.el = document.querySelector('#root');
    this.initialize();
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.modelId) {
        this.navigateToModelDetail(event.state.modelId);
      } else {
        this.initialize();
      }
    });
  }

  async initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    const modelId = urlParams.get('modelId');
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

    if (modelId) {
      this.navigateToModelDetail(modelId);
    } else {
      const elements = await this.getElements();
      if (elements !== null && elements.length > 0) {
        this.renderAllModels(elements);
      } else {
        this.renderNoModels();
      }
    }
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  async getElements() {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/models`);
      return response.data;
    } catch (error) {
      return null;
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

  renderAllModels(elements) {
    const html = `
      ${viewNav(this.userId)}
      <div class="max-w-6xl mx-auto px-4 mb-16">
        ${viewModels(elements)}
        ${viewBuiltModel()}
      </div>
    `;
    this.el.innerHTML = html;
    this.attachEventListeners(elements);
    this.incrementDecrementInput();
    this.datePickerFunction();
    this.showDialog();
    this.navFunction();
  }

  datePickerFunction() {
    flatpickr('#datepicker', {});
  }

  incrementDecrementInput() {
    const numberInput = document.querySelector('.quantity-input-custom');
    const incrementButton = document.querySelector('.increment-button-custom');
    const decrementButton = document.querySelector('.decrement-button-custom');
    numberInput.addEventListener('input', () => {
      let { value } = numberInput;
      value = value.replace(/\D/g, '');
      numberInput.value = value;
    });
    incrementButton.addEventListener('click', () => {
      const { value } = numberInput;
      let parsedValue = Number.isInteger(parseInt(value, 10)) ? parseInt(value, 10) : 0;
      parsedValue += 1;
      numberInput.value = parsedValue;
    });

    decrementButton.addEventListener('click', () => {
      const { value } = numberInput;
      let parsedValue = Number.isInteger(parseInt(value, 10)) ? parseInt(value, 10) : 0;
      parsedValue -= 1;
      numberInput.value = parsedValue >= 0 ? parsedValue : 0;
    });
  }

  renderNoModels() {
    const html = `
      ${viewNav()}
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-3xl py-6">No models</p>
      </div>
    `;
    this.el.innerHTML = html;
  }

  attachEventListeners(models) {
    models.forEach((model) => {
      const readMoreButton = document.querySelector(`.read-more-${model.id}`);
      if (readMoreButton) {
        readMoreButton.addEventListener('click', () => this.navigateToModelDetail(model.id));
      }
    });
  }

  showDialog() {
    const dialog = document.querySelector('.dialog');
    const activationBtn = document.querySelector('.add-event');
    const cancelBtn = document.querySelector('.cancel-dialog');
    const submitBtn = document.querySelector('.submit-dialog');
    const form = document.querySelector('.form-dialog');
    activationBtn.addEventListener('click', async () => {
      const users = await this.getUsers();
      if (users) {
        this.populateUserSelect(users);
        dialog.classList.remove('hidden');
        dialog.classList.add('flex');
        setTimeout(() => {
          dialog.classList.add('opacity-100');
        }, 20);
      }
    });
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.classList.remove('opacity-100');
      setTimeout(() => {
        dialog.classList.remove('flex');
        dialog.classList.add('hidden');
      }, 500);
    });
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const response = await this.formSubmit(form);
      if (response === true) {
        dialog.classList.remove('opacity-100');
        setTimeout(() => {
          dialog.classList.remove('flex');
          dialog.classList.add('hidden');
        }, 500);
      }
    });
  }

  populateUserSelect(users) {
    const userOptions = users
      .filter((user) => user.id !== this.userId)
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
      maxHeightUnit: 'row',
      selectAll: false
    });
  }

  async formSubmit(elForm) {
    const errorText = document.querySelector('.error-text-custom');
    const formData = new FormData(elForm);

    const requiredFields = ['name', 'description', 'place', 'quantity', 'time', 'group-name'];
    if (requiredFields.every((field) => formData.get(field)) && this.ms1.getSelects().length > 0) {
      try {
        const inputDate = new Date(formData.get('time'));
        const formattedDate = `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(inputDate.getDate()).padStart(2, '0')} ${String(inputDate.getHours()).padStart(2, '0')}:${String(inputDate.getMinutes()).padStart(2, '0')}:${String(inputDate.getSeconds()).padStart(2, '0')}`;

        const selectedUserIds = this.ms1.getSelects();
        // Push the id of the user who has made the event
        selectedUserIds.push(this.userId);
        const imageUrl = formData.get('image-url');
        const eventData = {
          name: formData.get('name'),
          description: formData.get('description'),
          place: formData.get('place'),
          size: formData.get('quantity'),
          time: formattedDate,
          user_ids: selectedUserIds,
          user_id: this.userId,
          group_name: formData.get('group-name')
        };

        if (imageUrl) {
          if (isURL(imageUrl)) {
            eventData.image = imageUrl;
          } else {
            eventData.image = '';
          }
        }

        await axios.post(`http://localhost:${process.env.BACKEND_PORT}/event`, eventData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        renderToastr('success', 'Success', 'Event created successfully!');
        return true;
      } catch (error) {
        renderToastr('error', 'Error', error.response.statusText);
        return false;
      }
    } else {
      errorText.innerHTML = 'Please fill in all the fields';
      return false;
    }
  }

  navigateToModelDetail(modelId) {
    window.history.pushState({ modelId }, '', `?modelId=${modelId}`);
    new Model(modelId);
  }
}

export default AllModelsController;
