import * as d3 from 'd3';

class DropDown {
    constructor() {
        d3.select('#selected-dropdown').text('first');

        d3.select('select')
            .on('change', function(d: any) {
                let selected = d3.select('#d3-dropdown').node().valueOf;
                console.log( selected );
                d3.select('#selected-dropdown').text(selected.toString());
            });
    }
}
