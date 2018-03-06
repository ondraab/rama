import * as React from 'react';
import 'bootstrap/less/bootstrap.less';
import {
    Button, FormGroup, FormControl, InputGroup, DropdownButton, MenuItem, ButtonToolbar,
} from 'react-bootstrap';
import RamaData from './RamaScatter';
import ParsePDB from './parsePDB';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import * as ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import * as ToggleButton from 'react-bootstrap/lib/ToggleButton';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

interface States {
    showFilter?: boolean;
    inputValue: string;
    buttonClicked: boolean;
    buttonState: string;
    jsonObject: object[];
    typeOfPlot: string;
    chainsToShow: string[];
    modelsToShow: number[];
    contourType: number;
    // dropdownOpen: boolean;
    drawingType: string;
}

export default class FilterComponent extends React.Component<{}, States> {
    parsedPDB;
    chains;
    models;
    rsrz;
    outliersType;
    input;

    constructor(props: any) {
        super(props);
        this.state = {
            showFilter: false,
            inputValue: '1tqn',
            buttonClicked: false,
            buttonState: 'disabled',
            jsonObject: [],
            typeOfPlot: '1',
            chainsToShow: ['A'],
            contourType: 1,
            modelsToShow: [1],
            drawingType: '1',
        };
        this.chains = [];
        this.input = '';

        this.handlePlotTypeDropdownClick = this.handlePlotTypeDropdownClick.bind(this);
        this.handleDrawTypeDropdownClick = this.handleDrawTypeDropdownClick.bind(this);

        let pdb = new ParsePDB(this.state.inputValue);
        pdb.downloadAndParse();
        this.parsedPDB = pdb.residueArray;
        this.chains = pdb.chainsArray;
        this.models = pdb.modelArray;
        this.rsrz = pdb.rsrz;
        this.outliersType = pdb.outlDict;
    }

    public updateInputValue(evt: any) {
        this.input = evt.target.value;
        if (this.state.buttonClicked === true) {
           this.setState({
               buttonClicked: false,
               jsonObject: []
           });
        }
    }

    public getValidationState() {
        const length = this.state.inputValue.length;
        if (length !== 4) {
            return 'error';
        }
        return 'success';
    }

    // public returnState() {
    //     if (this.state.buttonClicked === true && this.state.inputValue.length === 4) {
    //         this.down();
    //         return this.state.inputValue;
    //     }
    //     return '';
    // }

