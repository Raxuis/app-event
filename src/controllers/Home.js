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
    <div class="flex flex-col">
        ${viewNav()}
        ${viewHome()}
    </div>
    `;
  }

  run() {
    this.el.innerHTML = this.render();
  }
};

export default Home;
