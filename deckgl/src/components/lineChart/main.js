import * as d3 from 'd3'
import React, {useState, useCallback, useEffect, Fragment, Component} from 'react';

import {ColorLegend} from "./ColorLegend";
import './line.css'
const width = 960;
const height = 500;
const margin = { top: 20, right: 200, bottom: 65, left: 150 };
var innerWidth = width - margin.right - margin.left;
var innerHeight = height - margin.top - margin.bottom;
const colorLegendLabel='country';
const circleRadius=5;
const colorScale = d3.scaleOrdinal()
const countrylist=['China','US','Japan','Italy','France','United Kingdom'];
const colorTable=['#E25A42','#F2DA57','#42A5B3','#A0B700','#193556','#137B80'];
colorScale.domain(countrylist)
    .range(colorTable)

const totalTime=10000;
// let currentTime=new Date(2020,1,22);

const yScale = d3.scaleLinear()
    .domain([0, 100000])
    .range([innerHeight, 0]);
const yAxisGenerator = d3.axisLeft()
    // .tickValues(d3.range(0, 3, 5));
    let xdomain=[new Date(2020, 0, 22), new Date(2020, 4, 1)];
    let xScale=d3.scaleTime()
        .domain(xdomain)
        .range([0, innerWidth]);
    const xAxisGenerator = d3.axisBottom()


    let covidMap=new Map();
    //数据格式
//{
//  {
//  {
//  'country':{
//      time1:
//      time2:
//      ...
//  }
//
//  }
//}
    let dateKey=[];
    let sorted=new Map();
    let dataFlow=[];

    let lineData=[]
    function getCovid() {
        return new Promise(resolve => {
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv').then(d=>{
            d.map((i,index)=>{
                for(let k in i){
                    let t=new Date(k)
                    if(t.getDate()){
                        i[k]=parseInt(i[k])
                    }
                }
                if(!covidMap.has(i['Country/Region'])){
                    covidMap.set(i['Country/Region'],i)
                }
                else{
                    let tmp=covidMap.get(i['Country/Region'])
                    for(let k in tmp){
                        // console.log(k)
                        let d=new Date(k);
                        if(d.getDate()){
                            if(dateKey.indexOf(k)===-1){
                                dateKey.push(k)
                            }
                            // console.log(tmp[k])
                            tmp[k]=(tmp[k]+i[k])
                            // console.log(tmp)
                        }
                    }
                }
                }
            )
                //这么做好像没有什么用，曲线图是将每天的数据
                console.log(covidMap)
                // dateKey.forEach(d=>{
                //     console.log(new Date(d))
                // })
                countrylist.map((d,index)=>{
                    let c={
                        color:colorTable[index],
                        country: d,
                        path:[]
                    }
                    for(let k in covidMap.get(d)){
                        let tmp=new Date(k);
                        if(tmp.getDate()){
                            // console.log('k',k)
                            let t=new Date(tmp.getFullYear(),tmp.getMonth(),tmp.getDate())
                       c.path.push([tmp,covidMap.get(d)[k]])
                        }
                    }
                    lineData.push(c)
                })
                console.log(lineData)
                resolve()

                // dateKey.forEach(k=>{
                //     let arrayMap=Array.from(covidMap)
                //     console.log('arrayMap',arrayMap);
                //     let tmp=[]
                //     arrayMap.forEach(d=>{
                //         if(countrylist.indexOf(d[0])!==-1){
                //             // tmp.push({
                //             //     Country:d[0]
                //             //     Value:
                //             // })
                //         }
                //     })
                //
                //     sorted[k]= arrayMap.sort((a,b)=>{
                //         if(a[1][k]>b[1][k]){
                //             return -1
                //         }
                //         else return 1
                //     })
                //     // console.log(sorted[k])
                // })
                // console.log(sorted)
                // for(let i in sorted){
                //
                // }

            })
        })
    }

let last = array => array[array.length - 1];




    // var xAxisMajor = d3.axisBottom().scale(xScale);
    // var xAxisMinor = d3.axisBottom().scale(xScale).ticks(50);

    // const circleRadius = 7;
    // const colorLegendLabel='city'
    // const colorScale = d3.scaleOrdinal()
    // let range=[];
    // if(keys){
    //     keys.forEach((d,i)=>{
    //             range.push(d3.interpolateSpectral(i/8))
    //         }
    //     )
    //     colorScale.domain(keys)
    //         .range(range)
    // }
//
// }



function setData(day) {
    let data=[]
    lineData.map((x)=>{
        let tmp=[];
        x.path.map((i,index)=>{
            if(index>day){
                tmp.push(x.path[day])
            }
            else{
                tmp.push(i)
            }
        })
        data.push({
            color:x.color,
            country:x.country,
            path:tmp
        })
    })
    return data
}

export default class App extends Component{

    constructor(props) {
        super(props);
        this.state={
            day:0,
            linedata:[],
            yScale:d3.scaleLinear()
                .domain([0, 10000])
                .range([innerHeight, 0])
                .nice(),
            lineGenerator : d3.line()
            // .curve(d3.curveCatmullRom)
                .x(d => xScale(d[0]))
                .y(d => this.state.yScale(d[1]))
        }

    }

