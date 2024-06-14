import axios from 'axios';
import Cookies from 'js-cookie';
import viewNav from '../../views/components/nav';
import viewLogin from '../../views/user/login';
import navFunction from '../../utils/navbar/navFunction';

const Login = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.userId = null;
    this.run();
  }

  eventListeners() {
    const password = document.querySelector('.password-login');
    const passwordToggler = document.querySelector('.password-toggler-login');

    passwordToggler.addEventListener('click', () => {
      if (password.type === 'password') {
        password.type = 'text';
      } else {
        password.type = 'password';
      }
    });

    const form = document.querySelector('.login-form');
    const loginButton = document.querySelector('.login-button');
    const errorMessage = document.querySelector('.error-message-login');

    const formSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const emailValue = formData.get('email');
      const passwordValue = formData.get('password');
      if (emailValue && passwordValue) {
        axios.post(`http://localhost:${process.env.BACKEND_PORT}/auth`, {
          email: emailValue,
          password: passwordValue
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            const { data } = response;
            if (data.PHP_SESSID) {
              Cookies.set('PHP_SESSID', data.PHP_SESSID, { expires: 1 });
              window.location.href = '/';
            } else {
              errorMessage.innerHTML = 'Unauthorized access. Please login again.';
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
    };

    loginButton.addEventListener('click', formSubmit);
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        formSubmit(e);
      }
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
    navFunction();
  }
};

export default Login;
