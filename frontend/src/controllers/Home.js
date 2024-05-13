import viewNav from '../views/nav';
import viewHome from '../views/home';

const Home = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;

    this.run();
  }

  render() {
    return `
    ${viewNav()}
    ${viewHome()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
  }
};

export default Home;
