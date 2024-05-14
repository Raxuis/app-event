import Router from './Router';
import Home from './controllers/Home';
import Login from './controllers/Login';
import Register from './controllers/Register';
import './index.css';
import Dashboard from './controllers/Dashboard';

const routes = [
  {
    url: '/',
    controller: Home
  },
  {
    url: '/login',
    controller: Login
  },
  {
    url: '/register',
    controller: Register
  },
  {
    url: '/dashboard',
    controller: Dashboard
  }
];
new Router(routes);
