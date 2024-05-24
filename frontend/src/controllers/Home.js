import viewNav from '../views/nav';
import viewHome from '../views/home';

const Home = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.isLogged = localStorage.getItem('isLogged');

    this.run();
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  render() {
    return `
    ${viewNav(this.isLogged)}
    ${viewHome(this.isLogged)}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
    this.navFunction();
  }
};

export default Home;
