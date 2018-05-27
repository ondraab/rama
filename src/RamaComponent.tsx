import * as d3 from 'd3';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import RamaData from './RamaScatter';

interface Props {
    pdbid: string;
    chainstoshow: string[];
    modelstoshow: number[];
    element: HTMLElement;
}

interface States {
    pdbID: string;
    ramaContourPlotType: number;
    element: HTMLElement;
    chainsToShow: any[];
    contourColoringStyle: number;
    modelsToShow: number[];
    residueColorStyle: number;
}

declare global {
    interface Window { renderRamaComp: any; }
}

class RamaComopnent extends React.Component<Props, States> {
    constructor(props: any) {
        super(props);
        this.state = {
            chainsToShow: this.props.chainstoshow,
            contourColoringStyle: 1,
            element: this.props.element,
            modelsToShow: this.props.modelstoshow,
            pdbID: this.props.pdbid,
            ramaContourPlotType: 1,
            residueColorStyle: 1
        };
    }

    public componentDidMount() {
        let { residueColorStyle, contourColoringStyle, ramaContourPlotType } = this.state;
        const { pdbID, chainsToShow, modelsToShow, element} = this.state;
        function renderRamaComp(element: HTMLElement,
                                residueColorStyle: number,
                                contourColoringStyle: number,
                                ramaContourPlotType: number) {
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
                    element={element}
                />,
                element
            );

        }
        renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);

        setTimeout(function() {
            d3.select('#rama-coloring').on('change', function() {
                residueColorStyle = Number(d3.select(this).property('value'));
                renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });
            d3.select('#rama-plot-type').on('change', function() {
                ramaContourPlotType = Number(d3.select(this).property('value'));
                renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });
            d3.selectAll('input[name=contour-style]').on('change', function() {
                contourColoringStyle = Number(d3.select(this).property('value'));
                renderRamaComp(element, residueColorStyle, contourColoringStyle, ramaContourPlotType);
            });

        },         50);
    }
    public render() {
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
