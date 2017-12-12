import * as d3 from 'd3';
import * as React from 'react';
import { DropdownButton, MenuItem, Form, FormControl, ControlLabel, Button } from 'react-bootstrap';

class Menu extends React.Component {
    render() {
        return(
            <Form inline={true}>
                <ControlLabel>PDBid</ControlLabel>
                <FormControl type="text" placeholder="4 letter PDB code"/>
                <Button type="submit">Plot</Button>
            </Form>
            <DropdownButton bsStyle="primary" title="Type of plot" id={`dropdown-basic-$1`}>
                <MenuItem eventKey={'1'}>General case</MenuItem>
                <MenuItem eventKey={'2'}> Isoleucine and valine</MenuItem>
                <MenuItem eventKey={'3'}>Pre-proline</MenuItem>
                <MenuItem eventKey={'4'}>Glycine</MenuItem>
                <MenuItem eventKey={'5'}>Trans proline</MenuItem>
                <MenuItem eventKey={'6'}>Pre-proline</MenuItem>
            </DropdownButton>
        );
    }
}
;