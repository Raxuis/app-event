import viewNav from '../views/nav';
import viewDashboard from '../views/dashboard';

const Home = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;

    this.run();
  }

  render() {
    return `
    ${viewNav()}
    ${viewDashboard()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
  }
};

export default Home;
