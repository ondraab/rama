import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import RamaData from './Test';

ReactDOM.render(
  <RamaData pdbID={'4d10'}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
