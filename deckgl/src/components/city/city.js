import React, { useState, useCallback, useEffect,Fragment } from 'react';
import ReactDOM from 'react-dom';
import { csv, scaleLinear, scaleOrdinal, max, format, extent } from 'd3';
import { useData } from './useData';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';
import { ColorLegend } from './ColorLegend';
import * as d3 from 'd3'
import './city.css'
const width = 960;
const height = 500;
const margin = { top: 20, right: 200, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 45;
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const xAxisLabel = 'Satisfaction';
const yAxisLabel = 'Worthwhile';
const colorLegendLabel = 'Area';
const siFormat = format('.2s');
const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');
let tmp=[];
function getData() {

    return new Promise(resolve => {
        d3.csv('./happy.csv').then(d=>{
            d.map((l,index)=>{
                let pro=Object.getOwnPropertyNames(l);
                // console.log(l['Area']);
                pro.map((n,index)=>{
                    if(index>1){
                        if(tmp[n]===undefined){
                            tmp[n]={}
                        }
                        if(tmp[n][l['Area']]===undefined){
                            tmp[n][l['Area']]={};
                        }
                        tmp[n][l['Area']].happy=l[n];
                    }
                })
                // l.map((t,i)=>{
                //     if(i>1){
                //         if(data[i]===undefined){
                //             data[i]=[]
                //         }
                //         // data[i].happy=
                //         console.log(Object.getOwnPropertyNames(t))
                //     }
                //
                // })
            })


            d3.csv('./worthwhile.csv').then(d=>{
                d.map((l,index)=>{
                    let pro=Object.getOwnPropertyNames(l);
                    pro.map((n,index)=>{
                        if(index>1){
                            if(tmp[n]===undefined){
                                tmp[n]={}
                            }
                            if(tmp[n][l['Area']]===undefined){
                                tmp[n][l['Area']]={};
                            }
                            tmp[n][l['Area']].worth=l[n];
                        }
                    })
                })
                console.log('data:',tmp)
                resolve();
            });

        });
    })


}

export function City() {

    // const [data, setData] = useState(null);
    const data=useData();
    // console.log('dataini:',data);
    const [year,setYear]=useState(2011);
    // useEffect(function init(){
    //     console.log('start');
    //     console.log('data2:',data);
    //     if(data['2011/12']){
    //         console.log('in');
    //         let svg=d3.select('svg');
    //         // console.log(svg);
    //         let k=dataAt('2011/12');
    //         console.log('k',k)
    //         //这里并不能马上赋值成功，hook调用时异步的
    //         // setCurrentData(k);
    //         // console.log('currentData',currentData);
    //         svg.selectAll('circle')
    //             .data(k,d=>['city'])
    //             .join('circle')
    //             .attr("stroke", "black")
    //             .attr("r", d =>{
    //                 if(!(parseFloat(d.data['happy'])&&parseFloat(d.data['worth']))) return 0;
    //                 else return 5
    //             })
    //             .attr("cx", d => {if(parseFloat(d.data['happy'])){
    //                 console.log(d.data['happy'])
    //                 return xScale(d.data['happy'])
    //             }})
    //             .attr("cy", d => {if(d.data['worth']){
    //                 return yScale(d.data['worth'])
    //             }
    //             })
    //             .attr("fill", d => 'blue');
    //         setYear(2012)
    //         console.log(year)
    //     }
    // },[data]);
    // useEffect(function update() {
    //
    //         if(year){
    //             let currentData=dataAt(year+'/'+(year-2000+1));
    //             let svg=d3.select('svg');
    //             let c=svg.selectAll("circle")
    //                 .data(currentData,d=>d['city'])
    //                 .join('circle')
    //                 .attr("stroke", "black")
    //                 .attr("r", d =>{
    //                     if(!(parseFloat(d.data['happy'])&&parseFloat(d.data['worth']))) return 0;
    //                     else return 5
    //                 })
    //                 .transition()
    //                 // .on('end',function repeat(){
    //                 //     console.log('end')
    //                 // })
    //                 .duration(1000)
    //                 .attr("cx", d => {if(parseFloat(d.data['happy'])){
    //                     // console.log(d.data['happy'])
    //                     return xScale(d.data['happy'])
    //                 }})
    //                 .attr("cy", d => {if(d.data['worth']){
    //                     return yScale(d.data['worth'])
    //                 }
    //                 })
    //                 .attr("fill", d => 'blue')
    //                 .end();
    //             c.then(result=>{
    //                 if(year<2016){
    //                     setYear(year+1)
    //                     // updateCircle()
    //                 }
    //                 else {
    //                     setYear(2011)
    //                     // console.log('year:',year)
    //                     // year=2011;
    //                     // updateCircle()
    //                 }
    //                 console.log('done')
    //             })
    //         }
    // },[year])
    // function dataAt(year){
    //     console.log('data:',data)
    //     let results=[];
    //     let pro=Object.getOwnPropertyNames(data[year]);
    //     pro.forEach(d=>{
    //         results.push({
    //             city:d,
    //             data:data[year][d],
    //         })
    //     })
    //     return results
    // }
    // const [hoveredValue, setHoveredValue] = useState(null);
    // if (!data) {
    //     return <pre>Loading...</pre>;
    // }
    const xValue = d => d.data['happy'];
    const yValue = d => d.data['worth'];
    const colorValue = d => d.species;
    const circleRadius = 7;


    const xScale = scaleLinear()
        // .domain(extent(data, xValue))
        .domain([6.8,8.5])
        .range([0, innerWidth])

    const yScale = scaleLinear()
        // .domain(extent(data, yValue))
        .domain([8.5,6.8])
        .range([0, innerHeight]);

    const colorScale = scaleOrdinal()
        .domain(['InnerLondon','OuterLondon'])
        .range(['#E6842A', '#137B80']);

    return (
        <Fragment>
            <b >time:<span id="Time"></span>
            </b>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <AxisBottom
                        xScale={xScale}
                        innerHeight={innerHeight}
                        tickFormat={xAxisTickFormat}
                        tickOffset={5}
                    />
                    <text
                        className="axis-label"
                        textAnchor="middle"
                        transform={`translate(${-yAxisLabelOffset},${innerHeight /
                        2}) rotate(-90)`}
                    >
                        {yAxisLabel}
                    </text>
                    <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />
                    <text
                        className="axis-label"
                        x={innerWidth / 2}
                        y={innerHeight + xAxisLabelOffset}
                        textAnchor="middle"
                    >
                        {xAxisLabel}
                    </text>
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
                    <g >
                        <Marks
                            data={data}//参数变了，组件就会自动刷新
                            xScale={xScale}
                            xValue={xValue}
                            yScale={yScale}
                            yValue={yValue}
                            colorScale={colorScale}
                            colorValue={colorValue}
                            tooltipFormat={xAxisTickFormat}
                            circleRadius={circleRadius}
                            year={year}
                            margin={margin}
                            callback={()=>{
                                if(year<2016){
                                    setYear(year+1)
                                }
                                else{
                                    setYear(2011)
                                }
                                document.getElementById('Time').innerHTML=year+'/'+(year-2000+1)

                            }}
                        />
                    </g>
                </g>
            </svg>

        </Fragment>

    );
};
