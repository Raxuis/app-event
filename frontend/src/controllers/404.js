import viewNav from '../views/nav';

const PageNotFound = class {
  constructor() {
    this.el = document.querySelector('#root');

    this.run();
  }

  render() {
    return `
        ${viewNav()}
        <div class="py-18">
          <h1>404</h1>
          <h2>Page not found</h2>
        </div>
    `;
  }

  run() {
    this.el.innerHTML = this.render();
  }
};

export default PageNotFound;
