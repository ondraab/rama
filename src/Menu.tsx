import * as React from 'react';
import 'bootstrap/less/bootstrap.less';
import { Button, ButtonGroup, FormGroup, FormControl, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import RamaData from './RamaScatter';

interface States {
    showFilter?: boolean;
    inputValue: string;
    buttonClicked: boolean;
    buttonState: string;
}

export default class FilterComponent extends React.Component<{}, States> {
    constructor(props: any) {
        super(props);
        this.state = {
            showFilter: false,
            inputValue: '',
            buttonClicked: false,
            buttonState: 'disabled',
        };
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
               buttonClicked: false
           });
        }
    }

    // public getInitialInputState() {
    // }

    public getValidationState() {
        const length = this.state.inputValue.length;
        if (length !== 4) {
            return 'error';
        }
        return 'success';
    }

    public returnState() {
        if (this.state.buttonClicked === true && this.state.inputValue.length === 4) {
            return this.state.inputValue;
        }
        return '';
    }

    public render() {
        const dogData = this.props;
        const showFilter = this.state;
        const sex = dogData;
        const nameLengthMax = dogData;
        const nameLengthMin = dogData;

        const chainsToShowButtons = [];
        const chainsToShow = [3, 5, 10, 20, Infinity];
        chainsToShow.map(n => {
            chainsToShowButtons.push(
                <Button
                    bsStyle="primary"
                >
                    {n}
                </Button>);
        });

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
                    <h4>Chains to show</h4>
                    <ButtonGroup>
                        {nameLengthMinButtons}
                    </ButtonGroup>
                    <h4/>

                    <h4/>
                    <DropdownButton bsStyle={'primary'} title="Type of plot" id={'dropdown-basic-$1'} bsSize={'small'}>
                        <MenuItem eventKey={'1'}>General case</MenuItem>
                        <MenuItem eventKey={'2'}> Isoleucine and valine</MenuItem>
                        <MenuItem eventKey={'3'}>Pre-proline</MenuItem>
                        <MenuItem eventKey={'4'}>Glycine</MenuItem>
                        <MenuItem eventKey={'5'}>Trans proline</MenuItem>
                        <MenuItem eventKey={'6'}>Pre-proline</MenuItem>
                    </DropdownButton>
                </ReactCSSTransitionGroup>
        </div>
        );

        const ramanPlot = (
            <RamaData pdbID={this.returnState()} width={500} height={500}/>
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
