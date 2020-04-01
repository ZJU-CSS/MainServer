import React from 'react';
import * as d3 from "d3";

export const Marks = ({
                          data,
                          xScale,
                          xValue,
                          yScale,
                          innerHeight,
                          innerWidth,
                          margin,
                          keys,
                            start,
                          callback
                      }) =>{

    const svg=d3.select('svg');

    let stack = d3.stack()//
        .offset(d3.stackOffsetWiggle)
        .order(d3.stackOrderNone);


    var colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10);

    var area = d3.area()
        .x(d => xScale(xValue(d.data))+margin.left)
        .y0(d => (yScale(d[0])+margin.top))
        .y1(d => (yScale(d[1])+margin.top))
        .curve(d3.curveBasis);


    if(data){
        data=data.slice(start,start+24);
        // console.log(keys)
        stack.keys(keys);
        // console.log('data',data);
        let stacked=stack(data);
        // console.log('stack',stacked);

        colorScale.domain(d3.range(keys.length));

        xScale
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth]);
        yScale
            .domain([
                d3.min(stacked, function (series) {
                    return d3.min(series, function (d) { return d[0]; });
                }),
                d3.max(stacked, function (series) {
                    return d3.max(series, function (d) { return d[1]; });
                })
            ])
            .range([ innerHeight,0]);

        let p=svg.selectAll('path')
            .data(stacked)
            .join('path')
            .attr('fill', function (d) {
                // console.log('d',d)
                // console.log(d[0].data[d.index]);
                return d3.interpolateSpectral(keys.indexOf(d.key)/8);
            })
            .attr('stroke', function (d) { return d3.interpolateSpectral(keys.indexOf(d[0].data[d.index]/8)); })
            .transition()
            .duration(2000)
            .attr('d', area)
            .end();

        p.then(r=>{
            callback()
        })
    }

    return null;

}
