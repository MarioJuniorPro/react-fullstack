import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';
import axios from 'axios'
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('#root')
);

console.log('STRIPE KEY: ', process.env.REACT_APP_STRIPE_KEY)
console.log('Environment: ', process.env.NODE_ENV)


// const survey = {
//   title: 'MY Title',
//   subject: 'subjects',
//   recipients: ['necrower@gmail.com', '2383d98f8a-cdb2b3@inbox.mailtrap.io'],
//   body: 'BODYYY'
// }

// axios.post('/api/surveys')
