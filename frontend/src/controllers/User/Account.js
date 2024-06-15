import axios from 'axios';
import Cookies from 'js-cookie';
import viewNav from '../../views/components/nav';
import viewAccount from '../../views/user/account';
import renderToastr from '../../utils/toastr/renderToastr';
import navFunction from '../../utils/navbar/navFunction';
import getUserId from '../../utils/getters/getUserId';
import getById from '../../utils/getters/getById';
import passwordVerif from '../../utils/forms/password/passwordVerify';
import redirectionWithTimeout from '../../utils/navigation/redirectionWithTimeout';

const Account = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.init();
  }

  async init() {
    this.userId = await getUserId();
    await this.run();
  }

  async render() {
    const userInfos = await getById('user', this.userId);
    this.el.innerHTML = `
      <div class="w-screen h-screen flex flex-col">
        ${viewNav(this.userId)}
        <div class="flex-grow flex items-center justify-center">
          ${viewAccount(userInfos)}
        </div>
      </div>
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

  eventListeners() {
    const elPassword = document.querySelector('.new-account-password');
    const elConfirmationPassword = document.querySelector('.new-password-account-confirmation');
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
    passwordVerif(elPassword, elConfirmationPassword, '-account');
    this.formSubmit(elForm);
  }

  formSubmit(elForm) {
    elForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const errorText = document.querySelector('.error-account-message');
      const formData = new FormData(elForm);
      const password = formData.get('password');
      const passwordConfirmation = formData.get('password-confirmation');
      const firstname = formData.get('firstname');
      const lastname = formData.get('lastname');
      const email = formData.get('email');

      if (
        password === passwordConfirmation
        && password.length >= 8
        && firstname
        && lastname
        && email
      ) {
        axios.put(`http://localhost:${process.env.BACKEND_PORT}/user`, {
          id: this.userId,
          firstname,
          lastname,
          email,
          password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            const { data } = response;
            if (data.session_id) {
              Cookies.set('PHP_SESSID', data.session_id, { expires: 1 });
              renderToastr('success', 'Success', 'Your account has been updated!');
              redirectionWithTimeout('/', 3000);
            }
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
    navFunction();
  }
};

export default Account;
