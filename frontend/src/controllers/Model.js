import viewNav from '../views/nav';

const Model = class {
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
    <div class="container mx-auto flex flex-col items-center justify-center h-screen">
      <h1 class="text-5xl font-bold text-center">Model n°${this.params}</h1>
    </div>
    `;
  }

  run() {
    this.el.innerHTML = this.render();
    this.navFunction();
  }
};

export default Model;
