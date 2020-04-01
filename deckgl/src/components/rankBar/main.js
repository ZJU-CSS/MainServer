import * as d3 from 'd3'
import React, {Component} from "react";

const width = 960;
const height = 500;
const margin = { top: 20, right: 200, bottom: 65, left: 150 };
var innerWidth = width - margin.right - margin.left;
var innerHeight = height - margin.top - margin.bottom;

function init() {



}


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

// function keyframes() {
//     const keyframes=[];
//     let ka,a,kb,b;
//     for([[ka,a],[kb,b]] of d3.pairs(datavalues)){
//         for()
//
//     }
// }


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
