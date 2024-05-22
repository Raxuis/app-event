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

    this.run();
  }

  startController() {
    let ifExist = false;

    for (let i = 0; i < this.routes.length; i += 1) {
      const route = this.routes[i];

      if (route.url === this.path) {
        if (route.logInRoute) {
          const isLogged = localStorage.getItem('isLogged');

          if (isLogged) {
            window.location.href = '/';
            break;
          }
        }
        if (route.private) {
          const username = localStorage.getItem('isLogged');

          if (!username) {
            window.location.href = '/';
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
