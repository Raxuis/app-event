import viewNav from '../views/nav';
import viewLogin from '../views/login';

const Login = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  render() {
    return `
        ${viewNav()}
        ${viewLogin()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
  }
};

export default Login;
