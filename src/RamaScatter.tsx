import * as React from 'react';
import { Component } from 'react';
import * as d3 from 'd3';
import { generalContour, cisPro, gly, ileVal, prePro, transPro } from './HeatMapContours';
import { lineGeneralContour, lineCisPro, lineGly, lineIleVal, linePrePro, lineTransPro } from './LineContours';
import ParsePDB from './parsePDB';
import * as webComponents from 'webcomponents.js';

interface RamaProps {
    pdbID: string;
    width: number;
    height: number;
    ramaContourPlotType: number;
    chainsToShow: string[];
    contourColoringStyle: number;
    modelsToShow: number[];
    residueColorStyle: number;
}

interface States {
    pdb: string;
    ramaContourPlotType: number;
    chainsToShow: any[];
    initial: boolean;
    contourColoringStyle: number;
    modelsToShow: number[];
    residueColorStyle: number;
}

class RamaData extends Component<RamaProps, States> {
    svgContainer;
    jsonObject;
    xMap;
    yMap;
    xTopAxis;
    xBottomAxis;
    yLeftAxis;
    yRightAxis;
    dataGroup;
    outliersTable;
    canvasContainer;
    tooltip;
    outliersType;
    rsrz;
    clashes;
    ramachandranOutliers;
    sidechainOutliers;
    rsrzCount;
    constructor(props: any) {
        super(props);
        // this.leftPadding = 50;
        // this.padding = 30;
        this.createChart = this.createChart.bind(this);
        let pdb = new ParsePDB(this.props.pdbID);
        pdb.downloadAndParse();
        this.jsonObject = pdb.residueArray;
        this.outliersType = pdb.outlDict;
        this.rsrz = pdb.rsrz;
        // this.clashes = pdb.clashes;
        // this.ramachandranOutliers = pdb.ramachandranOutliers;
        // this.sidechainOutliers = pdb.sidechainOutliers;
        // this.rsrzCount = pdb.rsrzCount;
        this.ramachandranOutliers = 0;
        this.sidechainOutliers = 0;
        this.rsrzCount = 0;
        this.clashes = 0;
        this.state = {
            pdb: this.props.pdbID,
            ramaContourPlotType: this.props.ramaContourPlotType,
            chainsToShow: ['A'],
            initial: true,
            contourColoringStyle: 1,
            modelsToShow: [1],
            residueColorStyle: 1,
        };
        this.stroke = this.stroke.bind(this);
    }
    //
    componentDidMount() {
        this.createChart();
    }

    componentWillUpdate(nextProps: any, nextState: any) {

        // if (nextProps.jsonObject !== this.props.jsonObject) {
        //     this.updateChart(nextProps.jsonObject, nextProps.chainsToShow, nextProps.ramaContourPlotType);
        //     return;
        // }

        if (nextProps.pdbID !== this.state.pdb || nextProps.chainsToShow !== this.state.chainsToShow ||
            nextProps.modelsToShow !== this.state.modelsToShow) {
            this.updateChart(nextProps.chainsToShow, nextProps.ramaContourPlotType, nextProps.modelsToShow,
                             nextProps.residueColorStyle);
            // console.log(nextProps.contourColoringStyle, this.state.contourColoringStyle);
        }
        if (nextProps.ramaContourPlotType !== this.state.ramaContourPlotType) {
            this.updateChart(nextProps.chainsToShow, nextProps.ramaContourPlotType, nextProps.modelsToShow,
                             nextProps.residueColorStyle);
            this.basicContours(nextProps.ramaContourPlotType, nextProps.contourColoringStyle);
        }
        if (nextProps.residueColorStyle !== this.state.residueColorStyle) {
            this.updateChart(nextProps.chainsToShow, nextProps.ramaContourPlotType, nextProps.modelsToShow,
                             nextProps.residueColorStyle);
        }
        if (nextProps.contourColoringStyle !== this.state.contourColoringStyle) {
            // console.log(nextProps.contourColoringStyle, this.state.contourColoringStyle);
            this.basicContours(nextProps.ramaContourPlotType, nextProps.contourColoringStyle);
        }

    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        if (nextState.pdb.length === 4 && nextProps.pdbID !== this.state.pdb)  {
            return true;
        }
        if (nextProps.ramaContourPlotType !== this.state.ramaContourPlotType) {
            return true;
        }
        if (nextProps.contourColoringStyle !== this.state.contourColoringStyle) {
            return true;
        }
        if (nextProps.modelsToShow.length !== this.state.modelsToShow.length) {
            return true;
        }
        if (nextProps.residueColorStyle !== this.state.residueColorStyle) {
            return true;
        }
        return nextProps.chainsToShow.length !== this.state.chainsToShow.length;
    }

