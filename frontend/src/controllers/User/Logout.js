import Cookies from 'js-cookie';

const Logout = class {
  constructor(params) {
    this.el = document.querySelector('#root');
    this.params = params;
    this.run();
  }

  logOutUser() {
    Cookies.remove('PHP_SESSID');
    window.location.href = '/';
  }

  run() {
    this.logOutUser();
  }
};

export default Logout;
