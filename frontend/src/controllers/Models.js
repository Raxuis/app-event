import axios from 'axios';
import { multipleSelect } from 'multiple-select-vanilla';
import viewNav from '../views/nav';
import viewModels from '../views/models';
import viewBuiltModel from '../views/builtModel';
import Model from './Model';

class AllModelsController {
  constructor() {
    this.el = document.querySelector('#root');
    this.initialize();
    this.isLogged = localStorage.getItem('isLogged');
  }

  async initialize() {
    const elements = await this.getElements();
    if (elements !== null && elements.length > 0) {
      this.renderAllModels(elements);
    } else {
      this.renderNoModels();
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
      ${viewNav(this.isLogged)}
      <div class="max-w-6xl mx-auto px-4 mb-16">
        ${viewModels(elements)}
        ${viewBuiltModel()}
      </div>
    `;
    this.el.innerHTML = html;
    this.attachEventListeners(elements);
    this.showDialog();
    this.incrementDecrementInput();
    this.datePickerFunction();
    this.navFunction();
  }

  datePickerFunction() {
    // eslint-disable-next-line no-undef
    flatpickr('#datepicker', {
    });
  }

  incrementDecrementInput() {
    const numberInput = document.getElementById('quantity-input');
    const incrementButton = document.getElementById('increment-button');
    const decrementButton = document.getElementById('decrement-button');
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
      const readMoreButton = document.querySelector(`#read-more-${model.id}`);
      if (readMoreButton) {
        readMoreButton.addEventListener('click', () => this.navigateToModelDetail(model.id));
      }
    });
  }

  showDialog() {
    const dialog = document.getElementById('dialog');
    const activationBtn = document.getElementById('add-event');
    const cancelBtn = document.getElementById('cancel-dialog');
    const submitBtn = document.getElementById('submit-dialog');
    const form = document.getElementById('form-dialog');
    activationBtn.addEventListener('click', async () => {
      dialog.classList.remove('hidden');
      dialog.classList.add('flex');
      setTimeout(() => {
        dialog.classList.add('opacity-100');
      }, 20);
      const users = await this.getUsers();
      // eslint-disable-next-line no-console
      console.log(users);
      if (users) {
        this.populateUserSelect(users);
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

  async formSubmit(elForm) {
    const errorText = document.getElementById('error-text');
    const formData = new FormData(elForm);

    const requiredFields = ['name', 'description', 'place', 'image-url', 'quantity', 'time', 'group-name'];
    if (requiredFields.every((field) => formData.get(field)) && this.ms1.getSelects().length > 0) {
      try {
        const inputDate = new Date(formData.get('time'));
        const formattedDate = `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(inputDate.getDate()).padStart(2, '0')} ${String(inputDate.getHours()).padStart(2, '0')}:${String(inputDate.getMinutes()).padStart(2, '0')}:${String(inputDate.getSeconds()).padStart(2, '0')}`;

        const selectedUserIds = this.ms1.getSelects();
        // Push the id of the user who has made the event
        selectedUserIds.push(11);

        await axios.post(`http://localhost:${process.env.BACKEND_PORT}/event`, {
          name: formData.get('name'),
          description: formData.get('description'),
          place: formData.get('place'),
          image: formData.get('image-url'),
          size: formData.get('quantity'),
          time: formattedDate,
          user_ids: selectedUserIds,
          user_id: 11,
          group_name: formData.get('group-name')

        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return true;
      } catch (error) {
        errorText.innerHTML = 'An error occurred';
        return false;
      }
    } else {
      errorText.innerHTML = 'Please fill in all the fields';
      return false;
    }
  }

  navigateToModelDetail(modelId) {
    new Model(modelId);
  }
}

export default AllModelsController;
