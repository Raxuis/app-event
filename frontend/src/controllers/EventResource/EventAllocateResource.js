import Cookies from 'js-cookie';
import axios from 'axios';
import { multipleSelect } from 'multiple-select-vanilla';
import viewNav from '../../views/components/nav';
import viewAllocate from '../../views/eventResource/eventAllocateResource/eventAllocateRessource';
import renderToastr from '../../utils/toastr/renderToastr';

class EventAllocateResources {
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
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/auth/${sessionId}`);
      this.userId = response.data.user_id;
    } catch (e) {
      this.userId = null;
    }
    if (this.userId !== this.response.author_id) {
      window.location.href = '/my-events';
    }
    this.run();
  }

  async getEventInfos(eventId) {
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/event/${eventId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  populateSelect() {
    const types = ['room', 'equipment', 'other'];
    const options = types.map((type) => ({
      text: type[0].toUpperCase() + type.slice(1),
      value: type
    }));

    this.ms1 = multipleSelect('#resource-type', {
      name: 'my-select',
      single: true,
      useSelectOptionLabelToHtml: true,
      data: options,
      maxHeight: 3,
      maxHeightUnit: 'row',
      showClear: true
    });
  }

  attachEventListeners() {
    const form = document.querySelector('.form-allocate');
    const goBackButton = document.querySelector('.go-back-allocate');
    const numberInput = document.querySelector('.quantity-input-allocate');
    if (numberInput) {
      numberInput.addEventListener('input', () => {
        let { value } = numberInput;
        value = value.replace(/[^0-9.]/g, '');
        if (value.split('.').length > 2) {
          value = value.replace(/\.+$/, '');
        }
        numberInput.value = value;
      });
    }

    if (goBackButton) {
      goBackButton.addEventListener('click', () => {
        window.location.href = `/my-events?action=more&eventId=${this.response.event_id}`;
      });
    }
    if (form) {
      this.submitForm(form);
    }
  }

  submitForm(element) {
    element.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(element);
      const requiredFields = ['name', 'cost'];

      const selectedType = this.ms1.getSelects()[0];

      if (requiredFields.every((field) => formData.get(field)) && selectedType.length > 0) {
        const datas = {
          name: formData.get('name'),
          type: selectedType,
          cost: formData.get('cost'),
          quantity: 1,
          event_id: this.response.event_id
        };

        try {
          const response = await axios.post(`http://localhost:${process.env.BACKEND_PORT}/resource`, datas);
          if (response.status === 200) {
            window.location.href = `/my-events?action=more&eventId=${this.response.event_id}`;
          }
        } catch (error) {
          renderToastr('error', 'Error', 'Failed to submit the form.');
        }
      } else {
        renderToastr('error', 'Error', 'All fields are required.');
      }
    });
  }

  async render() {
    return `
    ${viewNav(this.userId)}
      <div class="container mx-auto max-sm:h-full">
      ${viewAllocate()}
      </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.populateSelect();
    this.navFunction();
    this.attachEventListeners();
  }
}

export default EventAllocateResources;
