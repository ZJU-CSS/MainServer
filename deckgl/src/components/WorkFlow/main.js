import * as d3 from 'd3'
import React, {Component} from "react";

const width = 4500;
const height = 1920;
// const margin = { top: 20, right: 200, bottom: 65, left: 150 };

const circle=[[10,100],[200,300],[400,300],[300,500]];

export default class App extends Component{

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const svg=d3.select('svg')
        let g1=svg.append('g')

        g1.selectAll('circle')
            .data(circle)
            .join('circle')
            .attr('cx',0)
            .attr('cy',960)



    }

    render() {

        return <svg height={height} width={width}>


        </svg>


    }

}
