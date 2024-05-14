import axios from 'axios';
import viewNav from '../views/nav';
import viewDashboard from '../views/allModels';

const allModels = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  async elementsQuery() {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/models`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async render() {
    const elements = await this.elementsQuery();
    if (elements !== null && elements.length > 0) {
      return `
        ${viewNav()}
        ${viewDashboard(elements)}
      `;
    }
    return `
      ${viewNav()}
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-3xl py-6">No models</p>
      </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render(); // Await the rendering process
  }
};

export default allModels;
