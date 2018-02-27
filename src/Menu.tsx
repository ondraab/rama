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
    contourType: number;
    dropdownOpen: boolean;
}

export default class FilterComponent extends React.Component<{}, States> {
    parsedPDB;
    chains;
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
            dropdownOpen: false,
        };
        this.chains = [];
        this.input = '';
        this.handleDropdownClick = this.handleDropdownClick.bind(this);
        // this.handleHover = this.handleHover.bind(this);
        let pdb = new ParsePDB(this.state.inputValue);
        this.parsedPDB = pdb.downloadAndParse();
        this.chains = pdb.chainsArray;
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
        this.parsedPDB = pdb.downloadAndParse();
        this.chains = pdb.chainsArray;
        this.setState({
            inputValue: this.input,
            chainsToShow: this.chains,
            jsonObject: this.parsedPDB
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
        console.log(this.state.chainsToShow);
    }

    public handleDropdownClick(key: any) {
        this.setState({
            typeOfPlot: key,
        });
    }

    // public handleHoverOpen() {
    //     this.setState({
    //         dropdownOpen: true,
    //     });
    // }
    // public handleHoverClose() {
    //     this.setState({
    //         dropdownOpen: false,
    //     });
    // }

    public handleTypeChange(value: any) {
        this.setState({
            contourType: value,
        });
    }

    public render() {
    function  handleHoverOpen() {
            this.setState({
                dropdownOpen: true,
            });
        }
    function  handleHoverClose() {
            this.setState({
                dropdownOpen: false,
            });
        }
    const ramanPlot = (
            <RamaData
                pdbID={this.state.inputValue}
                width={window.innerWidth}
                height={window.innerWidth}
                jsonObject={this.parsedPDB}
                typeOfPlot={this.state.typeOfPlot}
                chainsToShow={this.state.chainsToShow}
                contourType={this.state.contourType}
            />
        );

    const makeChainToolbar = (
        <ButtonGroup vertical={true}>
            <ToggleButtonGroup
                name={'chain-select'}
                type={'checkbox'}
                defaultChecked={this.chains}
                onChange={selected => this.chainFilter(selected)}
            >
                {this.chains.map(function (d: any, i: number) {
                    return <ToggleButton value={d} key={d}>{d}</ToggleButton>;
                })}
            </ToggleButtonGroup>
        </ButtonGroup>
    );

    const typeOfPlotArr = ['General case', 'Isoleucine and valine', 'Pre-proline', 'Glycine', 'Trans proline', 'Cis proline'];

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
                    <div id={'rama-plottype-div'}>
                    <DropdownButton
                        bsStyle={'primary'}
                        title={typeOfPlotArr[Number(this.state.typeOfPlot) - 1]}
                        id={'dropdown-basic-$1 rama-type-dropdown'}
                        onSelect={this.handleDropdownClick}
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
                                {makeChainToolbar}
                    </div>
                    {ramanPlot}
        </div>
        );
    }
}
