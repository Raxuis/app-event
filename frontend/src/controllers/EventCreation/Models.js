import axios from 'axios';
import { multipleSelect } from 'multiple-select-vanilla';
import flatpickr from 'flatpickr';
import isURL from 'validator/lib/isURL';
import viewNav from '../../views/components/nav';
import viewModels from '../../views/eventCreation/models/models';
import viewBuiltModel from '../../views/eventCreation/customEvent/builtModel';
import Model from './Model';
import renderToastr from '../../utils/toastr/renderToastr';
import navFunction from '../../utils/navbar/navFunction';
import incrementDecrementInput from '../../utils/forms/quantity/incrementDecrementInput';
import getAll from '../../utils/getters/getAll';
import getUserId from '../../utils/getters/getUserId';

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
    this.userId = await getUserId();

    if (modelId) {
      this.navigateToModelDetail(modelId);
    } else {
      const models = await getAll('models');
      if (models !== null && models.length > 0) {
        this.renderAllModels(models);
      } else {
        this.renderNoModels();
      }
    }
  }

  showDialog() {
    const dialog = document.querySelector('.dialog');
    const activationBtn = document.querySelector('.add-event');
    const cancelBtn = document.querySelector('.cancel-dialog');
    const submitBtn = document.querySelector('.submit-dialog');
    const form = document.querySelector('.form-dialog');
    activationBtn.addEventListener('click', async () => {
      const users = await getAll('users');
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

  renderAllModels(models) {
    const html = `
    ${viewNav(this.userId)}
      <div class="max-w-6xl mx-auto px-4 mb-16">
        ${viewModels(models)}
        ${viewBuiltModel()}
      </div>
    `;
    this.el.innerHTML = html;
    this.attachEventListeners(models);
    incrementDecrementInput();
    this.datePickerFunction();
    this.showDialog();
    navFunction();
  }

  datePickerFunction() {
    flatpickr('#datepicker', {});
  }

  renderNoModels() {
    const html = `
    ${viewNav(this.userId)}
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
