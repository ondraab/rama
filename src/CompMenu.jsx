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
var React = require("react");
var CompMenu = /** @class */ (function (_super) {
    __extends(CompMenu, _super);
    function CompMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CompMenu.prototype.render = function () {
        // const ramanPlot = (
        //     <RamaData
        //         pdbID={this.state.inputValue}
        //         width={473}
        //         height={473}
        //         ramaContourPlotType={this.state.typeOfPlot}
        //         chainsToShow={this.state.chainsToShow}
        //         contourColoringStyle={this.state.contourType}
        //         modelsToShow={this.state.modelsToShow}
        //         residueColorStyle={this.state.coloring}
        //     />
        // );
        //
        //     const settings = (
        //         d3.select('#rama-svg-container').append('div')
        //         .attr('width', '100%')
        //         .attr('id', 'rama-settings')
        //         .attr('border-top', '1px solid black')
        //         .attr('background-color', '#DCECD7')
        //         .append('select').attr('id', 'rama-coloring').append('option').attr('label', 'Default')
        //         .text('Default');
        //
        //     d3.select('#rama-coloring')
        //         .append('option').attr('label', 'Quality')
        //         .text('Quality');
        //     d3.select('#rama-coloring')
        //         .append('option').attr('label', 'RSRZ')
        //         .text('RSRZ');
        //
        //     d3.select('#rama-settings')
        //         .append('select').attr('id', 'rama-plot-type').append('option').attr('label', 'General case')
        //         .text('General case');
        //
        //     d3.select('#rama-plot-type')
        //         .append('option').attr('label', 'Isoleucine and valine')
        //         .text('Isoleucine and valine');
        //
        //     d3.select('#rama-plot-type')
        //         .append('option').attr('label', 'Pre-proline')
        //         .text('Pre-proline');
        //
        //     d3.select('#rama-plot-type')
        //         .append('option').attr('label', 'Glycine')
        //         .text('Glycine');
        //
        //     d3.select('#rama-plot-type')
        //         .append('option').attr('label', 'Trans proline')
        //         .text('Trans proline');
        //
        //     d3.select('#rama-plot-type')
        //         .append('option').attr('label', 'Cis proline')
        //         .text('Cis proline');
        //
        //     d3.select('#rama-settings')
        //         .append('form').attr('id', 'rama-contour-style')
        //         .append('label').attr('class', 'rama-contour-style')
        //         .text('Contour').append('input').attr('type', 'radio').attr('name', 'contour-style')
        //         .attr('id', 'rama-contour-radio');
        //
        //     d3.select('#rama-contour-style')
        //         .append('label').attr('class', 'rama-contour-style')
        //         .text('Heat Map').append('input').attr('type', 'radio').attr('name', 'contour-style')
        //         .attr('id', 'rama-contour-radio');
        // )
        return (<div>
                <select id={'rama-coloring'}>
                    <option value={1}>
                        Default
                    </option>
                    <option value={2}>
                        Quality
                    </option>
                    <option value={3}>
                        RSRZ
                    </option>
                </select>
                <select id={'rama-plot-type'}>
                    <option value={1}>
                        General case
                    </option>
                    <option value={2}>
                        Isoleucine and valine
                    </option>
                    <option value={3}>
                        Pre-proline
                    </option>
                    <option value={4}>
                        Glycine
                    </option>
                    <option value={5}>
                        Trans proline
                    </option>
                    <option value={6}>
                        Cis proline
                    </option>
                </select>
                <form id={'rama-contour-style'}>
                    <label className={'rama-contour-style'}>
                        Contour
                        <input type={'radio'} name={'contour-style'} className={'rama-contour-radio'} id={'contour-color-default'} value={1} defaultChecked={true}/>
                    </label>
                    <label className={'rama-contour-style'}>
                        Heat Map
                        <input type={'radio'} name={'contour-style'} className={'rama-contour-radio'} value={2} id={'contour-color'}/>
                    </label>
                </form>
            </div>);
    };
    return CompMenu;
}(React.Component));
exports.CompMenu = CompMenu;
