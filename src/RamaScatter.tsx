import * as React from 'react';
import { Component } from 'react';
import * as d3 from 'd3';
import { func } from 'prop-types';

interface RamaProps {
    pdbID: string;
    width: number;
    height: number;
    jsonObject?: any[];
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
    dataGroup;
    contoursGroup;
    outliersTable;
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

    componentDidUpdate(nextProps: any, nextState: any) {
        this.basicContours();
        if (this.state.pdb.length === 4) {
            this.updateChart();
            return;
        }
        if (this.state.pdb === nextProps.pdbID) {
            return;
        }
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        if (nextState.pdb.length === 4 && nextProps.pdbID !== this.state.pdb)  {
            return true;
        }
        return nextProps.typeOfPlot !== this.state.contours;
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.pdbID !== this.state.pdb) {
            this.setState({
                pdb: nextProps.pdbID,
            });
        }
        if (nextProps.typeOfPlot !== this.state.contours) {
            this.setState({
                contours: nextProps.typeOfPlot,
            });
        }
        return;
    }

    createChart() {
        const {width, height} = this.props;

        // setup x
        const xScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, 0.85 * (width)]);

        this.xBottomAxis = d3.axisBottom(xScale);

        this.xTopAxis = d3.axisTop(xScale);

        this.xTopAxis = d3.axisTop(xScale)
            .tickSizeInner(-0.85 * width)
            .tickSizeOuter(0)
            .tickPadding(10);

        const xValue = function (d: object) {
            return d['phi'];
        };

        this.xMap = function (d: any) {return xScale(xValue(d)); };

        // setup y

        const yScale = d3.scaleLinear()
            .domain([180, -180])
            .range([0, 0.85 * (height)]);
        this.yLeftAxis = d3.axisLeft(yScale)
            .tickSizeInner(-0.85 * height)
            .tickSizeOuter(0)
            .tickPadding(10);

        this.yRightAxis = d3.axisRight(yScale);
        const yValue = function (d: object) {
            return d['psi'];
        };
        this.yMap = function (d: any) {
            return yScale(yValue(d));
        };

        // let yGrid = this.xBottomAxis.ticks(8)
        //     .tickSize(-height, 0)
        //     .tickFormat('');
        //
        // let xGrid = this.yLeftAxis.ticks(8)
        //     .tickSize(-height, 0)
        //     .tickFormat('');

        // setup container

        // function make_y_gridlines() {
        //     return d3.axisLeft(yScale);
        // }

        this.svgContainer = d3.select('#root').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('padding', '30px');

        // add axes

        this.svgContainer.append('g')
            .call(this.xTopAxis)
            .attr('class', 'grid');

        this.svgContainer.append('g')
            .attr('transform', 'translate(0,' + (0.85 * height) + ')')
            .call(this.xBottomAxis);

        this.svgContainer.append('g')
            .call(this.yLeftAxis)
            .attr('class', 'grid');

        this.svgContainer.append('g')
            .attr('transform', function () {
                return 'translate(' + (0.85 * width) + ', 0)';
            })
            .call(this.yRightAxis);

        // this.svgContainer.append('g')
        //     .attr('class', 'grid')
        //     .call(xGrid);
        //
        // this.svgContainer.append('g')
        //     .attr('class', 'grid')
        //     .attr('transform', 'translate(0,' + height + ')')
        //     .call(yGrid);

        // this.svgContainer.selectAll('line.x')
        //     .data(xScale.ticks(8))
        //     .enter().append('line')
        //     .attr('class', 'x')
        //     .attr('x1', xScale)
        //     .attr('x2', xScale)
        //     .attr('y1', -180)
        //     .attr('y2', 180)
        //     .style('stroke', '#ccc');
        //
        // this.svgContainer.selectAll('line.y')
        //     .data(xScale.ticks(8))
        //     .enter().append('line')
        //     .attr('class', 'y')
        //     .attr('x1', -180)
        //     .attr('x2', 180)
        //     .attr('y1', yScale)
        //     .attr('y2', yScale)
        //     .style('stroke', '#ccc');

        // this.svgContainer.append("g")
        //     .attr("class", "grid")
        //     .call(make_y_gridlines()
        //         .tickSize(-width)
        //         .tickFormat()
        //     );

        // outliers headline
        d3.select('#root').append('div')
            .attr('class', 'outl')
            .append('div')
            .attr('class', 'outliers-headline')
            .append('h4')
            .text('OUTLIERS');

        d3.select('.outl').append('div')
            .attr('class', 'outliers-container');

    }

    updateChart() {

        this.svgContainer.selectAll('.dataGroup').remove();
        let { width, height, jsonObject} = this.props;
        let { contours } = this.state;

        // scales
        const xScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, 0.85 * (width)]);

        const yScale = d3.scaleLinear()
            .domain([180, -180])
            .range([0, 0.85 * (height)]);

        // function stroke
        function stroke(d: any) {
            if (d.rama === 'OUTLIER') {
                return '#ca36ac';
            }
            if (d.aa === 'GLY') {
                return '#0aca40';
            }
            return 'black';
        }

        // tooltip
        let toolTip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('height', 0)
            .style('opacity', 0);

        // symbolTypes
        let symbolTypes = {
            'triangle': d3.symbol().type(d3.symbolTriangle).size(30),
            'circle': d3.symbol().type(d3.symbolCircle).size(30)
        };

        // outliersText
        d3.selectAll('.outliers').remove();
        d3.selectAll('table').remove();
        //
        d3.select('.outliers-container').append('table')
        .attr('class', 'table').append('thead').append('tr').attr('id', 'tab-headline');
        d3.select('#tab-headline').append('th').text('Chain');
        d3.select('#tab-headline').append('th').text('ID');
        d3.select('#tab-headline').append('th').text('AA');

        this.outliersTable = d3.select('.outliers-container').append('div')
            .attr('class', 'outliers').append('table')
            .attr('class', 'table table-hover table-responsive');

        let outliersList = [];

        this.svgContainer.selectAll('.shapes')
            .data(jsonObject.filter(function (d: any, i: number) {
                if (d.rama === 'OUTLIER') {
                    outliersList.push(d);
                }
                switch (contours) {
                    case '1':
                        return d;
                    case '2':
                        if (d.aa === 'ILE' || d.aa === 'VAL') {
                            return d;
                        }
                        break;
                    case '3':
                        if (i + 1 !== jsonObject.length && jsonObject[i + 1].aa === 'PRO') {
                            return d;
                        }
                        break;
                    case '4':
                        if (d.aa === 'GLY') {
                            return d;
                        }
                        break;
                    case '5':
                    case '6':
                    default:
                        return d;
                }

            }))
            .enter()
            .append('g')
            .append('path')
            .attr('class', 'dataGroup')
            .attr('id', function (d: any) {
                if (d.rama === 'OUTLIER') {
                    return d.aa + d.num;
                }
                return;
            })
            .attr('d', function (d: any) {
                if (d.aa === 'GLY') {
                    return symbolTypes.triangle();
                }
                return symbolTypes.circle();
            })
            .attr('transform', function(d: any) {
                return 'translate(' + xScale(d.phi) + ',' + yScale(d.psi) + ')';
            })
            .merge(this.svgContainer)
            .style('fill', 'none')
            .style('stroke', function (d: any) {
                return stroke(d);
            })
            .style('stroke-width', '1')
            .on('mouseover', function (d: any) {
                toolTip.transition()
                    .duration(50)
                    .style('opacity', .95);
                toolTip.html(
                    d.aa
                    + ' '
                    + d.num
                    + ' '
                    + d.chain
                    + '<br/>'
                    + 'phi: '
                    + d.phi
                    + '<br/>psi: '
                    + d.psi)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 38) + 'px');
                d3.select(this)
                    .attr('d', function (dat: any) {
                        if (dat.aa === 'GLY') {
                            symbolTypes.triangle.size(175);
                            return symbolTypes.triangle();
                        }
                        symbolTypes.circle.size(175);
                        return symbolTypes.circle();
                    })
                    .style('fill', function (dat: any) {
                        return stroke(dat);
                    });

            //
            })
            .on('mouseout', function () {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', function (dat: any) {
                            if (dat.aa === 'GLY') {
                                symbolTypes.triangle.size(50);
                                return symbolTypes.triangle();
                            }
                            symbolTypes.circle.size(50);
                            return symbolTypes.circle();
                        })
                        .style('fill', 'none')
                        .style('stroke', function (d: any) {
                            return stroke(d);
                        })
                        .style('stroke-width', '1');
                    toolTip.transition()
                        .duration(200)
                        .style('opacity', 0);
                }
            );
        outliersList.sort(function (a: any, b: any) {
            return a.num - b.num;
        });

        this.addTable(outliersList);
    }

    basicContours() {

        this.svgContainer.selectAll('#contoursGroup').remove();
        let min = 9.419397742547137e-7;
        let svg = this.svgContainer;

        const { contours } = this.state;

        let xMap = this.xMap;
        let yMap = this.yMap;

        let url = 'https://raw.githubusercontent.com/ondraab/rama/master/build/data/';
        switch (contours) {
            case '1':
                url += 'rama8000-general-noGPIVpreP.csv';
                break;
            case '2':
                url += 'rama8000-ileval-nopreP.csv';
                break;
            case '3':
                url += 'rama8000-prepro-noGP.csv';
                break;
            case '4':
                url += 'rama8000-gly-sym.csv';
                break;
            case '5':
                url += 'rama8000-transpro.csv';
                break;
            case '6':
                url += 'rama8000-cispro.csv';
                break;
            default:
                return;
        }

        d3.csv(url, function (error: any, data: any) {
            if (error) { throw error; }
            data.forEach(function (d: any) {
                d.psi = +d.psi;
                d.phi = +d.phi;
                d.value = +d.value;
                return d;
            });
            for (let i = 2; i <= data.length; i += 2) {
                data.splice(i, 30);
            }

            console.log(data);
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
            let line = d3.line()
                .x(function (d: any) {
                    return d.phi;
                })
                .y(function (d: any) {
                    return d.psi;
                });

            svg.selectAll('.shapes')
                .data(data)
                .enter()
                .append('g')
                .append('circle')
                .attr('id', 'contoursGroup')
                .attr('r', 9)
                .attr('cx', xMap)
                .attr('cy', yMap)
                // .attr('d', line(data))
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
    }

    addTable(sortedTable: any[]) {

        // function stroke
        function stroke(d: any) {
            if (d.rama === 'OUTLIER') {
                return '#ca36ac';
            }
            if (d.aa === 'GLY') {
                return '#0aca40';
            }
            return 'black';
        }

        let symbolTypes = {
            'triangle': d3.symbol().type(d3.symbolTriangle).size(30),
            'circle': d3.symbol().type(d3.symbolCircle).size(30)
        };

        let rows = this.outliersTable.selectAll('tbody tr')
            .data(sortedTable, function (d: any) {return d.num; });

        rows.enter()
            .append('tr')
            .on('mouseover', function (d: any, i: any) {
                d3.select(this)
                    .style('background-color', '#b4bed6')
                    .style('cursor', 'pointer');
                d3.select('#' + d.aa + d.num)
                    .attr('d', function (dat: any) {
                        if (dat.aa === 'GLY') {
                            symbolTypes.triangle.size(175);
                            return symbolTypes.triangle();
                        }
                        symbolTypes.circle.size(175);
                        return symbolTypes.circle();
                    })
                    .style('fill', function (dat: any) {
                        return stroke(dat);
                    });
            })
            .on('mouseout', function (d: any, i: any) {
                d3.select(this)
                    .style('background-color', 'transparent')
                    .style('cursor', 'default');
                d3.select('#' + d.aa + d.num)
                    .transition()
                    .duration(200)
                    .attr('d', function (dat: any) {
                        if (dat.aa === 'GLY') {
                            symbolTypes.triangle.size(50);
                            return symbolTypes.triangle();
                        }
                        symbolTypes.circle.size(50);
                        return symbolTypes.circle();
                    })
                    .style('fill', 'none')
                    .style('stroke', function (d: any) {
                        return stroke(d);
                    })
                    .style('stroke-width', '1');
            })
            .selectAll('td')
            .data(function (d: any) {return [d.chain, d.num, d.aa]; })
            .enter()
            .append('td')
            .text(function(d: any) { return d; });

        rows.exit().remove();
        //
        let cells = rows.selectAll('td')
            .data(function (d: any) {return [d.chain, d.num, d.aa]; })
            .text(function (d: any) {return d; });
        //
        cells.enter()
            .append('td')
            .text(function(d: any) { return d; });

        cells.exit().remove();
    }

    render () {
        return (
            <div/>
        );
    }
}
export default RamaData;