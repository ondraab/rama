import * as React from 'react';
import { Component } from 'react';
import * as d3 from 'd3';
import * as d3Contour from 'd3-contour';
import { generalContour, cisPro, gly, ileVal, prePro, transPro } from './HeatMapContours';
import { lineGeneralContour, lineCisPro, lineGly, lineIleVal, linePrePro, lineTransPro } from './LineContours';

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
    leftPadding;
    padding;
    selectEvent;
    constructor(props: any) {
        super(props);
        this.leftPadding = 50;
        this.padding = 30;
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
        if (nextProps.chainsToShow.length !== this.state.chainsToShow.length) {
            if (this.state.initial === true) {
                this.basicContours(nextProps.typeOfPlot, nextProps.contourType);
            }
            this.updateChart(nextProps.jsonObject, nextProps.chainsToShow, nextProps.typeOfPlot);
            return;
        }
        if (nextProps.typeOfPlot !== this.state.contours) {
            this.updateChart(nextProps.jsonObject, nextProps.chainsToShow, nextProps.typeOfPlot);
            this.basicContours(nextProps.typeOfPlot, nextProps.contourType);
        }
        if (nextProps.contourType !== this.state.contourType) {
            this.basicContours(nextProps.typeOfPlot, nextProps.contourType);
        }

    }

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

        if (width > 768) {
            width = 580;
        }
        if (height > 768) {
            height = 580;
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
            return d3.axisRight(yScale);
        }

        function makeXGridlines() {
            return d3.axisTop(xScale);
        }

        this.svgContainer = d3.select('.rama-root').append('div')
            .attr('id', 'rama-svg-container')
            .append('svg')
            .classed('svg-container', true)
            .attr('id', 'rama-svg')
            // .attr('width', width)
            // .attr('height', height)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 ' + width + ' ' + height)
            .classed('svg-content-responsive', true)
            // .style('padding', '30px 30px 30px 50px')
            .style('overflow', 'visible')
            .style('fill', 'transparent');
        //
        this.canvasContainer = d3.select('#rama-svg-container')
            .append('canvas')
            .classed('img-responsive', true)
            .attr('id', 'rama-canvas')
            .attr('width', width)
            .attr('height', height)
            .classed('svg-content-responsive', true)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 ' + width + ' ' + height)
            // .style('padding', '30px 30px 30px 50px')
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
                return 'translate(' + (width) + ', 0)';
            })
            .call(this.yRightAxis)
            .attr('id', 'y-axis');

        this.svgContainer.append('g')
            .attr('class', 'rama-grid')
            .attr('transform', 'translate(0,' + height + ')')
            .call(makeXGridlines()
                .tickSize(width));

        this.svgContainer.append('g')
            .attr('class', 'rama-grid')
            .call(makeYGridlines()
                .tickSize(height));

        // axis labels

        this.svgContainer.append('text')
            .attr('x', width / 2 )
            .attr('y', height + 35)
            .style('text-anchor', 'middle')
            .style('fill', '#000')
            .text('Phi');

        this.svgContainer.append('text')
            .attr('x', -35 )
            .attr('y', height / 2)
            .style('text-anchor', 'middle')
            .style('fill', '#000')
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

    // resize() {
    //     let svg = this.svgContainer;
    //     let width = svg.clientWidth;
    //     let height = svg.clientHeight;
    //
    //     svg
    //         .attr('width', width)
    //         .attr('height', height);
    //
    //     if (!this.state.initial) {
    //         this.updateChart(this.props.jsonObject, this.props.chainsToShow, this.props.typeOfPlot);
    //         this.basicContours(this.props.typeOfPlot, this.props.contourType);
    //     }
    // }

    updateChart(jsonObject: any[], chainsToShow: any[], contours: string) {

        this.svgContainer.selectAll('g.dataGroup').remove();
        let { width, height } = this.props;

        if (width > 768) {
            width = 580;
        }
        if (height > 768) {
            height = 580;
        }
        let objSize = 40;
        if (window.screen.availWidth < 1920) {
            objSize = 30;
        }

        let { initial } = this.state;
        let outliersList = [],
            svg = this.svgContainer;

        // scales
        const xScale = d3.scaleLinear()
            .domain([-180, 180])
            .range([0, (width)]);
            // .range([0, (0.985 * width)]);

        const yScale = d3.scaleLinear()
            .domain([180, -180])
            .range([0, (width)]);
            // .range([0, (0.985 * height)]);
            //
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
            'triangle': d3.symbol().type(d3.symbolTriangle).size(objSize),
            'circle': d3.symbol().type(d3.symbolCircle).size(objSize)
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
                    if (d.cisPeptide === null && d.aa === 'PRO') {
                        return d;
                    }
                    break;
                case '6':
                    if (d.cisPeptide === 'Y' && d.aa === 'PRO') {
                        return d;
                    }
                    break;
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
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('Chain')
            .style('width', '30%').style('min-width', '50px');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('ID')
            .style('width', '30%').style('min-width', '50px');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('AA');

        this.outliersTable = d3.select('.outliers-container').append('div')
            .attr('class', 'outliers').append('table')
            .attr('class', 'table table-hover table-responsive');

        this.svgContainer.selectAll('.shapes')
            .data(jsonObject.filter(function (d: any, i: number) {
                if (initial || chainsToShow.indexOf(d.chain) !== -1) {
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
                return 'translate(' + xScale(d.phi) + ',' +  yScale(d.psi) + ')';
            })
            .merge(this.svgContainer)
            .style('fill', 'transparent')
            .style('stroke', function (d: any) {
                return stroke(d);
            })
            .style('stroke-width', '0.5')
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
                    .style('left', (d3.event.pageX + 10) + 'px')
                    .style('top', (d3.event.pageY - 48) + 'px');
                d3.select(this)
                    //
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
                        // .duration(50)
                        .attr('d', function (dat: any) {
                            if (dat.aa === 'GLY') {
                                symbolTypes.triangle.size(objSize);
                                return symbolTypes.triangle();
                            }
                            symbolTypes.circle.size(objSize);
                            return symbolTypes.circle();
                        })
                        .style('fill', 'transparent')
                        .style('stroke', function (d: any) {
                            return stroke(d);
                        })
                        .style('stroke-width', '0.5');
                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 0);
                }
            );
        outliersList.sort(function (a: any, b: any) {
            return a.num - b.num;
        });
        this.setState({
            initial: false
        });
        this.addTable(outliersList);
    }

    basicContours(contours: string, contourType: number) {
        d3.select('#rama-canvas-container').empty();
        d3.selectAll('.contour-line').remove();
        let canvas = this.canvasContainer;
        let svg = this.svgContainer;

        let { width, height } = this.props;

        if (width > 768) {
            width = 580;
        }
        if (height > 768) {
            height = 580;
        }
        //
        // let node: any = (d3.select('svg.svg-container').node());
        // let width = (node.getBoundingClientRect().width) - this.leftPadding - this.padding;
        // let height = (node.getBoundingClientRect().height) - this.leftPadding - this.padding;
        // console.log(width, height);
        // const xScale = d3.scaleLinear()
        //     .domain([-180, 180])
        //     .range([0, (width)]);
        //     // .range([0, (0.985 * width)]);
        //
        // const yScale = d3.scaleLinear()
        //     .domain([180, -180])
        //     .range([0, (height)]);
        //     // .range([0, (0.985 * height)]);

        // let url = 'https://raw.githubusercontent.com/ondraab/rama/master/public/data/';
        let img = new Image;
        let svgImg = new Image;
        switch (contours) {
            case '1':
                // url += 'rama8000-general-noGPIVpreP.csv';
                img.src = generalContour;
                svgImg.src = lineGeneralContour;
                break;
            case '2':
                // url += 'rama8000-ileval-nopreP.csv';
                img.src = ileVal;
                svgImg.src = lineIleVal;
                break;
            case '3':
                // url += 'rama8000-prepro-noGP.csv';
                img.src = prePro;
                svgImg.src = linePrePro;
                break;
            case '4':
                // url += 'rama8000-gly-sym.csv';
                img.src = gly;
                svgImg.src = lineGly;
                break;
            case '5':
                // url += 'rama8000-transpro.csv';
                img.src = transPro;
                svgImg.src = lineTransPro;
                break;
            case '6':
                // url += 'rama8000-cispro.csv';
                img.src = cisPro;
                svgImg.src = lineCisPro;
                break;
            default:
                return;
        }

        let context = canvas.node().getContext('2d');
        context.clearRect(0, 0, width + 80, height + 60);

        if (contourType === 2) {
            img.onload = function () {
                    context.drawImage(img, 0, 0,
                                      width, height * img.height / img.width
                    );
                };
        } else {
            svgImg.onload = function () {
                context.drawImage(svgImg, 0, 0,
                                  width, height * svgImg.height / svgImg.width
                );
            };
            // setTimeout(function () {
            //             // let s = new XMLSerializer().serializeToString(document.getElementById('rama-svg'));
            //             // let encode = window.btoa(s);
            //     let enc: any = document.getElementById('rama-canvas');
            //             console.log(enc.toDataURL());
            //         },         3000);
            // // console.log(canvas.toDataURL());
            // d3.csv(url, function (error: any, data: any) {
            //     if (error) {
            //         throw error;
            //     }
            //     let median = d3.median(data, function (d: any) {
            //         return d.value;
            //     });
            //     let max = d3.max(data, function (d: any) {
            //         return +d.value;
            //     });
            //     data.sort(function (a: any, b: any) {
            //         return a.value - b.value;
            //     });
            //     data.forEach(function (d: any) {
            //         d.psi = +d.psi;
            //         d.phi = +d.phi;
            //         d.value = +d.value;
            //     });
            //     let scale = 'scale(0.965, 0.965), translate(16, 16)';
            //     switch (contours) {
            //         case '3':
            //             data.splice(0, data.length / 1.7);
            //             break;
            //         case '4':
            //             data.splice(0, data.length / 1.9);
            //             scale = 'translate(7,7),scale(0.995,0.995)';
            //             break;
            //         case '6':
            //             scale = 'scale(0.985, 0.985), translate(13, 13)';
            //             break;
            //         default:
            //             data.splice(0, data.length / 1.8);
            //     }
            //
            //     svg.selectAll('.shapes')
            //         .data(d3Contour.contourDensity()
            //             .x(function (d: any) {
            //                 return xScale(d.phi);
            //             })
            //             .y(function (d: any) {
            //                 return yScale(d.psi);
            //             })
            //             .size([height, width])
            //             .thresholds(d3.range(median, max, 5))
            //             .cellSize(1)
            //             .bandwidth(6)
            //             (data))
            //         //
            //         .enter()
            //         .append('path')
            //         .attr('stroke', '#1359eb')
            //         .attr('stroke-width', '2')
            //         .attr('fill', 'none')
            //         .attr('class', 'contour-line')
            //         .attr('margin', '30px')
            //         .attr('d', d3.geoPath())
            //         .attr('transform', scale);
            //     // scale(0.99, 0.99),
            //     switch (contours) {
            //         case '4':
            //             data.splice(0, data.length / 2.5);
            //             break;
            //         case '5':
            //             data.splice(0, data.length / 1.6);
            //             break;
            //         default:
            //             data.splice(0, data.length / 1.7);
            //             break;
            //     }
            //     // let elem:any = svg.getElementsByClassName('contour-line').width;
            //     // console.log(elem);
            //     svg.selectAll('.shapes')
            //         .data(d3Contour.contourDensity()
            //             .x(function (d: any) {
            //                 return xScale(d.phi);
            //             })
            //             .y(function (d: any) {
            //                 return yScale(d.psi);
            //             })
            //             .size([height, width])
            //             .thresholds(d3.range(median, max, 5))
            //             .cellSize(1)
            //             .bandwidth(6)
            //             (data))
            //         .enter()
            //         .append('path')
            //         .attr('stroke', '#3ee2eb')
            //         .attr('stroke-width', '2')
            //         .attr('fill', 'none')
            //         .attr('class', 'contour-line')
            //         .attr('margin', '30px')
            //         .attr('d', d3.geoPath())
            //         .attr('transform', scale);
            // // //    scale(0.99,0.99),
            // });
            // if (contours !== '1') {
            //     setTimeout(function () {
            //         let s = new XMLSerializer().serializeToString(document.getElementById('rama-svg'));
            //         let encode = window.btoa(s);
            //         console.log('data:image/svg+xml;base64,' + encode);
            //     },         3000);
            // }
        //
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
                    // .duration(50)
                    .attr('d', function (dat: any) {
                        if (dat.aa === 'GLY') {
                            symbolTypes.triangle.size(40);
                            return symbolTypes.triangle();
                        }
                        symbolTypes.circle.size(40);
                        return symbolTypes.circle();
                    })
                    .style('fill', 'transparent')
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
            .style('width', '30%')
            .style('min-width', '50px')
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