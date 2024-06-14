import axios from 'axios';
import viewNav from '../../views/components/nav';
import viewRegister from '../../views/user/register';
import renderToastr from '../../utils/toastr/renderToastr';
import navFunction from '../../utils/navbar/navFunction';
import passwordVerif from '../../utils/forms/password/passwordVerify';
import errorInfos from '../../utils/forms/errors/errorInfos';

const Register = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.userId = null;
    this.run();
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
    const handleSubmit = async (e) => {
      e.preventDefault();
      const elError = document.querySelector('.error-message-register');
      const formData = new FormData(elForm);
      if (formData.get('email')) {
        if (formData.get('password') === formData.get('password-confirmation') && formData.get('password').length >= 8 && formData.get('password-confirmation').length >= 8 && formData.get('firstname') && formData.get('lastname')) {
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
            .then((res) => {
              if (res.status === 200) {
                renderToastr('success', 'Success', 'Your account has been created!');
                window.location.href = '/';
              } else {
                renderToastr('error', 'Error', 'An error occurred, try again!');
              }
            })
            .catch((error) => {
              errorInfos(elError, error.response.data.message);
            });
        }
      } else {
        errorInfos(elError, 'Email must be provided!');
      }
    };

    elForm.addEventListener('submit', handleSubmit);

    elForm.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
    });
  }

  eventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      const elForm = document.querySelector('.register-form');
      const elPassword = document.querySelector('.password');
      const elConfirmationPassword = document.querySelector('.confirmation-password');
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
      passwordVerif(elPassword, elConfirmationPassword);
      this.formSubmit(elForm);
    });
  }

  render() {
    return `
        ${viewNav(this.userId)}
        ${viewRegister()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
    this.eventListeners();
    navFunction();
  }
};

export default Register;
