import './index.css';
import 'moment/locale/zh-cn';

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

moment.locale('zh-cn');

ReactDOM.render((
  <LocaleProvider locale={zh_CN}>
    <App />
  </LocaleProvider>
),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
