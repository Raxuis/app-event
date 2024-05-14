import axios from 'axios';
import viewNav from '../views/nav';
import viewRegister from '../views/register';

const Register = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;

    this.run();
  }

  formSubmit(elForm) {
    elForm.addEventListener('submit', (e) => {
      // TODO : avoid duplication of email backend or frontend
      e.preventDefault();
      const formData = new FormData(elForm);
      if (formData.get('password') === formData.get('password-confirmation')) {
        axios.post(`http://localhost:${process.env.BACKEND_PORT}/user/register`, {
          firstname: formData.get('firstname'),
          lastname: formData.get('lastname'),
          email: formData.get('email'),
          password: formData.get('password')
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(() => {
            window.location.href = '/';
          })
          .catch(() => {
            this.errorInfos();
          });
      }
    });
  }

  eventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      const elForm = document.querySelector('.register-form');
      const elPassword = document.querySelector('#password');
      const elConfirmationPassword = document.querySelector('#confirmation-password');
      const elPasswordToggler = document.querySelector('.password-toggler');
      const elConfirmationPasswordToggler = document.querySelector('.confirmation-password-toggler');

      elPasswordToggler.addEventListener('click', () => {
        if (elPassword.type === 'password') {
          elPassword.type = 'text';
        } else {
          elPassword.type = 'password';
        }
      });
      elConfirmationPasswordToggler.addEventListener('click', () => {
        if (elConfirmationPassword.type === 'password') {
          elConfirmationPassword.type = 'text';
        } else {
          elConfirmationPassword.type = 'password';
        }
      });
      this.formSubmit(elForm);
    });
  }

  errorInfos() {
    document.querySelector('.error-message').innerHTML = 'An account already exists with this email. Try log in!';
  }

  render() {
    return `
        ${viewNav()}
        ${viewRegister()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
    this.eventListeners();
  }
};

export default Register;
