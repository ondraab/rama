// import * as angular from 'angular';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {default as RamaComopnent} from './RamaComponent';
// import { react2angular } from 'react2angular';
// angular
//     .module('app', [])
//     .component('ramachandranComponent', react2angular(RamaComponent, ['pdbid', 'chainstoshow', 'modelstoshow']));

declare global {
    interface Window { renderRamaComp: any; }
}

window.renderRamaComp = window.renderRamaComp || {};

window.renderRamaComp = function(element: HTMLElement, pdbId: string, chainsToShow: string[], modelsToShow: number[]) {
    ReactDOM.render(
        <RamaComopnent
            pdbid={pdbId}
            chainstoshow={chainsToShow}
            modelstoshow={modelsToShow}
            element={element}
        />,
        element);
};