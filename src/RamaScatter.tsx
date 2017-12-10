import * as React from 'react';
import { Component } from 'react';
import ParsePDB from './parsePDB';
import * as d3 from 'd3';

interface RamaProps {
    pdbID: string;
    width: number;
    height: number;
}

// class RamaData extends React.Component<RamaProps, object> {
//     // private molecules: Array<Molecule> = [];
//
//     render() {
//         const {pdbID} = this.props;
//         fetch('http://www.ebi.ac.uk/pdbe/api/validation/rama_sidechain_listing/entry/' + pdbID)
//             .then(response =>
//                 response.json().then(data => ({
//                         data: data,
//                         status: response.status
//                     })
//                 ).then(res => {
//                     for (let mol of res.data[pdbID].molecules) {
//                         // let Mol = new Molecule(mol.entity_id, mol.chains);
//                         // this.molecules.push(Mol);
//                         for (let chain of mol.chains) {
//                             console.log(chain.chain_id);
//                         }
//                             // for (let mod of chain.models) {
//                             //     console.log(mod.model_id);
//                                 // for (let res of mod.residues) {
//                                 //     continue;
//                                 // }
//                             }
//                         // }
//                     // }
//                 }));
//         return (
//             <div className="hello">
//                 <div className="greeting">
//                     Hello {}
//                 </div>
//             </div>
//         );
//     }
// }
// export default RamaData;

interface Refs {
    mountPoint?: HTMLDivElement;
}

class RamaData extends Component<RamaProps, {}> {
    ctrls: Refs = {};

    componentDidMount() {
        const { width, height, pdbID} = this.props;
        let down = new ParsePDB(pdbID);
        let parsed: object[] = down.downloadAndParse();
        console.log(parsed);

        // setup x
        const xScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, width]),

            xBottomAxis = d3.axisBottom(xScale),
            xTopAxis = d3.axisTop(xScale),
            xValue = function (d: object) { return d['phi']; },
            xMap = function(d: any) { return xScale( xValue(d)); };

        // setup y

        const yScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, height.valueOf() - 20]),

            yLeftAxis = d3.axisLeft(yScale),
            yRightAxis = d3.axisRight(yScale),
            yValue = function (d: object) { return d['psi']; },
            yMap = function(d: any) { return yScale( yValue(d)); };

        // setup container

        const svgContainer = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('padding', '30px');

        // add axes

        svgContainer.append('g')
            .call(xTopAxis);

        svgContainer.append('g')
            .attr('transform', function() {
                return 'translate(' + 0 + ',' + (height.valueOf() - 20) + ')'; })
            .call(xBottomAxis);

        svgContainer.append('g')
            .call(yLeftAxis);

        svgContainer.append('g')
            .attr('transform', function () { return 'translate(' + (width.valueOf()) + ', 0)'; })
            .call(yRightAxis);

        function color(d: object) {
            switch (d['rama']) {
                case 'Favored':
                    return '#19667f';
                case 'OUTLIER':
                    return '#ff0000';
                case 'Allowed':
                    return '#0c7f3a';
                default:
                    return '#ffe342';
            }
        }

        // tooltip
        let toolTip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        svgContainer.selectAll('.shapes')
            .data(parsed)
            .enter()
            .append('circle')
            .attr('r', 3.5)
            .attr('cx', xMap)
            .attr('cy', yMap)
            .style('fill', function color(d: object) {
                switch (d['rama']) {
                    case 'Favored':
                        return '#19667f';
                    case 'OUTLIER':
                        return '#ff0000';
                    case 'Allowed':
                        return '#0c7f3a';
                    default:
                        return '#ffe342';
                }
            })
            .on('mouseover', function(d: object) {
                toolTip.transition()
                    .duration(50)
                    .style('opacity', .9);
                toolTip.html(d['aa'] + ' ' + d['num'] + ' ' + d['chain'] + '<br/>'
                    + 'phi: ' + d['phi'] + '<br/>psi: ' + d['psi'])
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
                d3.select(this)
                    .style('fill', 'yellow');
            })
            .on('mouseout', function(d: object) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('fill', color(d));
                toolTip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });
    }
    render () {
        const {width, height} = this.props;
        return <div/>;
    }
        // const {pdbID} = this.props;
        // let parsedJSON = new ParsePDB(pdbID);
        // // console.log(parsedJSON.downloadAndParse());
        // let downloadedJSON = parsedJSON.downloadAndParse();
        // console.log(downloadedJSON);
        // return (
        //     <div className="hello">
        //         <div className="greeting">
        //             Hello {}
        //         </div>
        //     </div>
}
export default RamaData;