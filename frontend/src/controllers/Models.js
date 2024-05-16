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
    this.attachAddButtonEventListener();
    this.navFunction();
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

  attachAddButtonEventListener() {
    const addEventButton = document.querySelector('#add-event');
    addEventButton.addEventListener('click', () => {
      window.location.href = '/create-custom-event';
    });
  }

  navigateToModelDetail(modelId) {
    window.location.href = `/model/${modelId}`;
  }
}

export default AllModelsController;
