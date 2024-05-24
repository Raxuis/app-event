import axios from 'axios';
import viewNav from '../views/nav';
import viewAccount from '../views/account';
import renderToastr from '../utils/toastr/renderToastr';

const Account = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.isLogged = localStorage.getItem('isLogged');

    this.run();
  }

  async getUserInfos() {
    const id = localStorage.getItem('id');
    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/user/${id}`);
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

  async render() {
    const userInfos = await this.getUserInfos();
    this.el.innerHTML = `
      ${viewNav(this.isLogged)}
      ${viewAccount(userInfos)}
    `;
  }

  emailVerify(email) {
    const emailSpan = document.querySelector('.email-account-span');
    email.addEventListener('input', (e) => {
      if (!e.target.value.match(this.emailRegex)) {
        emailSpan.innerHTML = 'Email is not valid';
      } else {
        emailSpan.innerHTML = '';
      }
    });
  }

  passwordVerif(password, passwordConfirmation) {
    const passwordSpan = document.querySelector('.password-account-span');
    const confirmationSpan = document.querySelector('.confirmation-account-span');
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
        passwordSpan.innerHTML = "Passwords don't match";
        confirmationSpan.innerHTML = "Passwords don't match";
      } else {
        passwordSpan.innerHTML = '';
        confirmationSpan.innerHTML = '';
      }
    });
  }

  eventListeners() {
    const elPassword = document.querySelector('#new-account-password');
    const elConfirmationPassword = document.querySelector('#new-password-account-confirmation');
    const elPasswordToggler = document.querySelector('.password-account-toggler');
    const elConfirmationPasswordToggler = document.querySelector('.confirmation-password-account-toggler');
    const emailInput = document.querySelector('.email-account-input');
    const elForm = document.querySelector('.account-form');

    if (elPasswordToggler) {
      elPasswordToggler.addEventListener('click', () => {
        elPassword.type = elPassword.type === 'password' ? 'text' : 'password';
      });
    }

    if (elConfirmationPasswordToggler) {
      elConfirmationPasswordToggler.addEventListener('click', () => {
        elConfirmationPassword.type = elConfirmationPassword.type === 'password' ? 'text' : 'password';
      });
    }
    this.emailVerify(emailInput);
    this.passwordVerif(elPassword, elConfirmationPassword);
    this.formSubmit(elForm);
  }

  formSubmit(elForm) {
    elForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const errorText = document.querySelector('.error-account-message');
      const formData = new FormData(elForm);
      if (formData.get('password') === formData.get('password-confirmation') && formData.get('password').length >= 8 && formData.get('password-confirmation').length >= 8 && formData.get('firstname') && formData.get('lastname') && formData.get('email')) {
        axios.put(`http://localhost:${process.env.BACKEND_PORT}/user`, {
          id: parseInt(localStorage.getItem('id'), 10),
          firstname: formData.get('firstname'),
          lastname: formData.get('lastname'),
          email: formData.get('email'),
          password: formData.get('password')
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('id', response.data.id);
            window.location.href = '/';
            renderToastr('success', 'Success', 'Your account has been updated!');
          })
          .catch((error) => {
            errorText.innerHTML = error.message;
            renderToastr('error', 'Error', error.message);
          });
      } else {
        errorText.innerHTML = 'Please fill in all the fields';
      }
    });
  }

  async run() {
    await this.render();
    this.eventListeners();
    this.navFunction();
  }
};

export default Account;
