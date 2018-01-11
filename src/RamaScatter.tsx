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
        let coloursYGB = [
            '#FFFFDD',
            '#AAF191',
            '#80D385',
            '#61B385',
            '#3E9583',
            '#217681',
            '#285285',
            '#1F2D86',
            '#000086'];

        let max = 9.993981004842512E-4;
        let min = 0.0010012819800327606;

        let colorScale = d3.scaleLinear<string>()
            .domain(d3.ticks(min, max, 11))
            .range(['#5E4FA2', '#3288BD', '#66C2A5', '#ABDDA4', '#E6F598',
                '#FFFFBF', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142']);
        // let colourRangeYGB = d3.range(0, 1, 1.0 / (coloursYGB.length - 1));
        // let colorScaleYGB = d3.scaleLinear()
        //     .domain(colourRangeYGB)
        //     .range(colourRangeYGB)
        //     .interpolate(d3.interpolateHcl);
        //
        // var colorInterpolateYGB = d3.scaleLinear()
        //     .domain(d3.extent(somData))
        //     .range([0,1]);

        this.svgContainer.selectAll('circle').remove();
        // let down = new ParsePDB(this.state.pdb);
        // let parsed: object[] = down.downloadAndParse();
        let { jsonObject, typeOfPlot } = this.props;
        console.log(typeOfPlot);
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
        d3.json('/data/rama8000basic.json', function (dat: any) {
            jsonObject.forEach(function (d: any) {
                let phi = (2 * Math.floor(d['phi'] / 2) + 1).toFixed(1);
                dat[phi].forEach(function (i: any) {
                      if (i.psi === (2 * Math.floor(d['psi'] / 2) + 1)) {
                           d._value = i.value;
                       }
                  });
            });
        });

        // tooltip
        let toolTip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        this.svgContainer.selectAll('.shapes')
            .data(jsonObject.filter(function (d: any) {
                switch (typeOfPlot) {
                    case '1':
                        console.log(d.aa);
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
            .attr('r', 3.5)
            .attr('cx', this.xMap)
            .attr('cy', this.yMap)
            .merge(this.svgContainer)
            .style('fill', function (d: any) {
                console.log(d._value);
                // console.log(d._value);
                // return colorScale(d.value);
                // let phi = (2 * Math.floor(d['phi'] / 2) + 1).toFixed(1);
                // d3.json('/data/rama8000basic.json', function (dat: any) {
                //     for (let i = 0; i < dat[phi].length; i++) {
                //          if (i['psi'] === (2 * Math.floor(d['psi'] / 2) + 1).toFixed(1)) {
                //              return i['value'];
                //          }
                //         }
                // }
                // );
            })
                // d3.csv('/data/rama8000-general-noGPIVpreP.csv', function (dat: any) {
                //     console.log(dat);
                // return colorScale(dat.filter(e => {
                //     if (e.phi === (2 * Math.floor(d['phi'] / 2) + 1) &&
                //         e.psi === (2 * Math.floor(d['psi'] / 2) + 1)) {
                //         console.log(e.phi);
                //     }
                // }));
                // });
                // switch (d['rama']) {
                //     case 'Favored':
                //         return '#19667f';
                //     case 'OUTLIER':
                //         return '#ff0000';
                //     case 'Allowed':
                //         return '#0c7f3a';
                //     default:
                //         return '#ffe342';
                // }
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