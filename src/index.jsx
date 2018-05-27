"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as angular from 'angular';
var React = require("react");
var ReactDOM = require("react-dom");
require("./index.css");
require("bootstrap/dist/css/bootstrap.css");
var RamaComponent_1 = require("./RamaComponent");
window.renderRamaComp = window.renderRamaComp || {};
window.renderRamaComp = function (element, pdbId, chainsToShow, modelsToShow) {
    ReactDOM.render(<RamaComponent_1.default pdbid={pdbId} chainstoshow={chainsToShow} modelstoshow={modelsToShow} element={element}/>, element);
};
