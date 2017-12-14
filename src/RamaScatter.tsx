import * as React from 'react';
import { Component } from 'react';
import ParsePDB from './parsePDB';
import * as d3 from 'd3';
import { DropdownButton } from 'react-bootstrap';

interface RamaProps {
    pdbID: string;
    width: number;
    height: number;
}

interface Refs {
    mountPoint?: HTMLDivElement;
}

interface States {
    pdb: string;
}

class RamaData extends Component<RamaProps, States> {
    ctrls: Refs = {};
    svgContainer;
    xMap;
    yMap;

    constructor(props: any) {
        super(props);
        this.createChart = this.createChart.bind(this);
        this.state = {
            pdb: this.props.pdbID,
        };
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        if (this.state.pdb.length === 4) {
            this.updateChard();
        }
        return;
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.pdbID !== this.state.pdb) {
            this.setState({
                pdb: nextProps.pdbID,
            });
        }
    }

    updateChard() {
        this.svgContainer.selectAll('circle').remove();
        let down = new ParsePDB(this.state.pdb);
        let parsed: object[] = down.downloadAndParse();

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

        this.svgContainer.selectAll('.shapes')
            .data(parsed)
            .enter()
            .append('circle')
            .attr('r', 3.5)
            .attr('cx', this.xMap)
            .attr('cy', this.yMap)
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
            .on('mouseover', function (d: object) {
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
            .on('mouseout', function (d: object) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style('fill', color(d));
                    toolTip.transition()
                        .duration(200)
                        .style('opacity', 0);
                }
            );
    }

    createChart() {
        const {width, height} = this.props;

        // setup x
        const xScale = d3.scaleLinear()
                .domain([-180, 180])
                .range([0, 0.85 * (width)]);

        const xBottomAxis = d3.axisBottom(xScale),
            xTopAxis = d3.axisTop(xScale),
            xValue = function (d: object) {
                return d['phi'];
            };

        this.xMap = function (d: any) {return xScale(xValue(d)); };

        // setup y

        const yScale = d3.scaleLinear()
                .domain([180, -180])
                .range([0, 0.85 * (height)]),

            yLeftAxis = d3.axisLeft(yScale),
            yRightAxis = d3.axisRight(yScale),
            yValue = function (d: object) {
                return d['psi'];
            };
        this.yMap = function (d: any) {
            return yScale(yValue(d));
        };

        // setup container

        this.svgContainer = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('padding', '30px');

        // add axes

        this.svgContainer.append('g')
            .call(xTopAxis);

        this.svgContainer.append('g')
            .attr('transform', 'translate(0,' + (0.85 * height) + ')')
            .call(xBottomAxis);

        this.svgContainer.append('g')
            .call(yLeftAxis);

        this.svgContainer.append('g')
            .attr('transform', function () {
                return 'translate(' + (0.85 * width) + ', 0)';
            })
            .call(yRightAxis);
    }

    render () {
        return (
            <div/>
        );
    }
}
export default RamaData;