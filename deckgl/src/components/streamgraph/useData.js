import * as d3 from 'd3'
import {useEffect, useState} from "react";

export function useData(props) {
    const [data,setData]=useState(null);
    const [keys,setKey]=useState(null)
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
    useEffect(()=>{
       d3.csv("./data-city-oneweek.csv").then(d=>{
           let tmpK=[];
           d.forEach(d=>{

               if(tmpK.indexOf(d.city)===-1){
                   tmpK.push(d.city)
               }
           });
           setKey(tmpK);
           //nest 怎么早没想到用d3的工具呢
            let tmp=d3.nest()
                .key(d=>d.timestamp)
                .entries(d)
            let tmpD=[];
            tmp.forEach(d=>{
                let t={};
                t.date=d.key;
                d.values.forEach(d=>{
                    t[d.city]=d.light;
                })
                tmpD.push(t);
            });
            console.log('tmpD',tmpD);
            tmpD.slice(5,19).forEach(d=>{
                console.log(d.date)
                    console.log(new Date(d.date).getHours())
                    console.log(new Date(d.date))
            }

            )
            setData(tmpD);
           // setData(tmpD.slice(19,19+24));
       })
    },[]);

        return [data,keys]
}
