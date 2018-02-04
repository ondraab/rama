import * as React from 'react';
import { Component } from 'react';
import * as d3 from 'd3';
import * as d3Contour from 'd3-contour/';

interface RamaProps {
    pdbID: string;
    width: number;
    height: number;
    jsonObject?: any[];
    typeOfPlot?: string;
    chainsToShow?: string[];
    contourType: number;
}

interface States {
    pdb: string;
    contours: string;
    chainsToShow: any[];
    jsonObject: any[];
    initial: boolean;
    contourType: number;
}

class RamaData extends Component<RamaProps, States> {
    svgContainer;
    xMap;
    yMap;
    xTopAxis;
    xBottomAxis;
    yLeftAxis;
    yRightAxis;
    dataGroup;
    outliersTable;
    canvasContainer;
    constructor(props: any) {
        super(props);
        this.createChart = this.createChart.bind(this);
        this.state = {
            pdb: this.props.pdbID,
            contours: this.props.typeOfPlot,
            chainsToShow: [],
            jsonObject: [],
            initial: true,
            contourType: 1,
        };
    }

    componentDidMount() {
        this.createChart();
    }

    componentWillUpdate(nextProps: any, nextState: any) {
        if (nextProps.typeOfPlot !== this.state.contours || this.state.initial ) {
            this.basicContours(nextProps.typeOfPlot, nextProps.contourType);
            this.updateChart(nextProps.jsonObject, nextProps.chainsToShow, nextProps.typeOfPlot);
            return;
        }
        if (nextProps.constructor !== this.state.contourType) {
            this.basicContours(nextProps.typeOfPlot, nextProps.contourType);
        }
        if (nextProps.pdbID !== this.state.pdb || nextProps.chainsToShow.length !== this.state.chainsToShow.length) {
            this.updateChart(nextProps.jsonObject, nextProps.chainsToShow, nextProps.typeOfPlot);
        }
    }
    //
    shouldComponentUpdate(nextProps: any, nextState: any) {
        if (nextState.pdb.length === 4 && nextProps.pdbID !== this.state.pdb)  {
            return true;
        }
        if (nextProps.typeOfPlot !== this.state.contours) {
            return true;
        }
        if (nextProps.contourType !== this.state.contourType) {
            return true;
        }
        return nextProps.chainsToShow.length !== this.state.chainsToShow.length;

    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.pdbID !== this.state.pdb) {
            this.setState({
                pdb: nextProps.pdbID,
                jsonObject: nextProps.jsonObject,
                chainsToShow: nextProps.chainsToShow,
                initial: false,
            });
        }
        if (nextProps.typeOfPlot !== this.state.contours) {
            this.setState({
                contours: nextProps.typeOfPlot,
            });
        }
        if (nextProps.chainsToShow  !== this.state.chainsToShow) {
            this.setState({
                chainsToShow: nextProps.chainsToShow,
            });
        }
        if (nextProps.contourType  !== this.state.contourType) {
            this.setState({
                contourType: nextProps.contourType,
            });
        }
        return;
    }

    createChart() {
        let {width, height} = this.props;

        if (width > 736) {
            width = 736;
        }
        if (height > 736) {
            height = 736;
        }

        // setup x
        const xScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, (width)]);

        this.xBottomAxis = d3.axisBottom(xScale);

        this.xTopAxis = d3.axisTop(xScale);

        this.xTopAxis = d3.axisTop(xScale);

        const xValue = function (d: object) {
            return d['phi'];
        };

        this.xMap = function (d: any) {return xScale(xValue(d)); };

        // setup y

        const yScale = d3.scaleLinear()
            .domain([180, -180])
            .range([0, (height)]);
        this.yLeftAxis = d3.axisLeft(yScale);

        this.yRightAxis = d3.axisRight(yScale);
        const yValue = function (d: object) {
            return d['psi'];
        };
        this.yMap = function (d: any) {
            return yScale(yValue(d));
        };

        function makeYGridlines() {
            return d3.axisLeft(yScale);
        }

        function makeXGridlines() {
            return d3.axisBottom(xScale)
                .ticks(8);
        }

        this.svgContainer = d3.select('.rama-root').append('div')
            .attr('id', 'rama-svg-container')
            .append('svg')
            .classed('svg-container', true)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 ' + width + ' ' + height)
            .classed('svg-content-responsive', true)
            .style('padding', '30px 30px 30px 40px')
            .style('overflow', 'visible')
            .style('fill', 'transparent');

        this.canvasContainer = d3.select('#rama-svg-container')
            .append('canvas')
            .classed('img-responsive', true)
            .attr('id', 'rama-canvas')
            .attr('width', width)
            .attr('height', height)
            .style('padding', '30px 30px 30px 40px')
            .style('overflow', 'visible');

        // add axes

        this.svgContainer.append('g')
            .call(this.xTopAxis)
            .attr('id', 'x-axis');

        this.svgContainer.append('g')
            .attr('transform', 'translate(0,' + (height) + ')')
            .call(this.xBottomAxis)
            .attr('id', 'x-axis');

        this.svgContainer.append('g')
            .call(this.yLeftAxis)
            .attr('id', 'y-axis');

        this.svgContainer.append('g')
            .attr('transform', function () {
                return 'translate(' + ( width) + ', 0)';
            })
            .call(this.yRightAxis)
            .attr('id', 'y-axis');

        this.svgContainer.append('g')
            .attr('class', 'rama-grid')
            .attr('transform', 'translate(0,' + height + ')')
            .call(makeXGridlines()
                .tickSize(-height));

        this.svgContainer.append('g')
            .attr('class', 'rama-grid')
            .call(makeYGridlines()
                .tickSize(-height));

        // axis labels

        this.svgContainer.append('text')
            .attr('x', width / 2 )
            .attr('y', height + 35)
            .style('text-anchor', 'middle')
            .text('Phi');

        this.svgContainer.append('text')
            .attr('x', -35 )
            .attr('y', height / 2)
            .style('text-anchor', 'middle')
            .text('Psi');

        // outliers headline
        d3.select('.rama-root').append('div')
            .attr('class', 'rama-outliers-div')
            .append('div')
            .attr('class', 'rama-outliers-headline')
            .append('h4')
            .text('OUTLIERS');

        d3.select('.rama-outliers-div').append('div')
            .attr('class', 'outliers-container');
        d3.selectAll('g.rama-grid g.tick text').remove();
    }

    updateChart(jsonObject: any[], chainsToShow: any[], contours: string) {

        this.svgContainer.selectAll('g.dataGroup').remove();
        let { width, height } = this.props;
        let outliersList = [];

        // scales
        const xScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, (width)]);

        const yScale = d3.scaleLinear()
            .domain([180, -180])
            .range([0, (height)]);

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
            .attr('class', 'rama-tooltip')
            .attr('height', 0)
            .style('opacity', 0);

        // symbolTypes
        let symbolTypes = {
            'triangle': d3.symbol().type(d3.symbolTriangle).size(40),
            'circle': d3.symbol().type(d3.symbolCircle).size(40)
        };

        function switchPlotType(d: any, i: number) {
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
        }

        // outliersText
        d3.selectAll('.outliers').remove();
        d3.selectAll('table').remove();
        //
        d3.select('.outliers-container').append('table')
        .attr('class', 'rama-outliers-table').append('thead').append('tr').attr('id', 'tab-headline');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('Chain');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('ID');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('AA');

        this.outliersTable = d3.select('.outliers-container').append('div')
            .attr('class', 'outliers').append('table')
            .attr('class', 'table table-hover table-responsive');
        //
        this.svgContainer.selectAll('.shapes')
            .data(jsonObject.filter(function (d: any, i: number) {

                if (chainsToShow.indexOf(d.chain) !== -1) {
                    if (d.phi !== null || d.psi !== null) {
                        return switchPlotType(d, i);
                    }
                }
            }))
            .enter()
            .append('g')
            .attr('class', 'dataGroup')
            .append('path')
            .attr('id', function (d: any) {
                if (d.rama === 'OUTLIER') {
                    outliersList.push(d);
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

            })
            .on('mouseout', function () {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('d', function (dat: any) {
                            if (dat.aa === 'GLY') {
                                symbolTypes.triangle.size(40);
                                return symbolTypes.triangle();
                            }
                            symbolTypes.circle.size(40);
                            return symbolTypes.circle();
                        })
                        .style('fill', 'none')
                        .style('stroke', function (d: any) {
                            return stroke(d);
                        })
                        .style('stroke-width', '1');
                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 0);
                }
            );
        outliersList.sort(function (a: any, b: any) {
            return a.num - b.num;
        });
        this.addTable(outliersList);
    }

    basicContours(contours: string, contourType: number) {
        d3.select('#rama-canvas-container').empty();
        d3.selectAll('.contour-line').remove();
        let canvas = this.canvasContainer;
        let svg = this.svgContainer;

        const { width, height } = this.props;

        const xScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, (width)]);

        const yScale = d3.scaleLinear()
            .domain([180, -180])
            .range([0, (height)]);

        let url = 'https://raw.githubusercontent.com/ondraab/rama/master/public/data/';
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

        let context = canvas.node().getContext('2d');
        context.clearRect(0, 0, width, height);

        if (contourType === 2) {
            let heatColorScale = d3.scaleLinear<string>()
                .domain([9.419397742547137e-7, 0.045])
                .interpolate(d3.interpolateRgb)
                .range([
                    '#fff28d',
                    '#fac524',
                    '#660a00']);
            d3.csv(url, function (error: any, data: any) {
                if (error) { throw error; }
                let median = d3.median(data, function (d: any) {
                    return d.value;
                });
                data.forEach(function (d: any) {
                d.psi = +d.psi;
                d.phi = +d.phi;
                d.value = +d.value;
                if (d.value < median) {
                    return;
                }
                context.globalAlpha = 0.2;
                context.beginPath();
                context.arc(xScale(d.phi), yScale(d.psi), 5, 0, 2 * Math.PI);
                context.fillStyle = heatColorScale(d.value);
                context.fill();
                context.closePath();
            });
            });
        } else {
            d3.csv(url, function (error: any, data: any) {
                if (error) {
                    throw error;
                }
                let median = d3.median(data, function (d: any) {
                    return d.value;
                });
                let max = d3.max(data, function (d: any) {
                    return +d.value;
                });
                data.sort(function (a: any, b: any) {
                    return a.value - b.value;
                });
                data.forEach(function (d: any) {
                    d.psi = +d.psi;
                    d.phi = +d.phi;
                    d.value = +d.value;
                });
                switch (contours) {
                    case '3':
                        data.splice(0, data.length / 1.7);
                        break;
                    case '4':
                        data.splice(0, data.length / 1.9);
                        break;
                    default:
                        data.splice(0, data.length / 1.85);
                }

                svg.selectAll('.shapes')
                    .data(d3Contour.contourDensity()
                        .x(function (d: any) {
                            return xScale(d.phi);
                        })
                        .y(function (d: any) {
                            return yScale(d.psi);
                        })
                        .size([height, width])
                        .thresholds(d3.range(median, max, 5))
                        .cellSize(9)
                        .bandwidth(5)
                        (data))
                    .enter()
                    .append('path')
                    .attr('id', 'contour-line')
                    .attr('stroke', '#1359eb')
                    .attr('stroke-width', '2')
                    .attr('fill', 'none')
                    .attr('class', 'contour-line')
                    .attr('margin', '30px')
                    .attr('d', d3.geoPath())
                    .attr('transform', 'scale(0.985,0.985),translate(5, 5)');
                //
                switch (contours) {
                    case '4':
                        data.splice(0, data.length / 2.5);
                        break;
                    case '5':
                        data.splice(0, data.length / 1.6);
                        break;
                    default:
                        data.splice(0, data.length / 1.8);
                        break;
                }
                svg.selectAll('.shapes')
                    .data(d3Contour.contourDensity()
                        .x(function (d: any) {
                            return xScale(d.phi);
                        })
                        .y(function (d: any) {
                            return yScale(d.psi);
                        })
                        .size([height, width])
                        .thresholds(d3.range(median, max, 5))
                        .cellSize(9)
                        .bandwidth(5)
                        (data))
                    .enter()
                    .append('path')
                    .attr('stroke', '#3ee2eb')
                    .attr('stroke-width', '2')
                    .attr('fill', 'none')
                    .attr('id', 'contour-line')
                    .attr('class', 'contour-line')
                    .attr('margin', '30px')
                    .attr('d', d3.geoPath())
                    .attr('transform', 'scale(0.985,0.985),translate(5, 5)');
            });
        }
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
            .on('mouseover', function (d: any) {
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
            .on('mouseout', function (d: any) {
                d3.select(this)
                    .style('background-color', 'transparent')
                    .style('cursor', 'default');
                d3.select('#' + d.aa + d.num)
                    .transition()
                    .duration(50)
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
            .attr('id', 'rama-td')
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