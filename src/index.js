Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
require("./index.css");
require("bootstrap/dist/css/bootstrap.css");
var RamaComponent_1 = require("./RamaComponent");

let renderPlot = function(pdbid, chainsToShow, modelsToShow) {
    ReactDOM.render(React.createElement(RamaComponent_1.default, { pdbid: pdbid, chainstoshow: chainsToShow, modelstoshow: modelsToShow }), document.getElementById('rama-root'));
}
exports.renderPlot = renderPlot;