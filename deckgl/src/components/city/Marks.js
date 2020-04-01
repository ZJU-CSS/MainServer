import React from 'react';
import * as d3 from "d3";


export const Marks = ({
                          data,
                          xScale,
                          xValue,
                          yScale,
                          yValue,
                          colorScale,
                          colorValue,
                          tooltipFormat,
                          circleRadius,
                          year,
                          callback,
                          margin
                      }) =>{
    function dataAt(year){
        console.log('data:',data);
        let results=[];
        let pro=Object.getOwnPropertyNames(data[year]);
        pro.forEach(d=>{
            results.push({
                city:d,
                data:data[year][d],
            })
        })
        return results
    }

    if(year&&data){
        let currentData=dataAt(year+'/'+(year-2000+1));
        let svg=d3.select('svg');
        let c1=svg.selectAll("circle")
            .data(currentData,d=>d['city'])
        console.log('enter',c1)
        let c=c1
            .join('circle')
            .attr("stroke", "black")

            .transition()
            // .on('end',function repeat(){
            //     console.log('end')
            // })
            .duration(1000)
            .attr("r", d =>{
                if(!(parseFloat(d.data['happy'])&&parseFloat(d.data['worth']))) return 0;
                else return Math.random()*10
            })
            .attr("cx", d => {if(parseFloat(d.data['happy'])){
                // console.log(d.data['happy'])
                return xScale(d.data['happy'])+margin.left
            }})
            .attr("cy", d => {if(d.data['worth']){
                return yScale(d.data['worth'])+margin.top
            }
            })
            .attr("fill", d =>{
                // console.log('d',d);
                //  console.log('Area',d.data.Area)
                return colorScale(d.data.Area)
            } )
            .end();
        c.then(result=>{
            // if(year<2016){
            //     setYear(year+1)
            //     // updateCircle()
            // }
            // else {
            //     setYear(2011)
            //     // console.log('year:',year)
            //     // year=2011;
            //     // updateCircle()
            // }
            callback();
            console.log('done')
        })
    }
    return null
}
    // data.map(d => (
    //     <circle
    //         className="mark"
    //         cx={xScale(xValue(d))}
    //         cy={yScale(yValue(d))}
    //         fill={colorScale(colorValue(d))}
    //         r={circleRadius}
    //     >
    //         <title>{tooltipFormat(xValue(d))}</title>
    //     </circle>
    // ));
