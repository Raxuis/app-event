import view404 from '../views/error404';

const PageNotFound = class {
  constructor() {
    this.el = document.querySelector('#root');

    this.run();
  }

  render() {
    return `
       ${view404()}
    `;
  }

  run() {
    this.el.innerHTML = this.render();
  }
};

export default PageNotFound;
