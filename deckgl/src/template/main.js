import * as d3 from 'd3'
import React, {Component} from "react";

const width = 960;
const height = 500;
const margin = { top: 20, right: 200, bottom: 65, left: 150 };
var innerWidth = width - margin.right - margin.left;
var innerHeight = height - margin.top - margin.bottom;


export default class App extends Component{

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {

        return <svg height={height} width={width}>


        </svg>


    }

}
