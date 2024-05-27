/* eslint-disable no-console */
import axios from 'axios';
import Cookies from 'js-cookie';
import viewNav from '../views/nav';
import viewLogin from '../views/login';

const Login = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.userId = null;
    this.run();
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  eventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      const password = document.querySelector('#password');
      const passwordToggler = document.querySelector('.password-toggler');
      passwordToggler.addEventListener('click', () => {
        if (password.type === 'password') {
          password.type = 'text';
        } else {
          password.type = 'password';
        }
      });
    });
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('login-form');
      const loginButton = document.querySelector('#login-button');
      const errorMessage = document.querySelector('.error-message');

      loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        if (formData.get('password') && formData.get('email')) {
          axios.post(`http://localhost:${process.env.BACKEND_PORT}/auth`, {
            email: formData.get('email'),
            password: formData.get('password')
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then((response) => {
              const { data } = response;
              if (data.PHP_SESSID) {
                Cookies.set('PHP_SESSID', data.PHP_SESSID, { expires: 2 });
                window.location.href = '/';
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 401) {
                errorMessage.innerHTML = 'Unauthorized access. Please login again.';
              } else {
                errorMessage.innerHTML = error.response ? error.response.data.message : 'An error occurred';
              }
            });
        } else {
          errorMessage.innerHTML = 'Email and password are required';
        }
      });
    });
  }

  render() {
    return `
        ${viewNav(this.userId)}
        ${viewLogin()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
    this.eventListeners();
    this.navFunction();
  }
};

export default Login;