    componentDidMount() {
        let testData=
            []
        //     [{
        //     path:[[new Date(2020,0,22),1000],[new Date(2020,1,10),10000]]
        // }]
        let p1=getCovid();
        p1.then(result=>{
            let svg=d3.select('svg');
            const g = svg.append("g")
                .attr('id','Axis')
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            let gx=g.append("g")
            // .call(xAxisGenerator)
                .attr("transform", `translate(0, ${innerHeight})`);
            let gy=g.append("g").attr('id','yAxis')
                gy.call(yAxisGenerator.scale(this.state.yScale));
            let p=gx.transition().duration(2000)
                .call(xAxisGenerator.scale(xScale))
                .end()
            p.then(
                // ()=>{
                //     let x=d3.scaleTime()
                //         .domain([new Date(2010, 0, 1), new Date(2010, 10, 1)])
                //         .range([0, innerWidth])
                //     gx.transition().duration(2000)
                //         .call(xAxisGenerator.scale(x))
                // }
            )
            svg.append('g').attr('id','line')
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append('g').attr('id','text')
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
            // let lineg=svg.append('g');
            //
            // let line=lineg.selectAll('path')
            //     .data(this.state.linedata)
            //     .join('path')
            //
            // line
            //     .attr("fill", "none")
            //     .attr("stroke", "black")
            //     .attr("stroke-width", 2.5)
            //     .attr("stroke-linejoin", "round")
            //     .attr("stroke-linecap", "round")
            //     .attr("d",lineGenerator(this.state.linedata))

            // let lineg=d3.select('#line');
            // let line=lineg.selectAll('path')
            //     .data(testData)
            //     .join('path')
            //     .attr("fill", "none")
            //     .attr("stroke", "black")
            //     .attr("stroke-width", 2.5)
            //     .attr("stroke-linejoin", "round")
            //     .attr("stroke-linecap", "round")
            //     // .attr("d",lineGenerator(this.state.linedata[0].path))
            //     .attr("d",d=>{
            //         console.log('d',lineGenerator(d.path))
            //         return lineGenerator(d.path)
            //     });
            // setTimeout(function () {
            //
            //     this.setState({
            //         linedata: newData
            //     })
            // },1000)
            this._animate()
        });
    }
    _animate(){


            let newData=setData(this.state.day)
            console.log('newData',newData);
            let max=-1;
            newData.map(x=>{
                x.path.map(t=>{
                    if(t[1]>max){
                        max=t[1]
                    }
                })
            })
            if(this.state.yScale.domain()[1]<max){
                this.state.yScale.domain([0,max])
                let gy=d3.select('#yAxis');
                gy.transition().duration(500).call(yAxisGenerator.scale(this.state.yScale))
            }

            this.setState({
                        linedata: newData
                    })

        let text=d3.select('#text');
            text.selectAll('text')
                .data(this.state.linedata)
                .join('text')
                .property('_next',function(d){
                    console.log(d)
                    return d.path[this.state.day][1]
                }.bind(this))
                .property('_current',function (d) {
                    if(this.state.day!==0){
                        return d.path[this.state.day-1][1]
                    }
                    else return d.path[this.state.day][1]

                }.bind(this))
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .textTween(function(d) {
                    // console.log('d',d);
                    // console.log('day',this.state.day)
                    const i = d3.interpolate(this._current, this._next);
                    return function(t) { return this._cuurent=i(t).toFixed(0); };
                })
                // .text(d=>d.path[this.state.day][1])
                .attr('transform',d=> `translate(${xScale(d.path[this.state.day][0])}, ${this.state.yScale(d.path[this.state.day][1])})`)
                .style("font-family", "monospace")
                .style("fill", d => d.color);

            let lineg=d3.select('#line');
            let line=lineg.selectAll('path')
                .data(this.state.linedata)
                .join('path')
            let p=line
                .attr("fill", "none")
                .attr("stroke", d=>d.color)
                .attr("stroke-width", 2.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .transition()
                .ease(d3.easeLinear)
                .duration(500)
                .attr("d",d=>this.state.lineGenerator(d.path))
                .end()
            p.then(()=>{
                if(this.state.day<this.state.linedata[0].path.length-1){
                    // let y = d3.scaleLinear()
                    //     .domain([0, 1000])
                    //     .range([innerHeight, 0]);
                    // let gy=d3.select('#yAxis');
                    // gy.transition().duration(500).call(yAxisGenerator.scale(y))
                    xdomain=[new Date(2020, 0, 22), new Date(2020, 3, 1)]
                    this.state.day+=1;
                    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
                }
            })


    }
    componentWillUnmount() {
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
    }

     render() {




         return <div className={'line'}>
             <svg width={width} height={height}>
                 <g transform={`translate(${margin.left},${margin.top})`}>
                     <g transform={`translate(${innerWidth + 60}, 60)`}>
                         <text x={35} y={-25} className="axis-label" textAnchor="middle" >
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
                 </g>

             </svg>
         </div>
     }
}
