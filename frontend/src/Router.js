import axios from 'axios';
import Cookies from 'js-cookie';
import PageNotFound from './controllers/404';

const Router = class {
  constructor(routes = []) {
    this.path = window.location.pathname;
    this.params = !window.location.search ? {} : Object.fromEntries(
      window.location.search
        .split('?')[1]
        .split('&')
        .map((param) => param.split('='))
    );
    this.routes = routes;
    this.getUserId();
    this.run();
  }

  async getUserId() {
    const sessionId = Cookies.get('PHP_SESSID');

    if (!sessionId) {
      this.userId = null;
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/auth/${sessionId}`);
      this.userId = response.data.user_id;
    } catch (e) {
      this.userId = null;
    }
  }

  startController() {
    let ifExist = false;

    for (let i = 0; i < this.routes.length; i += 1) {
      const route = this.routes[i];

      if (route.url === this.path) {
        if (route.logInRoute) {
          if (this.userId !== null) {
            window.location.href = '/';
            break;
          }
        }
        if (route.private) {
          if (this.userId === null) {
            window.location.href = '/login';
            break;
          }
        }
        const Controller = route.controller;
        new Controller(this.params);
        ifExist = true;
        break;
      }
    }

    if (!ifExist) {
      new PageNotFound();
    }
  }

  run() {
    this.startController();
  }
};

export default Router;
