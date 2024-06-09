import Router from './Router';
import Home from './controllers/Home';
import Login from './controllers/User/Login';
import Logout from './controllers/User/Logout';
import Register from './controllers/User/Register';
import MyEvents from './controllers/Event/MyEvents';
import Models from './controllers/EventCreation/Models';
import Account from './controllers/User/Account';
import './index.css';

// Private routes require to be connected
// LogInRoute Routes require to not be connected
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
