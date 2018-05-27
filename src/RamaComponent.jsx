"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var React = require("react");
var ReactDOM = require("react-dom");
require("./index.css");
var RamaScatter_1 = require("./RamaScatter");
var RamaComopnent = /** @class */ (function (_super) {
    __extends(RamaComopnent, _super);
    function RamaComopnent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            chainsToShow: _this.props.chainstoshow,
            contourColoringStyle: 1,
            element: _this.props.element,
            modelsToShow: _this.props.modelstoshow,
            pdbID: _this.props.pdbid,
            ramaContourPlotType: 1,
            residueColorStyle: 1
        };
        return _this;
    }
    RamaComopnent.prototype.componentDidMount = function () {
        var _a = this.state, residueColorStyle = _a.residueColorStyle, contourColoringStyle = _a.contourColoringStyle, ramaContourPlotType = _a.ramaContourPlotType;
        var _b = this.state, pdbID = _b.pdbID, chainsToShow = _b.chainsToShow, modelsToShow = _b.modelsToShow, element = _b.element;
        function renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType) {
            ReactDOM.render(<RamaScatter_1.default width={473} height={473} pdbID={pdbID} chainsToShow={chainsToShow} modelsToShow={modelsToShow} residueColorStyle={residueColorStyle} contourColoringStyle={contourColoringStyle} ramaContourPlotType={ramaContourPlotType} element={element}/>, element);
        }
        renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);
        setTimeout(function () {
            d3.select('#rama-coloring').on('change', function () {
                residueColorStyle = Number(d3.select(this).property('value'));
                renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });
            d3.select('#rama-plot-type').on('change', function () {
                ramaContourPlotType = Number(d3.select(this).property('value'));
                renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });
            d3.selectAll('input[name=contour-style]').on('change', function () {
                contourColoringStyle = Number(d3.select(this).property('value'));
                renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });
        }, 50);
    };
    RamaComopnent.prototype.render = function () {
        return (<div />);
    };
    return RamaComopnent;
}(React.Component));
exports.default = RamaComopnent;
//
// import * as React from 'react';
//
// const MyComponent = () => (
//     <div>
//         MyComponent!!!
//     </div>
// );
//
// export default MyComponent;
