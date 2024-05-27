import Router from './Router';
import Home from './controllers/Home';
import Login from './controllers/Login';
import Logout from './controllers/Logout';
import Register from './controllers/Register';
import MyEvents from './controllers/MyEvents';
import Models from './controllers/Models';
import Account from './controllers/Account';
import './index.css';

const routes = [
  {
    url: '/',
    controller: Home
  },
  {
    url: '/login',
    controller: Login,
    logInRoute: true
  },
  {
    url: '/register',
    controller: Register,
    logInRoute: true
  },
  {
    url: '/logout',
    controller: Logout,
    private: true
  },
  {
    url: '/models',
    controller: Models,
    private: true
  },
  {
    url: '/my-events',
    controller: MyEvents,
    private: true
  },
  {
    url: '/account',
    controller: Account,
    private: true
  }
];
new Router(routes);
