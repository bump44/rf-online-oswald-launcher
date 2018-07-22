import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Root from './containers/Root';

moment.locale('ru');

ReactDOM.render((
  <Root />
), document.getElementById('appMount'));
