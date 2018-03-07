import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import Menu from './Menu';
import 'bootstrap/dist/css/bootstrap.css';
import RamaData from './RamaScatter';
import { CompMenu } from './CompMenu';
import * as d3 from 'd3';

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
    <div id={'rama-component'} />, document.getElementById('header') as HTMLElement
);
let residueColorStyle = 1;
let contourColoringStyle = 1;
let ramaContourPlotType = 1;

function renderRamaComp(residueColorStyle: number, contourColoringStyle: number, ramaContourPlotType: number) {
    ReactDOM.render(
        <RamaData
            width={473}
            height={473}
            pdbID={'1tqn'}
            chainsToShow={['A']}
            modelsToShow={[1]}
            residueColorStyle={residueColorStyle}
            contourColoringStyle={contourColoringStyle}
            ramaContourPlotType={ramaContourPlotType}
        />,
        document.getElementById('rama-component') as HTMLElement
    );
}
renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);
registerServiceWorker();
ReactDOM.render(
    <CompMenu/>, document.getElementById('rama-settings') as HTMLElement
);
let rdb: any = document.getElementById('contour-color-default');
rdb.checked = 'true';
d3.select('#rama-coloring').on('change', function () {
    residueColorStyle = Number(d3.select(this).property('value'));
    renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);
});
d3.select('#rama-plot-type').on('change', function () {
    ramaContourPlotType = Number(d3.select(this).property('value'));
    renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);
});
d3.selectAll('input[name=contour-style]').on('change', function () {
    contourColoringStyle = Number(d3.select(this).property('value'));
    renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);
});
// ReactDOM.render(
//   <RamaData pdbID={'4d10'} width={500} height={500}/>,
//   document.getElementById('root') as HTMLElement
// );
// registerServiceWorker();