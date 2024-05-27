import Cookies from 'js-cookie';
import viewNav from '../views/nav';

const Logout = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  navFunction() {
    const btn = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  logOutUser() {
    Cookies.remove('PHP_SESSID');
    window.location.href = '/';
  }

  render() {
    return `
        ${viewNav()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
    this.logOutUser();
    this.navFunction();
  }
};

export default Logout;
