import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import RamaData from './Test';
import data from './data';

ReactDOM.render(
  <RamaData pdbID={'4d10'} width={500} height={500} data={data}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();