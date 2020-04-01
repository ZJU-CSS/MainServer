import * as d3 from 'd3'
import React, {useState, useCallback, useEffect, Fragment, Component} from 'react';

import {useData} from './useData'

import {Marks} from "./Marks"

const width = 960;
const height = 500;
const margin = { top: 20, right: 200, bottom: 65, left: 150 };
var innerWidth = width - margin.right - margin.left;
var innerHeight = height - margin.top - margin.bottom;


const yScale = d3.scaleLinear()
    .domain([0, 20])
    .range([innerHeight, 0]);
const yAxisGenerator = d3.axisLeft(yScale)
    .tickValues(d3.range(0, 30, 5));

// let xScale = d3.scaleTime()
//     .domain([new Date(2010, 0, 1), new Date(2010, 4, 1)])
//         .range([0, innerWidth]);




    // const [data,keys]=useData();
    // const [start,setStart]=useState(19);

    // const [xdomain,setXdomain]=useState([new Date(2010, 0, 1), new Date(2010, 4, 1)])

    let xdomain=[new Date(2010, 0, 1), new Date(2010, 4, 1)];
    let xScale=d3.scaleTime()
        .domain(xdomain)
        .range([0, innerWidth]);


    const xAxisGenerator = d3.axisBottom()
        // .tickValues(d3.range(0, 10).map(d => new Date(2010, d, 1,)));




    // const [i,seti]=useState(0)
    // // setTimeout(function () {
    // //     console.log('change');
    // //     setXdomain([new Date(2010, 0, 1), new Date(2010, i, 1)])
    // //     gx.transition().duration(1000)
    // //         .call(xAxisGenerator)
    // //     seti(i+1);
    // // },1000)




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
    function getCovid() {
        return new Promise(resolve => {
            d3.csv('./covid/time_series_covid19_confirmed_global.csv').then(d=>{
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
                console.log(covidMap)

                dateKey.forEach(k=>{
                    let arrayMap=Array.from(covidMap)
                    sorted[k]= arrayMap.sort((a,b)=>{
                        if(a[1][k]>b[1][k]){
                            return -1
                        }
                        else return 1
                    })
                    // console.log(sorted[k])
                })
                console.log(sorted)
            })
        })
    }






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


export default class App extends Component{


    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let p1=getCovid();
        p1.then();
        let svg=d3.select('svg');

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        let gx=g.append("g")
        // .call(xAxisGenerator)
            .attr("transform", `translate(0, ${innerHeight})`);

        g.append("g")
            .call(yAxisGenerator);


        let p=gx.transition().duration(2000)
            .call(xAxisGenerator.scale(xScale))
            .end()
        p.then(
            ()=>{
                let x=d3.scaleTime()
                    .domain([new Date(2010, 0, 1), new Date(2010, 10, 1)])
                    .range([0, innerWidth])
                gx.transition().duration(2000)
                    .call(xAxisGenerator.scale(x))
            }
        )
    }


     render() {




         return <Fragment>
             <svg height={height} width={width}>
                 <g transform={`translate(${margin.left},${margin.top})`}>
                 </g>
             </svg>
         </Fragment>
     }
}
