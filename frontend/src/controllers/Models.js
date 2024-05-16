import axios from 'axios';
import viewNav from '../views/nav';
import viewModels from '../views/models';
import viewBuiltModel from '../views/builtModel';

class AllModelsController {
  constructor() {
    this.el = document.querySelector('#root');
    this.initialize();
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

  renderAllModels(elements) {
    const html = `
      ${viewNav()}
      <div class="max-w-6xl mx-auto px-4">
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
    activationBtn.addEventListener('click', () => {
      dialog.classList.remove('hidden');
      dialog.classList.add('flex');
      setTimeout(() => {
        dialog.classList.add('opacity-100');
      }, 20);
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

  async formSubmit(elForm) {
    const errorText = document.getElementById('error-text');
    const formData = new FormData(elForm);
    console.log(formData.get('time'));

    const requiredFields = ['name', 'description', 'place', 'image-url', 'quantity', 'time'];
    if (requiredFields.every((field) => formData.get(field))) {
      try {
        const inputDate = new Date(formData.get('time'));
        const formattedDate = `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(inputDate.getDate()).padStart(2, '0')} ${String(inputDate.getHours()).padStart(2, '0')}:${String(inputDate.getMinutes()).padStart(2, '0')}:${String(inputDate.getSeconds()).padStart(2, '0')}`;
        console.log(formattedDate);
        await axios.post(`http://localhost:${process.env.BACKEND_PORT}/event`, {
          name: formData.get('name'),
          description: formData.get('description'),
          place: formData.get('place'),
          image: formData.get('image-url'),
          size: formData.get('quantity'),
          time: formattedDate,
          // ! 👇 Edit this with session datas
          user_id: 11
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return true;
      } catch (error) {
        console.log(error);
        errorText.innerHTML = 'An error occurred';
        return false;
      }
    } else {
      errorText.innerHTML = 'Please fill in all the fields';
      return false;
    }
  }

  navigateToModelDetail(modelId) {
    window.location.href = `/model/${modelId}`;
  }
}

export default AllModelsController;
