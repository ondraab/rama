import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import RamaData  from './RamaScatter';

// class Index extends React.Component {
//     render() {
//         let options = [
//             { label: 'CSS', value: 'css' },
//             { label: 'HTML', value: 'html' },
//             { label: 'JavaScript', value: 'js' },
//             { label: 'Ruby on Rails', value: 'ror' },
//         ];
//
//         let selectFieldName = 'mySelect';
//         let selectPlaceHolder = 'Choose some options...';
//         let onChange = function (obj: any) {
//             console.log('EVENT', obj.event);
//             console.log('ITEM', obj.item);
//             console.log('VALUE', obj.value);
//         };
//         return ();
//     }
// }
//
// ReactDOM.render(<Index/>, document.getElementById('menu') as HTMLElement);
// registerServiceWorker();

ReactDOM.render(
  <RamaData pdbID={'4d10'} width={500} height={500}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();