import Router from './Router';
import Home from './controllers/Home';
import Login from './controllers/Login';
import Register from './controllers/Register';
import MyEvents from './controllers/MyEvents';
import './index.css';
import Models from './controllers/Models';
// import Model from './controllers/Model';

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
  },
  {
    url: '/my-events',
    controller: MyEvents
  }
  /* ,
  {
    url: '/model/:id',
    controller: Model
  } */
];
new Router(routes);
