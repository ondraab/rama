import * as React from 'react';
import 'bootstrap/less/bootstrap.less';
import {
    Button, FormGroup, FormControl, InputGroup, DropdownButton, MenuItem,
} from 'react-bootstrap';
import RamaData from './RamaScatter';
import ParsePDB from './parsePDB';
import MultiSelect from './MultiSelect';

interface States {
    showFilter?: boolean;
    inputValue: string;
    buttonClicked: boolean;
    buttonState: string;
    jsonObject: object[];
    filter: string;
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
            filter: '1',
        };
        this.chains = [];
        this.handleDropdownClick = this.handleDropdownClick.bind(this);
    }

    public onFilter(obj: any) {
        const setFilter = this.props;
        const dogData = this.props;
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
        let pdb = new ParsePDB(this.state.inputValue);
        this.parsedPDB = pdb.downloadAndParse();
        this.chains = pdb.chainsArray;
        this.chainOptions();
    }

    public chainOptions() {
        let tempChains = [];
        for (let chain of this.chains) {
            let ch = {
                label: chain,
                value: chain,
            };
            tempChains.push(ch);
        }
        this.chains = tempChains;
    }

    public handleDropdownClick(key: any) {
        this.setState({
            filter: key,
        });
    }

    public render() {
        const dogData = this.props;
        const showFilter = this.state;
        const sex = dogData;
        const nameLengthMax = dogData;
        const nameLengthMin = dogData;
        const filter = this.state;

        const nameLengthMinButtons = [];
        const nameLengthsMin = [0, 3, 5, 10, 20];
        nameLengthsMin.map(n => {
            nameLengthMinButtons.push(
                <Button
                    bsStyle="primary"
                    bsSize="small"
                    disabled={n >= nameLengthMax}
                    key={'nameLengthMaxBtn' + n}
                    onClick={() => {this.onFilter({nameLengthMin: n}); }}
                >
                    {n}
                </Button>);
        });

        const filterControls = (
            <div>
                <div id={'dropdown-bas'}>
                    <DropdownButton
                        bsStyle={'primary'}
                        title="Type of plot"
                        id={'dropdown-basic'}
                        bsSize={'small'}
                        onSelect={this.handleDropdownClick}
                    >
                        <MenuItem eventKey={'1'} active={'1' === this.state.filter}>General case</MenuItem>
                        <MenuItem eventKey={'2'} active={'2' === this.state.filter}>Isoleucine and valine</MenuItem>
                        <MenuItem eventKey={'3'} active={'3' === this.state.filter}>Pre-proline</MenuItem>
                        <MenuItem eventKey={'4'} active={'4' === this.state.filter}>Glycine</MenuItem>
                        <MenuItem eventKey={'5'} active={'5' === this.state.filter}>Trans proline</MenuItem>
                        <MenuItem eventKey={'6'} active={'6' === this.state.filter}>Cis proline</MenuItem>
                    </DropdownButton>
                </div>
                <div id={'multiselect'}>
                    <MultiSelect label={'Chains to show'} options={this.chains}/>
                </div>
        </div>
        );

        function setActive(key: any) {
            this.setState({
                isActive: key,
            });
        }

        const ramanPlot = (
            <RamaData
                pdbID={this.returnState()}
                width={500}
                height={500}
                jsonObject={this.parsedPDB}
                typeOfPlot={this.state.filter}
            />
        );
        return (
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
                    bsSize={'small'}
                    onSelect={this.handleDropdownClick}
                >
                    <MenuItem eventKey={'1'} active={'1' === this.state.filter}>General case</MenuItem>
                    <MenuItem eventKey={'2'} active={'2' === this.state.filter}>Isoleucine and valine</MenuItem>
                    <MenuItem eventKey={'3'} active={'3' === this.state.filter}>Pre-proline</MenuItem>
                    <MenuItem eventKey={'4'} active={'4' === this.state.filter}>Glycine</MenuItem>
                    <MenuItem eventKey={'5'} active={'5' === this.state.filter}>Trans proline</MenuItem>
                    <MenuItem eventKey={'6'} active={'6' === this.state.filter}>Cis proline</MenuItem>
                </DropdownButton>
                <MultiSelect  label={''} options={this.chains}/>
                {this.state.showFilter ? filterControls : null}
                {ramanPlot}
            </div>
        );
    }
}
