import viewNav from '../views/nav';
import viewRegister from '../views/register';

const Register = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;

    this.run();
  }

  render() {
    return `
        ${viewNav()}
        ${viewRegister()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
  }
};

export default Register;
