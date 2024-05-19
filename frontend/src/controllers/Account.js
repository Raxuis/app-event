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
      // eslint-disable-next-line no-console
      console.log(response.data);
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
    return `
      ${viewNav(this.isLogged)}
      ${viewAccount(userInfos)}
    `;
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

  // formSubmit(elForm) {
  //   elForm.addEventListener('submit', (e) => {
  //     e.preventDefault();
  //     const formData = new FormData(elForm);
  // eslint-disable-next-line max-len
  //     if (formData.get('password') === formData.get('password-confirmation') && formData.get('password').length >= 8 && formData.get('password-confirmation').length >= 8) {
  //       axios.put(`http://localhost:${process.env.BACKEND_PORT}/user/register`, {
  //         firstname: formData.get('firstname'),
  //         lastname: formData.get('lastname'),
  //         email: formData.get('email'),
  //         password: formData.get('password')
  //       }, {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       })
  //         .then(() => {
  //           window.location.href = '/';
  //         })
  //         .catch(() => {
  //           this.errorInfos();
  //         });
  //     }
  //   });
  // }

  eventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      const elForm = document.querySelector('.register-form');
      const elPassword = document.querySelector('#new-password');
      const elConfirmationPassword = document.querySelector('#new-confirmation-password');
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
      this.passwordVerif(elPassword, elConfirmationPassword);
      this.formSubmit(elForm);
    });
  }

  errorInfos() {
    document.querySelector('.error-message').innerHTML = 'An account already exists with this email. Try log in!';
  }

  async run() {
    this.el.innerHTML = await this.render();
    this.navFunction();
  }
};

export default Account;
