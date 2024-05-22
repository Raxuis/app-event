import axios from 'axios';
import viewNav from '../views/nav';
import viewAccount from '../views/account';

const Account = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
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

    this.passwordVerif(elPassword, elConfirmationPassword);
  }

  async run() {
    await this.render();
    this.eventListeners();
    this.navFunction();
  }
};

export default Account;
