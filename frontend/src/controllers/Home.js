import viewNav from '../views/components/nav';
import viewHome from '../views/home';
import navFunction from '../utils/navbar/navFunction';
import getUserId from '../utils/getters/getUserId';

const Home = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;

    this.run();
  }

  render() {
    return `
    ${viewNav(this.userId)}
    ${viewHome(this.userId)}
    `;
  }

  async run() {
    this.userId = await getUserId();
    this.el.innerHTML = this.render();
    navFunction();
  }
};

export default Home;
