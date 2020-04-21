import * as d3 from 'd3'
import React, { useState, useCallback, useEffect,Fragment } from 'react';
import ReactDOM from 'react-dom';
import {useData} from './useData'
import {AxisBottom} from "../city/AxisBottom";
import {AxisLeft} from "../city/AxisLeft";
import {Marks} from "./Marks"
import {ColorLegend} from "../city/ColorLegend";
const width = 960;
const height = 500;
const margin = { top: 20, right: 200, bottom: 65, left: 150 };
var innerWidth = width - margin.right - margin.left;
var innerHeight = height - margin.top - margin.bottom;
const xAxisLabel = 'Time';
const yAxisLabel='Light';
const siFormat = d3.format('.2s');
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 70;
const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');
//画河流图需要data和keys
/*
*data format data is a list
* [{
*   xvalue:x
*   key1: k1
*   key2: k2
*   ...
* }
* ,
* {
*   ...
* }
* ...
* ]
*
* keys 就是data中所有的key的集合
*
* */

export function BarG(){


    const [data,keys]=useData();
    const [start,setStart]=useState(19)





    var xValue = function (d) { return new Date(d.date).getHours(); };
    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();




    // var xAxisMajor = d3.axisBottom().scale(xScale);
    // var xAxisMinor = d3.axisBottom().scale(xScale).ticks(50);

    const circleRadius = 7;
    const colorLegendLabel='city'
    const colorScale = d3.scaleOrdinal()
    let range=[];
    if(keys){
        keys.forEach((d,i)=>{
                range.push(d3.interpolateSpectral(i/8))
            }
        )
        colorScale.domain(keys)
            .range(range)
    }





    return <div className={'bar'}>
        <svg height={height} width={width}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                <g transform={`translate(${innerWidth + 60}, 60)`}>
                    <text x={35} y={-25} className="axis-label" textAnchor="middle">
                        {colorLegendLabel}
                    </text>
                    <ColorLegend
                        tickSpacing={22}
                        tickSize={10}
                        tickTextOffset={12}
                        tickSize={circleRadius}
                        colorScale={colorScale}
                        // onHover={setHoveredValue}
                        // hoveredValue={hoveredValue}
                        // fadeOpacity={fadeOpacity}
                    />
                </g>
                <Marks data={data}
                       start={start}
                       keys={keys}
                       xScale={xScale}
                       xValue={xValue}
                       yScale={yScale}
                       margin={margin}
                       innerHeight={innerHeight}
                       innerWidth={innerWidth}
                       callback={()=>{
                           if(start+24<139){
                               console.log(data.length,start+24)
                               setStart(start+24)
                           }
                           else{
                               setStart(19)
                           }
                       }}
                >

                </Marks>
                <AxisBottom
                    xScale={xScale}
                    innerHeight={innerHeight}
                    tickFormat={xAxisTickFormat}
                    tickOffset={2}
                />
                <text
                    className="axis-label"
                    textAnchor="middle"
                    transform={`translate(${-yAxisLabelOffset},${innerHeight /
                    2}) rotate(-90)`}
                >
                    {yAxisLabel}
                </text>
                {/*<AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />*/}
                <text
                    className="axis-label"
                    x={innerWidth / 2}
                    y={innerHeight + xAxisLabelOffset}
                    textAnchor="middle"
                >
                    {xAxisLabel}
                </text>
            </g>
        </svg>
    </div>
}
