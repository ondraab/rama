import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import RamaData from './RamaScatter';
import * as d3 from 'd3';

interface Props {
    pdbid: string;
    chainstoshow: string[];
    modelstoshow: number[];
}

interface States {
    pdbID: string;
    ramaContourPlotType: number;
    chainsToShow: any[];
    contourColoringStyle: number;
    modelsToShow: number[];
    residueColorStyle: number;
}

class RamaComopnent extends React.Component<Props, States> {
    constructor(props: any) {
        super(props);
        this.state = {
            pdbID: this.props.pdbid,
            ramaContourPlotType: 1,
            chainsToShow: this.props.chainstoshow,
            contourColoringStyle: 1,
            modelsToShow: this.props.modelstoshow,
            residueColorStyle: 1
        };
    }

    componentDidMount() {
        let { pdbID, chainsToShow, modelsToShow, residueColorStyle, contourColoringStyle, ramaContourPlotType } = this.state;
        function renderRamaComp(residueColorStyle: number, contourColoringStyle: number, ramaContourPlotType: number) {
            ReactDOM.render(
                <RamaData
                    width={473}
                    height={473}
                    pdbID={pdbID}
                    chainsToShow={chainsToShow}
                    modelsToShow={modelsToShow}
                    residueColorStyle={residueColorStyle}
                    contourColoringStyle={contourColoringStyle}
                    ramaContourPlotType={ramaContourPlotType}
                />,
                document.getElementById('rama-root') as HTMLElement
            );

        }
        renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);

        setTimeout(function() {
            d3.select('#rama-coloring').on('change', function () {
                residueColorStyle = Number(d3.select(this).property('value'));
                renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });
            d3.select('#rama-plot-type').on('change', function () {
                ramaContourPlotType = Number(d3.select(this).property('value'));
                renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });
            d3.selectAll('input[name=contour-style]').on('change', function () {
                contourColoringStyle = Number(d3.select(this).property('value'));
                renderRamaComp(residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });

        },         50);
    }
    render() {
        return (
        <div/>
    );
  }
}

export default RamaComopnent;
//
// import * as React from 'react';
//
// const MyComponent = () => (
//     <div>
//         MyComponent!!!
//     </div>
// );
//
// export default MyComponent;
