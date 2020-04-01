import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const InnerList=['Camden',
    'Greenwich',
    'Hackney',
    'Hammersmith and Fulham',
    'Islington',
    'Kensington and Chelsea',
    'Lambeth',
    'Lewisham',
    'Southwark',
    'Tower Hamlets',
    'Wandsworth',
    'Westminster']

export const useData = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        console.log('1');
        d3.csv('./happy.csv').then(d=>{
            let data={};
            d.map((l,index)=>{
                //l 结构：
                // Code: "E09000001"
                // Area: "City of London"
                // 2011/12: "x"
                // 2012/13: "x"
                // 2013/14: "x"
                // 2014/15: "x"
                // 2015/16: "x"
                // 2016/17: "x"
                let pro=Object.getOwnPropertyNames(l);
                // console.log(l);
                pro.map((n,index)=>{
                    if(index>1){
                        if(data[n]===undefined){
                            data[n]={}
                        }
                        if(data[n][l['Area']]===undefined){
                            data[n][l['Area']]={};
                        }
                        data[n][l['Area']].happy=l[n];
                        if(InnerList.indexOf(l['Area'].toString())>=0){
                            console.log('innner')
                            data[n][l['Area']].Area='InnerLondon'
                        }
                        else data[n][l['Area']].Area='OuterLondon'
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
            // hpData=d;
            // console.log('data:',data);
            d3.csv('./worthwhile.csv').then(d=>{
                d.map((l,index)=>{
                    let pro=Object.getOwnPropertyNames(l);
                    pro.map((n,index)=>{
                        if(index>1){
                            if(data[n]===undefined){
                                data[n]={}
                            }
                            if(data[n][l['Area']]===undefined){
                                data[n][l['Area']]={};
                            }
                            data[n][l['Area']].worth=l[n];
                        }
                    })
                })
                setData(data)
            });
        })
    },[]);//这里加这个[],可以让这个useEffect只执行一次

    return data;
};
