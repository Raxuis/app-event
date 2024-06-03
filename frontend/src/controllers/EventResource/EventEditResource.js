import axios from 'axios';
import { multipleSelect } from 'multiple-select-vanilla';
import viewNav from '../../views/components/nav';
import viewEditResource from '../../views/eventResource/eventEditResource/eventEditResourcePage';
import renderToastr from '../../utils/toastr/renderToastr';
import goBack from '../../utils/navigation/goBack';
import navFunction from '../../utils/navbar/navFunction';
import getById from '../../utils/getters/getById';
import getParams from '../../utils/getters/getParams';
import getUserId from '../../utils/getters/getUserId';

class EventEditResources {
  constructor() {
    this.el = document.querySelector('#root');
    this.params = getParams();
    this.init();
  }

  async init() {
    this.eventInfos = await getById('event', this.params.eventId);
    this.resourceInfos = await getById('resource', this.params.resourceId);
    this.userId = await getUserId();

    if (this.userId !== this.eventInfos.author_id) {
      window.location.href = '/my-events';
    }
    this.run();
  }

  attachEventListeners() {
    const goBackButton = document.querySelector('.go-back-edit-resource');
    if (goBackButton) {
      goBackButton.addEventListener('click', () => goBack('check-resources', this.params.eventId));
    }
    const form = document.querySelector('.form-edit-resource');
    const numberInput = document.querySelector('.quantity-input-edit-resource');
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
          id: this.params.resourceId,
          name: formData.get('name'),
          type: selectedType,
          cost: formData.get('cost')
        };

        try {
          const response = await axios.put(`http://localhost:${process.env.BACKEND_PORT}/resource`, datas);
          if (response.status === 200) {
            goBack('check-resources', this.params.eventId);
          }
        } catch (error) {
          renderToastr('error', 'Error', 'Failed to submit the form.');
        }
      } else {
        renderToastr('error', 'Error', 'All fields are required.');
      }
    });
  }

  async populateTypeSelect() {
    if (this.resourceInfos) {
      const types = ['room', 'equipment', 'other'];
      const options = types.map((type) => ({
        text: type[0].toUpperCase() + type.slice(1),
        value: type,
        selected: this.resourceInfos.type === type
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
  }

  async render() {
    return `
    ${viewNav(this.userId)}
    <div class="container mx-auto max-sm:h-full">
    ${viewEditResource(this.resourceInfos)}
    </div>
    `;
  }

  async run() {
    this.el.innerHTML = await this.render();
    navFunction();
    this.attachEventListeners();
    this.populateTypeSelect();
  }
}

export default EventEditResources;
