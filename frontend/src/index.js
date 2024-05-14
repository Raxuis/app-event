import Router from './Router';
import Home from './controllers/Home';
import Login from './controllers/Login';
import Register from './controllers/Register';
import './index.css';
import Models from './controllers/AllModels';

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
    url: '/models',
    controller: Models
  }
];
new Router(routes);
