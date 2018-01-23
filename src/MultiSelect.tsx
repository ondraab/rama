import * as React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

interface States {
    removeSelected: boolean;
    disabled: boolean;
    stayOpen: boolean;
    value: any[];
    rtl: boolean;
    options: string[][];
}

interface MultiSelectProps {
    label: string;
    options: string[][];
}

export default class MultiSelect extends React.Component<MultiSelectProps, States> {
    displayName: 'MultiSelectField';
    constructor(props: any) {
        super(props);
        this.state = {
            removeSelected: true,
            disabled: false,
            stayOpen: false,
            value: [],
            rtl: false,
            options: [],
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
    public handleSelectChange (values: any) {
        // console.log('You\'ve selected:', values);
        this.setState({
            value: values,
        });
    }
    public toggleCheckbox (e: any) {
        this.setState({
            [e.target.name]: e.target.checked,
        });
    }
    public toggleRtl (e: any) {
        this.setState({
            rtl: e.target.checked,
        });
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.options !== this.props.options) {
            this.setState({
                options: nextProps.options,
            });
        }
        // console.log(nextProps.options);
    }

    render () {
        const { disabled, stayOpen, value, options } = this.state;
        // console.log(options);
        return (
            <div className="section">
                {/*<h4*/}
                    {/*className="section-heading"*/}
                {/*>{this.props.label}*/}
                {/*</h4>*/}
                <Select
                    closeOnSelect={!stayOpen}
                    disabled={disabled}
                    multi={true}
                    onChange={this.handleSelectChange}
                    options={options}
                    placeholder="Select chain(s) to show"
                    simpleValue={true}
                    value={value}
                />
            </div>
        );
    }
}

// removeSelected={this.state.removeSelected}
// rtl={this.state.rtl}