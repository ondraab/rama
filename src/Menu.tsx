import * as React from 'react';
import 'bootstrap/less/bootstrap.less';
import {
    Button, FormGroup, FormControl, InputGroup, DropdownButton, MenuItem,
} from 'react-bootstrap';
import RamaData from './RamaScatter';
import ParsePDB from './parsePDB';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

interface States {
    showFilter?: boolean;
    inputValue: string;
    buttonClicked: boolean;
    buttonState: string;
    jsonObject: object[];
    contoursType: string;
    chainsToShow: string[];
}

export default class FilterComponent extends React.Component<{}, States> {
    parsedPDB;
    chains;

    constructor(props: any) {
        super(props);
        this.state = {
            showFilter: false,
            inputValue: '',
            buttonClicked: false,
            buttonState: 'disabled',
            jsonObject: [],
            contoursType: '1',
            chainsToShow: [],
        };
        this.chains = [];
        this.handleDropdownClick = this.handleDropdownClick.bind(this);
    }

    public updateInputValue(evt: any) {
        this.setState({
            inputValue: evt.target.value
        });
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

    public returnState() {
        if (this.state.buttonClicked === true && this.state.inputValue.length === 4) {
            this.down();
            return this.state.inputValue;
        }
        return '';
    }

    public down() {
        this.chains = [];
        let pdb = new ParsePDB(this.state.inputValue);
        this.parsedPDB = pdb.downloadAndParse();
        this.chains = pdb.chainsArray;
        // this.chainOptions();
    }

    public chainFilter(selected: any) {
        this.setState({
            chainsToShow: selected
        });
    }

    public handleDropdownClick(key: any) {
        this.setState({
            contoursType: key,
        });
    }

    public render() {

        const ramanPlot = (
            <RamaData
                pdbID={this.returnState()}
                width={0.85 * window.innerHeight}
                height={0.85 * window.innerHeight}
                jsonObject={this.parsedPDB}
                typeOfPlot={this.state.contoursType}
                chainsToShow={this.state.chainsToShow}
            />
        );

        return (
            <div>
                <div id={'formDiv'}>
                <FormGroup
                    controlId={'controlText'}
                    validationState={this.getValidationState()}
                >
                    <InputGroup>
                        <FormControl type="text" placeholder={'PDBid'} onChange={evt => this.updateInputValue(evt)}/>
                        <InputGroup.Button>
                        <Button
                            onClick={() => this.setState({
                                buttonClicked: true
                            })}
                            bsStyle={'primary'}
                            disabled={this.state.inputValue.length !== 4}
                        >
                            Submit
                        </Button>
                    </InputGroup.Button>
                    </InputGroup>
                </FormGroup>
                <DropdownButton
                    bsStyle={'primary'}
                    title="Type of plot"
                    id={'dropdown-basic-$1'}
                    onSelect={this.handleDropdownClick}
                    pullRight={true}
                >
                    <MenuItem eventKey={'1'} active={'1' === this.state.contoursType}>General case</MenuItem>
                    <MenuItem eventKey={'2'} active={'2' === this.state.contoursType}>Isoleucine and valine</MenuItem>
                    <MenuItem eventKey={'3'} active={'3' === this.state.contoursType}>Pre-proline</MenuItem>
                    <MenuItem eventKey={'4'} active={'4' === this.state.contoursType}>Glycine</MenuItem>
                    <MenuItem eventKey={'5'} active={'5' === this.state.contoursType}>Trans proline</MenuItem>
                    <MenuItem eventKey={'6'} active={'6' === this.state.contoursType}>Cis proline</MenuItem>
                </DropdownButton>
            </div>
                <div id={'typeahead'}>
                    <Typeahead
                        clearButton={true}
                        options={this.chains}
                        selected={this.chains.sort()}
                        labelKey="name"
                        multiple={true}
                        onChange={(selected) => this.chainFilter(selected)}
                    />
                </div>
                {ramanPlot}
            </div>
        );
    }
}
