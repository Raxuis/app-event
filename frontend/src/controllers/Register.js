import axios from 'axios';
import viewNav from '../views/nav';
import viewRegister from '../views/register';

const Register = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.run();
  }

  passwordVerif(password, passwordConfirmation) {
    const passwordSpan = document.querySelector('.password-span');
    const confirmationSpan = document.querySelector('.confirmation-span');
    password.addEventListener('input', (e) => {
      if (e.target.value.length < 8) {
        passwordSpan.innerHTML = 'Password must be at least 8 characters';
      } else {
        passwordSpan.innerHTML = '';
      }
    });
    passwordConfirmation.addEventListener('input', (e) => {
      if (e.target.value.length < 8) {
        confirmationSpan.innerHTML = 'Password must be at least 8 characters';
      } else if (password.value !== passwordConfirmation.value) {
        passwordSpan.innerHTML = "Password don't match";
        confirmationSpan.innerHTML = "Password don't match";
      } else {
        passwordSpan.innerHTML = '';
        confirmationSpan.innerHTML = '';
      }
    });
  }

  emailVerify(email) {
    const emailSpan = document.querySelector('.email-span');
    email.addEventListener('input', (e) => {
      if (!e.target.value.match(this.emailRegex)) {
        emailSpan.innerHTML = 'Email is not valid';
      } else {
        emailSpan.innerHTML = '';
      }
    });
  }

  formSubmit(elForm) {
    elForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elForm);
      if (formData.get('password') === formData.get('password-confirmation') && formData.get('password').length > 8 && formData.get('password-confirmation').length > 8) {
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
      const emailInput = document.querySelector('.email-input');

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
      this.emailVerify(emailInput);
      this.passwordVerif(elPassword, elConfirmationPassword);
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