    componentWillReceiveProps(nextProps: any) {
        //
        if (nextProps.pdbID !== this.state.pdb) {
            let pdb = new ParsePDB(nextProps.pdbID);
            pdb.downloadAndParse();
            this.jsonObject = [];
            this.jsonObject = pdb.residueArray;
            this.outliersType = pdb.outlDict;
            this.rsrz = pdb.rsrz;
            this.setState({
                pdb: nextProps.pdbID,
                chainsToShow: nextProps.chainsToShow,
                modelsToShow: nextProps.modelsToShow,
                // rsrz: nextProps.rsrz,
                // outliersType: nextProps.outliersType
            });
            return;
        }
        if (nextProps.ramaContourPlotType !== this.state.ramaContourPlotType) {
            this.setState({
                ramaContourPlotType: nextProps.ramaContourPlotType,
            });
        }
        if (nextProps.chainsToShow  !== this.state.chainsToShow) {
            this.setState({
                chainsToShow: nextProps.chainsToShow,
            });
        }
        if (nextProps.contourType  !== this.state.contourColoringStyle) {
            this.setState({
                contourColoringStyle: nextProps.contourColoringStyle,
            });
        }
        if (nextProps.modelsToShow !== this.state.modelsToShow) {
            this.setState({
                modelsToShow: nextProps.modelsToShow,
            });
        }
        if (nextProps.residueColorStyle !== this.state.residueColorStyle) {
            this.setState({
                residueColorStyle: nextProps.residueColorStyle,
            });
        }
        // if (nextProps.outliersType !== this.state.outliersType) {
        //     this.setState({
        //         outliersType: nextProps.outliersType,
        //     });
        // }
        // if (nextProps.rsrz !== this.state.rsrz) {
        //     this.setState({
        //         rsrz: nextProps.rsrz,
        //     });
        // }
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

        // tooltip
        this.tooltip = d3.select('body').append('div')
            .attr('class', 'rama-tooltip')
            .attr('height', 0)
            .style('opacity', 0);

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

        this.svgContainer = d3.select('div#rama-root').append('div')
            .attr('id', 'rama-svg-container')
            .attr('height', height)
            .attr('border', '1px solid black')
            .append('svg')
            .attr('max-width', width)
            .classed('svg-container', true)
            .attr('id', 'rama-svg')
            // .attr('width', width)
            // .attr('height', height)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 ' + width + ' ' + height)
            .classed('svg-content-responsive', true)
            // .style('padding', '30px 30px 30px 50px')
            .style('overflow', 'visible');
            // .style('fill', 'transparent');

        // d3.select('svg.svg-container').append('clipPath')
        //     .attr('id', 'clipRect')
        //     .append('rect')
        //     .attr('width', '580')
        //     .attr('height', '580');
            // .attr('cx', '100');

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

        // // add axes

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
        // phi label
        this.svgContainer.append('text')
            .attr('x', width / 2 )
            .attr('y', height + 35)
            .style('text-anchor', 'middle')
            .style('fill', '#000')
            .text('\u03A6');

        // psi label
        this.svgContainer.append('text')
            .attr('x',  0 - (height / 2))
            .attr('y', -35)
            .style('text-anchor', 'middle')
            .style('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .text('\u03A8');
        //
        // // outliers headline
        // d3.select('#rama-root').append('div')
        //     .attr('class', 'rama-outliers-div')
        //     .append('div')
        //     .attr('class', 'rama-outliers-headline')
        //     .append('h4')
        //     .text('OUTLIERS');
        //
        // d3.select('.rama-outliers-div').append('div')
        //     .attr('class', 'outliers-container');
        d3.selectAll('g.rama-grid g.tick text').remove();
        // console.log(this.props.rsrz);
        d3.select('#rama-svg-container').append('div').attr('id', 'rama-sum').attr('class', 'rama-set-cl');
        d3.select('#rama-svg-container').append('div').attr('id', 'rama-settings').attr('class', 'rama-set-cl');

        this.updateChart(this.props.chainsToShow, this.props.ramaContourPlotType, this.props.modelsToShow,
                         this.props.residueColorStyle);
        this.basicContours(this.props.ramaContourPlotType, this.props.contourColoringStyle);
    }

    stroke(d: any, drawingType: number, outliersType: any, rsrz: any, compute: boolean = false) {
        switch (drawingType) {
            case 1:
                if (d.rama === 'OUTLIER') {
                    return '#f00';
                }
                return 'black';
            case 2:
                if (typeof outliersType[d.num] === 'undefined') {
                    return '#008000';
                } else {
                    if (compute === true) {
                        if (outliersType[d.num].outliersType.includes('clashes')) {
                            this.clashes++;
                        }
                        if (outliersType[d.num].outliersType.includes('ramachandran_outliers')) {
                            this.ramachandranOutliers++;
                        }
                        if (outliersType[d.num].outliersType.includes('sidechain_outliers')) {
                            this.sidechainOutliers++;
                        }
                    }
                    switch (outliersType[d.num].outliersType.length) {
                        case 0:
                            return '#008000';
                        case 1:
                            return '#ff0';
                        case 2:
                            return '#f80';
                        default:
                            return '#850013';
                    }
                }
            case 3:
                if (typeof rsrz[d.num] === 'undefined') {
                    return 'black';
                } else {
                    if (compute === true) {
                        this.rsrzCount++;
                    }
                    return '#f00';
                }
            default:
                break;
        }
    }

    updateChart(chainsToShow: any[], ramaContourPlotType: number, entityToShow: number[], drawingType: number) {

        this.svgContainer.selectAll('g.dataGroup').remove();
        let { width } = this.props;
        const tooltip = this.tooltip;
        const { jsonObject, stroke, outliersType, rsrz, clashes, ramachandranOutliers, sidechainOutliers } = this;

        // console.log(ramaContourPlotType, drawingType);
        // console.log(jsonObject.length);
        if (width > 768) {
            width = 580;
        }
        // if (height > 768) {
        //     height = 580;
        // }
        let objSize = 40;
        if (window.screen.availWidth < 1920) {
            objSize = 30;
        }
        if (window.screen.width < 350) {
            objSize = 5;
        }

        let { initial } = this.state;
        let outliersList = [];

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
        // function stroke(d: any) {
        //     switch (coloring) {
        //         case '1':
        //             if (d.rama === 'OUTLIER') {
        //                 return '#ca36ac';
        //             }
        //             return 'black';
        //         case '2':
        //             if (typeof outliersType[d.num] === 'undefined') {
        //                 return '#0f0';
        //             } else {
        //                 switch (outliersType[d.num].outliersType.length) {
        //                     case 0:
        //                         return '#0f0';
        //                     case 1:
        //                         return '#ff0';
        //                     case 2:
        //                         return '#f80';
        //                     default:
        //                         return '#f00';
        //                 }
        //             }
        //         case '3':
        //             if (typeof rsrz[d.num] === 'undefined') {
        //                 break;
        //             } else {
        //                 return '#f00';
        //             }
        //         default:
        //             break;
        //     }
        //     // if (d.aa === 'GLY') {
        //     //     return '#0aca40';
        //     // }
        //     return 'black';
        // }

        // symbolTypes
        let symbolTypes = {
            'triangle': d3.symbol().type(d3.symbolTriangle).size(objSize),
            'circle': d3.symbol().type(d3.symbolCircle).size(objSize)
        };
        function switchPlotType(d: any, i: number) {
            switch (ramaContourPlotType) {
                case 1:
                    return d;
                case 2:
                    if (d.aa === 'ILE' || d.aa === 'VAL') {
                        return d;
                    }
                    break;
                case 3:
                    if (i + 1 !== jsonObject.length && jsonObject[i + 1].aa === 'PRO') {
                        return d;
                    }
                    break;
                case 4:
                    if (d.aa === 'GLY') {
                        return d;
                    }
                    break;
                case 5:
                    if (d.cisPeptide === null && d.aa === 'PRO') {
                        return d;
                    }
                    break;
                case 6:
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
        let favored = 0;
        let allowed = 0;
        d3.select('.outliers-container').append('table')
        .attr('class', 'rama-outliers-table').append('thead').append('tr').attr('id', 'tab-headline');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('Chain')
            .style('width', '30%').style('min-width', '50px').style('text-align', 'right');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('ID')
            .style('width', '30%').style('min-width', '50px').style('text-align', 'right');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('AA')
            .style('width', '30%').style('min-width', '50px').style('text-align', 'right');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('Phi')
            .style('width', '30%').style('min-width', '50px').style('text-align', 'right');
        d3.select('#tab-headline').append('th').attr('class', 'rama-table-headline').text('Psi')
            .style('width', '30%').style('min-width', '50px').style('text-align', 'right');
        //
        this.outliersTable = d3.select('.outliers-container').append('div')
            .attr('class', 'outliers').append('table')
            .attr('class', 'table table-hover table-responsive');

        this.svgContainer.selectAll('.shapes')
            .data(jsonObject.filter(function (d: any, i: number) {
                if (initial || (chainsToShow.indexOf(d.chain) !== -1 && entityToShow.indexOf(d.modelId) !== -1)) {
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
                if (drawingType !== 3) {
                    if (d.rama === 'OUTLIER') {
                        outliersList.push(d);
                        return d.aa + '-' + d.chain + '-' + d.modelId + '-' + d.num;
                    }
                    if (d.rama === 'Favored') {
                        favored++;
                    }
                    if (d.rama === 'Allowed') {
                        allowed++;
                    }
                    return;
                }
                if (d.rama === 'OUTLIER' && typeof rsrz[d.num] !== 'undefined') {
                        outliersList.push(d);
                        return d.aa + '-' + d.chain + '-' + d.modelId + '-' + d.num;
                    } else {
                        return;
                    }
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
            // .style('fill', 'transparent')
            .style('fill', function (d: any) {
                return stroke(d, drawingType, outliersType, rsrz, true);
            })
            .style('opacity', function (d: any) {
                let fillTmp = stroke(d, drawingType, outliersType, rsrz);
                // console.log(fillTmp);
                if (fillTmp === '#008000' || fillTmp === 'black') {
                    return 0.15;
                }
                if (fillTmp === '#ff0') {
                    return 0.8;
                }
                return 1;
            })
            //
            // .style('stroke-width', '0.5')
            .on('mouseover', function (d: any) {
                tooltip.transition()
                    // .duration(50)
                    .style('opacity', .95);
                tooltip.html(
                    d.chain
                    + ' '
                    + d.num
                    + ' '
                    + d.aa
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
                        return stroke(dat, drawingType, outliersType, rsrz);
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
                        // .style('fill', 'transparent')
                        .style('fill', function (d: any) {
                            return stroke(d, drawingType, outliersType, rsrz);
                        });
                        // .style('stroke-width', '0.5');
                    tooltip.transition()
                        // .duration(50)
                        .style('opacity', 0);
                }
            );
        outliersList.sort(function (a: any, b: any) {
            return a.num - b.num;
        });
        this.setState({
            initial: false
        });

        switch (drawingType) {
            case 1:
                d3.selectAll('#rama-sum-div').remove();
                d3.select('#rama-sum').append('div').attr('id', 'rama-sum-div')
                    .append('div').attr('class', 'rama-sum-cell').attr('id', 'rama-sum-widest')
                    .text('Preferred regions: ' + String(favored)
                    + ' (' + String((favored / jsonObject.length * 100).toFixed(0))
                    + '%)').enter();
                d3.select('#rama-sum-div').append('div').attr('class', 'rama-sum-cell')
                    .attr('id', 'rama-sum-middle')
                    .text('Allowed regions: ' + String(allowed)
                    + ' (' + String((allowed / jsonObject.length * 100).toFixed(0))
                    + '%)').enter();
                d3.select('#rama-sum-div').append('div').attr('class', 'rama-sum-cell')
                    .attr('id', 'rama-sum-thinnest')
                    .text('Outliers: ' + String(outliersList.length)
                    + ' (' + String((outliersList.length / jsonObject.length * 100).toFixed(0)) + '%)').enter();

                // d3.select('#rama-sum').append('table').attr('id', 'rama-sum-table')
                //     .append('td').text('Preferred regions: ' + String(favored)
                //     + ' (' + String((favored / jsonObject.length * 100).toFixed(0))
                //     + '%)').enter();
                // d3.select('#rama-sum-table').append('td').text('Allowed regions: ' + String(allowed)
                //     + ' (' + String((allowed / jsonObject.length * 100).toFixed(0))
                //     + '%)').enter();
                // d3.select('#rama-sum-table').append('td').text('Outliers: ' + String(outliersList.length)
                //     + ' (' + String((outliersList.length / jsonObject.length * 100).toFixed(0)) + '%)').enter();
                //
                break;
            case 2:
                d3.selectAll('#rama-sum-div').remove();
                d3.select('#rama-sum').append('div').attr('id', 'rama-sum-div')
                    .append('div').attr('class', 'rama-sum-cell').attr('id', 'rama-sum-widest')
                    .text('Ramachandran outliers: ' + String(this.ramachandranOutliers)
                        + ' (' + String((this.ramachandranOutliers / jsonObject.length * 100).toFixed(0)) +
                        '%)').enter();
                d3.select('#rama-sum-div').append('div').attr('class', 'rama-sum-cell')
                    .attr('id', 'rama-sum-middle')
                    .text('Sidechain outliers: ' + String(this.sidechainOutliers)
                        + ' (' + String((this.sidechainOutliers / jsonObject.length * 100).toFixed(0)) + '%)').enter();
                d3.select('#rama-sum-div').append('div').attr('class', 'rama-sum-cell')
                    .attr('id', 'rama-sum-thinnest')
                    .text('Clashes: ' + String(this.clashes)
                        + ' (' + String((this.clashes / jsonObject.length * 100).toFixed(0)) + '%)').enter();

                // d3.select('#rama-sum').append('table').attr('id', 'rama-sum-table')
                //     .append('td').text('Ramachandran outliers: ' + String(this.ramachandranOutliers)
                //     + ' (' + String((this.ramachandranOutliers / jsonObject.length * 100).toFixed(0)) +
                //     '%)').enter();
                // d3.select('#rama-sum-table').append('td').text('Sidechain outliers: ' + String(this.sidechainOutliers)
                //     + ' (' + String((this.sidechainOutliers / jsonObject.length * 100).toFixed(0)) + '%)').enter();
                // d3.select('#rama-sum-table').append('td').text('Clashes: ' + String(this.clashes)
                //     + ' (' + String((this.clashes / jsonObject.length * 100).toFixed(0)) + '%)').enter();
                break;
            case 3:
                d3.selectAll('#rama-sum-div').remove();
                d3.select('#rama-sum').append('div').attr('id', 'rama-sum-div')
                    .append('div').attr('class', 'rama-sum-cell').attr('id', 'rama-sum-widest')
                    .text('RSRZ: ' + String(this.rsrzCount)
                        + ' (' + String((this.rsrzCount / jsonObject.length * 100).toFixed(0)) + '%) ').enter();

                // d3.select('#rama-sum').append('table').attr('id', 'rama-sum-table')
                //     .append('td').text('RSRZ: ' + String(this.rsrzCount)
                //     + ' (' + String((this.rsrzCount / jsonObject.length * 100).toFixed(0)) + '%) ').enter();

                break;
            default:
                return;
        }
        this.sidechainOutliers = 0;
        this.rsrzCount = 0;
        this.clashes = 0;
        this.ramachandranOutliers = 0;
        // this.addTable(outliersList, drawingType);
    }

    basicContours(ramaContourPlotType: number, contourType: number) {
        d3.select('#rama-canvas-container').empty();
        d3.selectAll('.contour-line').remove();
        let canvas = this.canvasContainer;
        // let svg = this.svgContainer;
        let { width, height } = this.props;
        // console.log(ramaContourPlotType);

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
        switch (ramaContourPlotType) {
            case 1:
                // url += 'rama8000-general-noGPIVpreP.csv';
                img.src = generalContour;
                svgImg.src = lineGeneralContour;
                break;
            case 2:
                // url += 'rama8000-ileval-nopreP.csv';
                img.src = ileVal;
                svgImg.src = lineIleVal;
                break;
            case 3:
                // url += 'rama8000-prepro-noGP.csv';
                img.src = prePro;
                svgImg.src = linePrePro;
                break;
            case 4:
                // url += 'rama8000-gly-sym.csv';
                img.src = gly;
                svgImg.src = lineGly;
                break;
            case 5:
                // url += 'rama8000-transpro.csv';
                img.src = transPro;
                svgImg.src = lineTransPro;
                break;
            case 6:
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
            context.globalAlpha = 0.6;
            img.onload = function () {
                    context.drawImage(img, 0, 0,
                                      width, height * img.height / img.width
                    );
                };
        } else {
            context.globalAlpha = 1;
            svgImg.onload = function () {
                context.drawImage(svgImg, 0, 0,
                                  width, height * svgImg.height / svgImg.width
                );
            };
            //
            // setTimeout(function () {
            //             // let s = new XMLSerializer().serializeToString(document.getElementById('rama-svg'));
            //             // let encode = window.btoa(s);
            //     let enc: any = document.getElementById('rama-canvas');
            //     console.log(enc.toDataURL());
            //         }, 3000);
            // d3.csv(url, function (error: any, data: any) {
            //     if (error) {
            //         throw error;
            //     }
            //
            //     data.sort(function (a: any, b: any) {
            //         return b.value - a.value;
            //     });
            //     data.forEach(function (d: any) {
            //         d.psi = +d.psi;
            //         d.phi = +d.phi;
            //         d.value = +d.value;
            //     });
            //     //
            //     // scale(0.965, 0.965), translate(16, 16)
            //     let scale = '';
            //     switch (ramaContourPlotType) {
            //         case '2':
            //             data = data.slice(0, data.length / 2.7);
            //             break;
            //         case '3':
            //             data = data.slice(0, data.length / 2.5);
            //             break;
            //         case '4':
            //             data = data.slice(0, data.length / 1.5);
            //             break;
            //         case '5':
            //             data = data.slice(0, data.length / 3.7);
            //             break;
            //         case '6':
            //             data = data.slice(0, data.length / 2.2);
            //             break;
            //         default:
            //
            //             // console.log(data[0], data[data.length-1]);
            //             data = data.slice(0, (data.length / 2.1) - 850);
            //             // data.splice(0, data.length-1000);
            //     }
            //     let median = d3.median(data, function (d: any) {
            //         return d.value;
            //     });
            //     let max = d3.max(data, function (d: any) {
            //         return +d.value;
            //     });
            //     let min = d3.min(data, function (d: any) {
            //         return +d.value;
            //     });
            //     //
            //     // let line = d3.line();
            //     console.log(data.length);
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
            //         .attr('stroke', '#1359eb')
            //         .attr('stroke-width', '2')
            //         .attr('fill', 'none')
            //         .attr('class', 'contour-line')
            //         .attr('margin', '30px')
            //         .attr('d', d3.geoPath())
            //         .attr('transform', scale)
            //         .attr('clip-path', 'url(#clipRect)');
            //     // svg.selectAll('.shapes')
            //     //     .data(d3Contour.contourDensity()
            //     //         .x(function (d: any) {
            //     //             return xScale(d.phi);
            //     //         })
            //     //         .y(function (d: any) {
            //     //             return yScale(d.psi);
            //     //         })
            //     //         .size([height, width])
            //     //         .thresholds(d3.ticks(min, max, 1))
            //     //         .thresholds(d3.range(min, max))
            //     //         .cellSize(1)
            //     //         .bandwidth(1)
            //     //         (data))
            //     //     //
            //     //     .enter()
            //     //     .append('path')
            //     //     .attr('stroke', '#1359eb')
            //     //     .attr('stroke-width', '2')
            //     //     .attr('fill', 'none')
            //     //     .attr('class', 'line')
            //     //     .attr('id', 'contour-basis-line')
            //     //     .attr('margin', '30px')
            //     //     .attr('d', d3.geoPath())
            //     //     .attr('transform', scale);
            //     let pa: any = document.getElementById('contour-basis-line');
            //     // scale(0.99, 0.99),
            //     switch (ramaContourPlotType) {
            //         //
            //         case '3':
            //             data = data.slice(0, data.length / 2.9);
            //             break;
            //         case '2':
            //             data = data.slice(0, data.length / 3);
            //             break;
            //         case '4':
            //             data = data.slice(0, data.length / 1.65);
            //             break;
            //         case '5':
            //             data = data.slice(0, data.length / 1.8);
            //             break;
            //         case '6':
            //             data = data.slice(0, data.length / 2.2);
            //             break;
            //         default:
            //             data = data.slice(0, data.length / 2.7);
            //             break;
            //     }
            //     console.log(data.length);
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
            //    // scale(0.99,0.99),
            // });
            // if (ramaContourPlotType !== '1') {
            //     setTimeout(function () {
            //         let s = new XMLSerializer().serializeToString(document.getElementById('rama-svg'));
            //         let encode = window.btoa(s);
            //         console.log('data:image/svg+xml;base64,' + encode);
            //     },         3000);
            // }
        //
        }
    }

    addTable(sortedTable: any[], drawingType: number) {
        let objSize = 40;
        const { stroke, outliersType, rsrz } = this;
        if (window.screen.availWidth < 1920) {
            objSize = 30;
        }
        if (window.screen.width < 350) {
            objSize = 5;
        }
        //
        // function stroke
        // function stroke(d: any) {
        //     if (d.rama === 'OUTLIER') {
        //         return '#ca36ac';
        //     }
        //     // if (d.aa === 'GLY') {
        //     //     return '#0aca40';
        //     // }
        //     return 'black';
        // }

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
                d3.select('#' + d.aa + '-' + d.chain + '-' + d.modelId + '-' + d.num)
                    .attr('d', function (dat: any) {
                        if (dat.aa === 'GLY') {
                            symbolTypes.triangle.size(175);
                            return symbolTypes.triangle();
                        }
                        symbolTypes.circle.size(175);
                        return symbolTypes.circle();
                    })
                    .style('fill', function (dat: any) {
                        return stroke(dat, drawingType, outliersType, rsrz);
                    });
            })
            //
            .on('mouseout', function (d: any) {
                d3.select(this)
                    .style('background-color', 'transparent')
                    .style('cursor', 'default');
                d3.select('#' +  d.aa + '-' + d.chain + '-' + d.modelId + '-' + d.num)
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
                    .style('fill', function (d: any) {
                        return stroke(d, drawingType, outliersType, rsrz);
                    })
                    .style('stroke-width', '0.5');
            })
            .selectAll('td')
            .data(function (d: any) {return [d.chain, d.num, d.aa, d.phi, d.psi]; })
            .enter()
            .append('td')
            .attr('id', 'rama-td')
            .style('width', '30%')
            .style('min-width', '50px')
            .style('text-align', 'right')
            .text(function(d: any) { return d; });

        rows.exit().remove();
        //
        let cells = rows.selectAll('td')
            .data(function (d: any) {return [d.chain, d.num, d.aa, d.phi, d.psi]; })
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