    public down() {
        this.chains = [];
        let pdb = new ParsePDB(this.input);
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
        },            function () {
            // this.chains = [];
            // let pdb = new ParsePDB(this.state.inputValue);
            // this.parsedPDB = pdb.downloadAndParse();
            // this.chains = pdb.chainsArray;
        });

    }

    public chainFilter(selected: any) {
        this.setState({
            chainsToShow: selected
        });
    }

    public entityFilter(selected: any) {
        this.setState({
            modelsToShow: selected
        });
    }

    public handlePlotTypeDropdownClick(key: any) {
        this.setState({
            typeOfPlot: key,
        });
    }

    public handleDrawTypeDropdownClick(key: any) {
        this.setState({
            drawingType: key,
        });
    }

    public handleTypeChange(value: any) {
        this.setState({
            contourType: value,
        });
    }

    public render() {
        const ramanPlot = (
                <RamaData
                    pdbID={this.state.inputValue}
                    width={473}
                    height={473}
                    typeOfPlot={this.state.typeOfPlot}
                    chainsToShow={this.state.chainsToShow}
                    contourType={this.state.contourType}
                    modelsToShow={this.state.modelsToShow}
                    drawingType={this.state.drawingType}
                />
            );

        let chainToggle: any = (
            <ButtonGroup vertical={true} id={'rama-chain-filter'} bsStyle={'primary'}>
                <ToggleButtonGroup
                    name={'chain-select'}
                    type={'checkbox'}
                    defaultValue={this.chains}
                    onChange={selected => this.chainFilter(selected)}
                    value={this.state.chainsToShow}
                >
                    {this.chains.sort().map(function (d: any) {
                        return <ToggleButton value={d} key={d} checked={true} id={'rama-chain-toggle-button'}>{d}</ToggleButton>;
                    })}
                </ToggleButtonGroup>
            </ButtonGroup>
        );

        const entityToggle = (
                <ToggleButtonGroup
                    name={'entity-select'}
                    type={'checkbox'}
                    defaultValue={this.models}
                    onChange={selected => this.entityFilter(selected)}
                    value={this.state.modelsToShow}
                    id={'rama-entity-filter'}
                >
                    {this.models.map(function (d: any) {
                        return <ToggleButton value={d} key={d} checked={true} id={'rama-entity-toggle-button'}>{d}</ToggleButton>;
                    })}
                </ToggleButtonGroup>
            );

        const typeOfPlotArr = ['General case', 'Isoleucine and valine', 'Pre-proline', 'Glycine', 'Trans proline', 'Cis proline'];
        const drawingType = ['Default', 'Quality', 'RSRZ'];

        return (
            <div>
                    <div id={'rama-form-div'}>
                    <FormGroup
                        controlId={'controlText'}
                        validationState={this.getValidationState()}
                    >
                        <InputGroup>
                            <FormControl type="text" placeholder={'PDBid'} onChange={evt => this.updateInputValue(evt)}/>
                            <InputGroup.Button>
                            <Button
                                onClick={() => this.down()}
                                bsStyle={'primary'}
                                disabled={this.state.inputValue.length !== 4}
                            >
                                Submit
                            </Button>
                        </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>
                        <div id={'rama-drawing-style-div'}>
                            <DropdownButton
                                bsStyle={'primary'}
                                title={drawingType[Number(this.state.drawingType) - 1]}
                                id={'dropdown-basic-$1 rama-drawType-dropdown'}
                                onSelect={this.handleDrawTypeDropdownClick}
                                pullRight={true}
                            >
                                <MenuItem eventKey={'1'} active={'1' === this.state.drawingType}>Default</MenuItem>
                                <MenuItem eventKey={'2'} active={'2' === this.state.drawingType}>Quality</MenuItem>
                                <MenuItem eventKey={'3'} active={'3' === this.state.drawingType}>RSRZ</MenuItem>
                            </DropdownButton>
                        </div>
                        <div id={'rama-plottype-div'}>
                            <DropdownButton
                                bsStyle={'primary'}
                                title={typeOfPlotArr[Number(this.state.typeOfPlot) - 1]}
                                id={'dropdown-basic-$1 rama-type-dropdown'}
                                onSelect={this.handlePlotTypeDropdownClick}
                                pullRight={true}
                            >
                                <MenuItem eventKey={'1'} active={'1' === this.state.typeOfPlot}>General case</MenuItem>
                                <MenuItem eventKey={'2'} active={'2' === this.state.typeOfPlot}>Isoleucine and valine</MenuItem>
                                <MenuItem eventKey={'3'} active={'3' === this.state.typeOfPlot}>Pre-proline</MenuItem>
                                <MenuItem eventKey={'4'} active={'4' === this.state.typeOfPlot}>Glycine</MenuItem>
                                <MenuItem eventKey={'5'} active={'5' === this.state.typeOfPlot}>Trans proline</MenuItem>
                                <MenuItem eventKey={'6'} active={'6' === this.state.typeOfPlot}>Cis proline</MenuItem>
                            </DropdownButton>
                        </div>
                        <div id={'rama-radio-buttons-container'}>
                        <ButtonToolbar>
                            <ToggleButtonGroup
                                type="radio"
                                name="options"
                                defaultValue={1}
                                onChange={evt => this.handleTypeChange(evt)}
                            >
                                <ToggleButton value={1}>Lines</ToggleButton>
                                <ToggleButton value={2}>Heat map</ToggleButton>
                            </ToggleButtonGroup>
                        </ButtonToolbar>
                        </div>
                    </div>
                    {/*<div id={'rama-chain-select'}>*/}
                        {/*<Typeahead*/}
                            {/*clearButton={true}*/}
                            {/*options={this.chains}*/}
                            {/*selected={this.chains.sort()}*/}
                            {/*labelKey="name"*/}
                            {/*multiple={true}*/}
                            {/*onChange={(selected) => this.chainFilter(selected)}*/}
                        {/*/>*/}
                        {/**/}
                    {/*</div>*/}
                        <div id={'rama-chain-toggle-div'}>
                            {chainToggle}
                            {entityToggle}
                        </div>
                        {ramanPlot}
            </div>
            );
        }
}
