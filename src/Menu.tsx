import * as React from 'react';
import 'bootstrap/less/bootstrap.less';
import { Button, ButtonGroup, FormGroup, FormControl, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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

    public changeState(obj: any) {
        return this.setState({
            showFilter: !obj,
        });
    }

    public changeButtonState() {
        this.setState({
            buttonClicked: true,
        });
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

    public chainButtons() {
        const chainsToShowButtons = [];
        this.chains.map(n => {
            chainsToShowButtons.push(
                <Button
                    bsStyle="primary"
                    bsSize="small"
                    key={n}
                >
                    {n}
                </Button>);
        });
        return chainsToShowButtons;
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
                <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                >
                    <MultiSelect label={'Chains to show'} options={this.chains}/>
                    <h4/>
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
                </ReactCSSTransitionGroup>
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
            <div>
                <FormGroup
                    controlId={'controlText'}
                    validationState={this.getValidationState()}
                >
                    <InputGroup>
                        <FormControl type="text" placeholder={'PDBid'} onChange={evt => this.updateInputValue(evt)}/>
                        <InputGroup.Button>
                        <Button
                            onClick={() => this.changeButtonState()}
                            bsStyle={'primary'}
                            disabled={this.state.inputValue.length !== 4}
                        >
                            Submit
                        </Button>
                    </InputGroup.Button>
                    </InputGroup>
                </FormGroup>
                <h3>Settings and info{' '}
                    <Button
                        bsSize={'small'}
                        onClick={() => {this.changeState(this.state.showFilter); }}
                    >
                        {this.state['showFilter'] ? 'Hide' : 'Show'}
                    </Button>
                </h3>
                {this.state['showFilter'] ? filterControls : null}
                {ramanPlot}
            </div>
        );
    }
}

// export default class Menu extends Component {
//     constructor(props: any) {
//         super(props);
//         this.state = {
//             showFilter: true,
//         };
//     }
//     onFilter(obj: object) {
//         const setFilter = this.props;
//         setFilter(obj);
//     }
//
//     render() {
//         const showFilter = this.state;
//         const pdbData = this.state;
//         const {chain, typeOfGraph } = pdbData;
//
//
//         const chainName.map(n => {
//
//         })
//
//         return (
//             <div>
//                 <h3>Filter{' '}
//                     <Button
//                         bsSize={'small'}
//                         onClick={() => {this.setState({showFilter: !showFilter});}}>
//                         Toggle Filter
//                     </Button>
//                 </h3>
//                 {showFilter ? filterControls : ''}
//             </div>);
//     }
//         // return(
//             {/*<Form inline={true}>*/}
//                 {/*<ControlLabel>PDBid</ControlLabel>*/}
//                 {/*<FormControl type="text" placeholder="4 letter PDB code"/>*/}
//                 {/*<Button type="submit">Plot</Button>*/}
//             {/*</Form>*/}
//             {/*<DropdownButton bsStyle="primary" title="Type of plot" id={`dropdown-basic-$1`}>*/}
//                 {/*<MenuItem eventKey={'1'}>General case</MenuItem>*/}
//                 {/*<MenuItem eventKey={'2'}> Isoleucine and valine</MenuItem>*/}
//                 {/*<MenuItem eventKey={'3'}>Pre-proline</MenuItem>*/}
//                 {/*<MenuItem eventKey={'4'}>Glycine</MenuItem>*/}
//                 {/*<MenuItem eventKey={'5'}>Trans proline</MenuItem>*/}
//                 {/*<MenuItem eventKey={'6'}>Pre-proline</MenuItem>*/}
//             {/*</DropdownButton>*/}
//         // );
//     }
// }
//
// Menu.prototype = {
//     setFilter: ReactPropTypes.func.isRequired,
// };
