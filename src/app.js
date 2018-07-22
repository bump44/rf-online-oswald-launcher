import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Root from './containers/Root';

moment.locale('ru');
console.log(process.env);
ReactDOM.render((
  <Root />
), document.getElementById('appMount'));
