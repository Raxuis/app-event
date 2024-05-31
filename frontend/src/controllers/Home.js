import axios from 'axios';
import Cookies from 'js-cookie';
import viewNav from '../views/components/nav';
import viewHome from '../views/home';

const Home = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;

    this.run();
  }

  async getUserId() {
    const sessionId = Cookies.get('PHP_SESSID');

    if (!sessionId) {
      this.userId = null;
      return;
    }

    try {
      const response = await axios.get(`http://localhost:${process.env.BACKEND_PORT}/auth/${sessionId}`);
      this.userId = response.data.user_id;
    } catch (e) {
      this.userId = null;
    }
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
    ${viewNav(this.userId)}
    ${viewHome(this.userId)}
    `;
  }

  async run() {
    await this.getUserId();
    this.el.innerHTML = this.render();
    this.navFunction();
  }
};

export default Home;
