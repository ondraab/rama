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
require("bootstrap/less/bootstrap.less");
var react_bootstrap_1 = require("react-bootstrap");
var RamaScatter_1 = require("./RamaScatter");
var parsePDB_1 = require("./parsePDB");
require("react-bootstrap-typeahead/css/Typeahead.css");
var ToggleButtonGroup = require("react-bootstrap/lib/ToggleButtonGroup");
var ToggleButton = require("react-bootstrap/lib/ToggleButton");
var ButtonGroup = require("react-bootstrap/lib/ButtonGroup");
var FilterComponent = /** @class */ (function (_super) {
    __extends(FilterComponent, _super);
    function FilterComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showFilter: false,
            inputValue: '1tqn',
            buttonClicked: false,
            buttonState: 'disabled',
            jsonObject: [],
            typeOfPlot: 1,
            chainsToShow: ['A'],
            contourType: 1,
            modelsToShow: [1],
            coloring: 1,
        };
        _this.chains = [];
        _this.input = '';
        _this.handlePlotTypeDropdownClick = _this.handlePlotTypeDropdownClick.bind(_this);
        _this.handleDrawTypeDropdownClick = _this.handleDrawTypeDropdownClick.bind(_this);
        var pdb = new parsePDB_1.default(_this.state.inputValue);
        pdb.downloadAndParse();
        _this.parsedPDB = pdb.residueArray;
        _this.chains = pdb.chainsArray;
        _this.models = pdb.modelArray;
        _this.rsrz = pdb.rsrz;
        _this.outliersType = pdb.outlDict;
        return _this;
    }
    FilterComponent.prototype.updateInputValue = function (evt) {
        this.input = evt.target.value;
        if (this.state.buttonClicked === true) {
            this.setState({
                buttonClicked: false,
                jsonObject: []
            });
        }
    };
    FilterComponent.prototype.getValidationState = function () {
        var length = this.state.inputValue.length;
        if (length !== 4) {
            return 'error';
        }
        return 'success';
    };
    // public returnState() {
    //     if (this.state.buttonClicked === true && this.state.inputValue.length === 4) {
    //         this.down();
    //         return this.state.inputValue;
    //     }
    //     return '';
    // }
    FilterComponent.prototype.down = function () {
        this.chains = [];
        var pdb = new parsePDB_1.default(this.input);
        pdb.downloadAndParse();
        this.parsedPDB = pdb.residueArray;
        this.chains = pdb.chainsArray;
        this.models = pdb.modelArray;
        this.outliersType = pdb.outlDict;
        this.rsrz = pdb.rsrz;
        this.setState({
            inputValue: this.input,
            chainsToShow: this.chains,
            jsonObject: this.parsedPDB,
            modelsToShow: this.models,
        }, function () {
            // this.chains = [];
            // let pdb = new ParsePDB(this.state.inputValue);
            // this.parsedPDB = pdb.downloadAndParse();
            // this.chains = pdb.chainsArray;
        });
    };
    FilterComponent.prototype.chainFilter = function (selected) {
        this.setState({
            chainsToShow: selected
        });
    };
    FilterComponent.prototype.entityFilter = function (selected) {
        this.setState({
            modelsToShow: selected
        });
    };
    FilterComponent.prototype.handlePlotTypeDropdownClick = function (key) {
        this.setState({
            typeOfPlot: key,
        });
    };
    FilterComponent.prototype.handleDrawTypeDropdownClick = function (key) {
        this.setState({
            coloring: key,
        });
    };
    FilterComponent.prototype.handleTypeChange = function (value) {
        this.setState({
            contourType: value,
        });
    };
    FilterComponent.prototype.render = function () {
        var _this = this;
        var ramanPlot = (<RamaScatter_1.default pdbID={this.state.inputValue} width={473} height={473} ramaContourPlotType={this.state.typeOfPlot} chainsToShow={this.state.chainsToShow} contourColoringStyle={this.state.contourType} modelsToShow={this.state.modelsToShow} residueColorStyle={this.state.coloring}/>);
        var chainToggle = (<ButtonGroup vertical={true} id={'rama-chain-filter'} bsStyle={'primary'}>
                <ToggleButtonGroup name={'chain-select'} type={'checkbox'} defaultValue={this.chains} onChange={function (selected) { return _this.chainFilter(selected); }} value={this.state.chainsToShow}>
                    {this.chains.sort().map(function (d) {
            return <ToggleButton value={d} key={d} checked={true} id={'rama-chain-toggle-button'}>{d}</ToggleButton>;
        })}
                </ToggleButtonGroup>
            </ButtonGroup>);
        var entityToggle = (<ToggleButtonGroup name={'entity-select'} type={'checkbox'} defaultValue={this.models} onChange={function (selected) { return _this.entityFilter(selected); }} value={this.state.modelsToShow} id={'rama-entity-filter'}>
                    {this.models.map(function (d) {
            return <ToggleButton value={d} key={d} checked={true} id={'rama-entity-toggle-button'}>{d}</ToggleButton>;
        })}
                </ToggleButtonGroup>);
        var typeOfPlotArr = ['General case', 'Isoleucine and valine', 'Pre-proline', 'Glycine', 'Trans proline', 'Cis proline'];
        var drawingType = ['Default', 'Quality', 'RSRZ'];
        return (<div>
                    <div id={'rama-form-div'}>
                    <react_bootstrap_1.FormGroup controlId={'controlText'} validationState={this.getValidationState()}>
                        <react_bootstrap_1.InputGroup>
                            <react_bootstrap_1.FormControl type="text" placeholder={'PDBid'} onChange={function (evt) { return _this.updateInputValue(evt); }}/>
                            <react_bootstrap_1.InputGroup.Button>
                            <react_bootstrap_1.Button onClick={function () { return _this.down(); }} bsStyle={'primary'} disabled={this.state.inputValue.length !== 4}>
                                Submit
                            </react_bootstrap_1.Button>
                        </react_bootstrap_1.InputGroup.Button>
                        </react_bootstrap_1.InputGroup>
                    </react_bootstrap_1.FormGroup>
                        <div id={'rama-drawing-style-div'}>
                            <react_bootstrap_1.DropdownButton bsStyle={'primary'} title={drawingType[this.state.coloring - 1]} id={'dropdown-basic-$1 rama-drawType-dropdown'} onSelect={this.handleDrawTypeDropdownClick} pullRight={true}>
                                <react_bootstrap_1.MenuItem eventKey={1} active={1 === this.state.coloring}>Default</react_bootstrap_1.MenuItem>
                                <react_bootstrap_1.MenuItem eventKey={2} active={2 === this.state.coloring}>Quality</react_bootstrap_1.MenuItem>
                                <react_bootstrap_1.MenuItem eventKey={3} active={3 === this.state.coloring}>RSRZ</react_bootstrap_1.MenuItem>
                            </react_bootstrap_1.DropdownButton>
                        </div>
                        <div id={'rama-plottype-div'}>
                            <react_bootstrap_1.DropdownButton bsStyle={'primary'} title={typeOfPlotArr[this.state.typeOfPlot - 1]} id={'dropdown-basic-$1 rama-type-dropdown'} onSelect={this.handlePlotTypeDropdownClick} pullRight={true}>
                                <react_bootstrap_1.MenuItem eventKey={1} active={1 === this.state.typeOfPlot}>General case</react_bootstrap_1.MenuItem>
                                <react_bootstrap_1.MenuItem eventKey={2} active={2 === this.state.typeOfPlot}>Isoleucine and valine</react_bootstrap_1.MenuItem>
                                <react_bootstrap_1.MenuItem eventKey={3} active={3 === this.state.typeOfPlot}>Pre-proline</react_bootstrap_1.MenuItem>
                                <react_bootstrap_1.MenuItem eventKey={4} active={4 === this.state.typeOfPlot}>Glycine</react_bootstrap_1.MenuItem>
                                <react_bootstrap_1.MenuItem eventKey={5} active={5 === this.state.typeOfPlot}>Trans proline</react_bootstrap_1.MenuItem>
                                <react_bootstrap_1.MenuItem eventKey={6} active={6 === this.state.typeOfPlot}>Cis proline</react_bootstrap_1.MenuItem>
                            </react_bootstrap_1.DropdownButton>
                        </div>
                        <div id={'rama-radio-buttons-container'}>
                        <react_bootstrap_1.ButtonToolbar>
                            <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={function (evt) { return _this.handleTypeChange(evt); }}>
                                <ToggleButton value={1}>Lines</ToggleButton>
                                <ToggleButton value={2}>Heat map</ToggleButton>
                            </ToggleButtonGroup>
                        </react_bootstrap_1.ButtonToolbar>
                        </div>
                    </div>
                    
                        
                            
                            
                            
                            
                            
                            
                        
                        
                    
                        <div id={'rama-chain-toggle-div'}>
                            {chainToggle}
                            {entityToggle}
                        </div>
                        {ramanPlot}
            </div>);
    };
    return FilterComponent;
}(React.Component));
exports.default = FilterComponent;
