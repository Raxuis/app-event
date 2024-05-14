import viewNav from '../views/nav';
import viewLogin from '../views/login';

const Login = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
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
  }

  render() {
    return `
        ${viewNav()}
        ${viewLogin()}
    `;
  }

  run() {
    // document.addEventListener('DOMContentLoaded', () => {
    // const loginButton = document.querySelector('#login-button');
    // const emailInput = document.querySelector('input[name="email"]');
    // const passwordInput = document.querySelector('input[name="password"]');

    // loginButton.addEventListener('click', () => {
    //   const email = emailInput.value.trim();
    //   const password = passwordInput.value.trim();

    //   if (email && password) {
    //     const loginData = { email, password };

    //     axios.post(`http://localhost:${process.env.LOCALHOST_PORT}/user/login`, {
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(loginData)
    //     })
    //       .then((response) => {
    //         if (response.ok) {
    //           return response.json();
    //         }
    //         throw new Error(response.statusText);
    //       })
    //       .then((data) => {
    //         console.log(data);
    //       })
    //       .catch((error) => {
    //         console.error(error.message);
    //       });
    //   } else {
    //     console.error('Email and password are required');
    //   }
    // });

    this.el.innerHTML = this.render();
    this.eventListeners();
  }
};

export default Login;
