import * as React from 'react';
import { Component } from 'react';
import * as d3 from 'd3';

interface RamaProps {
    pdbID: string;
    width: number;
    height: number;
    jsonObject?: object[];
    typeOfPlot?: string;
}

interface Refs {
    mountPoint?: HTMLDivElement;
}

interface States {
    pdb: string;
    contours: string;
}

class RamaData extends Component<RamaProps, States> {
    ctrls: Refs = {};
    svgContainer;
    xMap;
    yMap;
    xTopAxis;
    xBottomAxis;
    yLeftAxis;
    yRightAxis;
    constructor(props: any) {
        super(props);
        this.createChart = this.createChart.bind(this);
        this.state = {
            pdb: this.props.pdbID,
            contours: this.props.typeOfPlot,
        };
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate(newProps: any) {
        console.log(newProps.typeOfPlot);
        if (this.state.pdb.length === 4 && newProps.pdbID !== this.state.pdb) {
            this.basicContures(this.props.typeOfPlot);
            this.updateChard();
            return;
        }
        // if (this.state.contours !== newProps.typeOfPlot) {
        //     this.basicContures(newProps.typeOfPlot);
        // }
        return;
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.pdbID !== this.state.pdb && nextProps.pdbID.length === 4) {
            this.setState({
                pdb: nextProps.pdbID,
            });
        }
        return;
    }

    updateChard() {

        this.svgContainer.selectAll('circle').remove();
        let { jsonObject, typeOfPlot } = this.props;
        // console.log(jsonObject);

        // tooltip
        let toolTip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        //
        this.svgContainer.selectAll('.shapes')
            .data(jsonObject.filter(function (d: any) {
                switch (typeOfPlot) {
                    case '1':
                            return d;
                    case '2':
                        return (d['aa'] === 'ILE' || d['aa'] === 'VAL');
                    case '3':
                        return d;
                    case '4':
                        return d['aa'] === 'GLY';
                    case '5':
                        return d;
                    default:
                        return d;
                }
            }))
            .enter()
            .append('circle')
            .attr('r', 2.5)
            .attr('cx', this.xMap)
            .attr('cy', this.yMap)
            .merge(this.svgContainer)
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '1')
            .on('mouseover', function (d: object) {
                toolTip.transition()
                    .duration(50)
                    .style('opacity', .95);
                toolTip.html(d['aa'] + ' ' + d['num'] + ' ' + d['chain'] + '<br/>'
                    + 'phi: ' + d['phi'] + '<br/>psi: ' + d['psi'])
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
                d3.select(this)
                    .attr('r', 8)
                    .style('fill', '#015b86');
            })
            .on('mouseout', function (d: object) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r', 2.5)
                        .style('fill', 'none')
                        .style('stroke', 'black')
                        .style('stroke-width', '1');
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

        this.xBottomAxis = d3.axisBottom(xScale);
        this.xTopAxis = d3.axisTop(xScale);
        const xValue = function (d: object) {
                return d['phi'];
            };

        this.xMap = function (d: any) {return xScale(xValue(d)); };

        // setup y

        const yScale = d3.scaleLinear()
                .domain([180, -180])
                .range([0, 0.85 * (height)]);
        this.yLeftAxis = d3.axisLeft(yScale);
        this.yRightAxis = d3.axisRight(yScale);
        const yValue = function (d: object) {
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
            .call(this.xTopAxis);

        this.svgContainer.append('g')
            .attr('transform', 'translate(0,' + (0.85 * height) + ')')
            .call(this.xBottomAxis);

        this.svgContainer.append('g')
            .call(this.yLeftAxis);

        this.svgContainer.append('g')
            .attr('transform', function () {
                return 'translate(' + (0.85 * width) + ', 0)';
            })
            .call(this.yRightAxis);
    }

    basicContures(contureType: string) {

        let min = 9.419397742547137e-7;
        let svg = this.svgContainer;

        let xMap = this.xMap;
        let yMap = this.yMap;

        let url = 'https://raw.githubusercontent.com/ondraab/rama/master/build/data/';
        switch (contureType) {
            case '1':
                url += 'rama8000-general-noGPIVpreP.csv';
                break;
            case '2':
                url += 'rama8000-general-noGPIVpreP.csv';
                break;
            case '3':
                url += 'rama8000-general-noGPIVpreP.csv';
                break;
            case '4':
                url += 'rama8000-general-noGPIVpreP.csv';
                break;
            case '5':
                url += 'rama8000-general-noGPIVpreP.csv';
                break;
            default:
                return;
        }

        console.log(url);
        d3.csv(url, function (error: any, data: any) {
            if (error) { throw error; }
            data.forEach(function (d: any) {
                d.psi = +d.psi;
                d.phi = +d.phi;
                d.value = +d.value;
                return d;
            });
            let heatColorScale = d3.scaleLinear<string>()
                .domain([min, 0.045])
                .interpolate(d3.interpolateRgb)
                .range([
                    '#fff28d',
                    '#fac524',
                    '#660a00']);

            let median = d3.median(data, function (d: any) {
                return d.value;
            });
            svg.selectAll('.shapes')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', 3)
                .attr('cx', xMap)
                .attr('cy', yMap)
                .merge(svg)
                .style('opacity', function (d: any) {
                    if (d.value < median) {
                        return 0;
                    }
                    return 0.2;
                })
                .style('fill', function (d: any) {
                    if (d.value > median) {
                        return heatColorScale(d.value);
                    }
                    return 'white';
                })
                .attr('pointer-events', 'none');
        });
        // this.svgContainer.append('g')
        //     .call(this.xTopAxis);
        //
        // this.svgContainer.append('g')
        //     .attr('transform', 'translate(0,' + (0.85 * height) + ')')
        //     .call(this.xBottomAxis);
        //
        // this.svgContainer.append('g')
        //     .call(this.yLeftAxis);
        //
        // this.svgContainer.append('g')
        //     .attr('transform', function () {
        //         return 'translate(' + (0.85 * width) + ', 0)';
        //     })
        //     .call(this.yRightAxis);
}

    render () {
        return (
            <div/>
        );
    }
}
export default RamaData;