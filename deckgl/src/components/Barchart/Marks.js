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

    const xLength=24;
    const getTime=d=>{
        let date=new Date(d.date);
        let hour=date.getHours();
        let day=date.getDate();
        return day+'/'+hour+':00'

    }

    const delay=1000;

    let stack = d3.stack()//
        .offset(d3.stackOffsetNone)
        .order(d3.stackOrderNone);


    var colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10);

    var area = d3.area()
        .x(d => xScale(xValue(d.data))+margin.left)
        .y0(d => (yScale(d[0])+margin.top))
        .y1(d => (yScale(d[1])+margin.top))
        .curve(d3.curveBasis);


    if(data){
        data=data.slice(19,139);
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


        let rectData=[];
//stack的数据结构：
//      //数组里面7个元素分别对应7个地点
//      //每个元素又是一个数组有24个元素分别对应24小时
/*       (7) [Array(24), Array(24), Array(24), Array(24), Array(24), Array(24), Array(24)]
0: Array(24)
0: (2) [0, 19.3671431509997, data: {…}, key: "San Francisco"]
1: (2) [0, 20.8082012083461, data: {…}, key: "San Francisco"]
2: (2) [0, 22.5238576663828, data: {…}, key: "San Francisco"]
3: (2) [0, 24.4214051463704, data: {…}, key: "San Francisco"]
4: (2) [0, 26.2049693716955, data: {…}, key: "San Francisco"]
5: (2) [0, 26.579802484894, data: {…}, key: "San Francisco"]
6: (2) [0, 26.5525094442272, data: {…}, key: "San Francisco"]
7: (2) [0, 23.9758724990251, data: {…}, key: "San Francisco"]
8: (2) [0, 20.7705334007582, data: {…}, key: "San Francisco"]
9: (2) [0, 19.5826361563267, data: {…}, key: "San Francisco"]
10: (2) [0, 18.7265399946616, data: {…}, key: "San Francisco"]
11: (2) [0, 18.2886029132647, data: {…}, key: "San Francisco"]
12: (2) [0, 17.4904771411586, data: {…}, key: "San Francisco"]
13: (2) [0, 17.1831430954037, data: {…}, key: "San Francisco"]
14: (2) [0, 17.2898856656444, data: {…}, key: "San Francisco"]
15: (2) [0, 17.8578100360021, data: {…}, key: "San Francisco"]
16: (2) [0, 18.1992192220978, data: {…}, key: "San Francisco"]
17: (2) [0, 18.13420905954, data: {…}, key: "San Francisco"]
18: (2) [0, 18.5888149684944, data: {…}, key: "San Francisco"]
19: (2) [0, 18.6733003026984, data: {…}, key: "San Francisco"]
20: (2) [0, 19.1600833190036, data: {…}, key: "San Francisco"]
21: (2) [0, 19.207095797011, data: {…}, key: "San Francisco"]
22: (2) [0, 18.9847082241235, data: {…}, key: "San Francisco"]
23: (2) [0, 19.4293802064908, data: {…}, key: "San Francisco"]
key: "San Francisco"
index: 0
length: 24
__proto__: Array(0)
1: (24) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), key: "Bangalore", index: 1]
2: (24) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), key: "Boston", index: 2]
3: (24) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), key: "Geneva", index: 3]
4: (24) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), key: "Rio de Janeiro", index: 4]
5: (24) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), key: "Shanghai", index: 5]
6: (24) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), key: "Singapore", index: 6]
length: 7
__proto__: Array(0)*/
//
//把 stack 再转换成按时间分组的数据，其实data就是按时间分组的，但是为了计算出堆叠出来的数据所以用的了stack
        stacked.map(x=>{
            x.map((t,index)=>{
                t.key=x.key;
                if(rectData[index]===undefined){
                    rectData[index]=[]
                }
                rectData[index].push(t);
            })
        })

        // console.log('rectData',rectData)


        const group=svg.append('g');
        const g2=svg.append('g');
        let count=0;
        let tmpData=[];


        let groupCount=[];

        // tmpData.forEach(d=>{d.n=tmpData.indexOf(d)})
        let testData=[];

        function update(){
            let popNum=0;
            groupCount.unshift(rectData[count].length);
            if(groupCount.length>xLength){
                // console.log('24')
                popNum=groupCount.pop()
            }
            //tmpData 里面是每一个小矩形的数据(到目前为止所有插入的矩形)，如何对这些矩形计数呢从而和时间对应
            //无论你有多少数据我都只取前24组时间内的数据//不对啊我这样做出来的效果并不是时间轴跟着动而是这个温度变成下一个时刻的温度这样的动态效果，最好试用的例子是不同年龄段的人随着时间变化的过程，并不是温度
            rectData[count].forEach(d=>{
                    d.count=count;
                    tmpData.unshift(d)
                }
            );

            testData.unshift(
                    rectData[count]

                );
            // console.log('testData',xValue(testData[0][0].data))
            if(testData.length>xLength)testData.pop();
            // console.log('testData',testData)
            let g=g2.selectAll('g').data(testData).enter().append('g');
            // console.log('g',g);
            // let g3=g.enter().append('g');
            // g3.append('text').attr('x',d=>xScale(xValue(d[0].data))+margin.left).attr('y',d=>yScale(d[0][1])+margin.top).text(d=>xValue(d[0].data))
            let g4=g2.selectAll('g')
                .selectAll('rect')
                .data(d=>d)
                .join(
                    enter=>enter.append('rect')
                        .attr('fill', function (d) {
                            return d3.interpolateSpectral(keys.indexOf(d.key)/8);
                        })
                        .attr('x', d =>{
                            // console.log('x',xScale(xValue(d.data))+margin.left)
                            return xScale(xValue(d.data))+margin.left-5
                        } )
                        .attr('y',d => (yScale(d[1])+margin.top))
                        .attr('height',d=>(yScale(d[0])-yScale(d[1]))),

                    update=>update
                    //     .attr('x',d=>{
                    //     console.log(this)
                    //     if(d.count===count&&d.count>=xLength){
                    //         return xScale(xValue(d.data))+margin.left
                    //     }
                    //     else return this.x
                    // })
                )

                // .attr('cx',(d,i,node)=>{
                //     console.log('node',node);
                //     if(xValue(d.data)===0&&i!==0)
                //         return xScale(xValue(d.data))+margin.left
                //     else return(node[i].cx)
                // })
            g4.filter((d,i)=>{
                return xValue(d.data)===0
            }).attr('fill', function (d) {
                // console.log('count',d.count)
                return d3.interpolateSpectral(keys.indexOf(d.key)/8);
            })
                .attr('x', d =>{
                    // console.log('next!!')
                    return xScale(xValue(d.data))+margin.left-5
                } )
                .attr('y',d => (yScale(d[1])+margin.top))
                // .attr('height',d=>(yScale(d[0])-yScale(d[1])))
                .attr('width',0)


            let p1=g4.transition()
                .duration(delay)
                .attr('fill', function (d) {
                    return d3.interpolateSpectral(keys.indexOf(d.key)/8);
                })
                .attr('x', d =>{
                    // console.log('x',xScale(xValue(d.data))+margin.left)
                    return xScale(xValue(d.data))+margin.left-5
                } )
                .attr('y',d => (yScale(d[1])+margin.top))
                .attr('height',d=>(yScale(d[0])-yScale(d[1])))
                .attr('width',10)
                .end()

            let g5=g2.selectAll('g').selectAll('text')
                .data(d=>d)
                .join('text')
                .text((d,i,node)=>{
                    // console.log('d12',d);
                    if (i===6) return getTime(d.data);
                    else return null
                })
                .attr('dy',".2em")
                .attr('font-size',"8")


            g5.filter(d=>{
                return xValue(d.data)===0
            }).attr('x',d=>xScale(xValue(d.data))+margin.left-12)
                .attr('y',d=>yScale(d[1])+margin.top)

            g5.transition()
                .duration(delay)
                .attr('x',d=>xScale(xValue(d.data))+margin.left-12)
                .attr('y',d=>yScale(d[1])+margin.top)
            // g3.selectAll('circle').data(d=>d).enter().append('circle')
            //     .transition()
            //     .duration(2000)
            //     .attr('r',10).attr('cy',d=>yScale(d[1])+margin.top).attr('cx',d=>xScale(xValue(d.data))+margin.left);

            // console.log('g3',)





            //如果界面满了就不再增加数据量
            for(let i=0;i<popNum;i++){
                tmpData.pop()
            }
            let t=[];
            tmpData.forEach((d,index)=>{
                let m=[d[0],d[1]];
                m.data=d.data;
                m.key=d.key;
                m.n=index;
                m.count=d.count
                t.push(m)
            });
            console.log('t.len',t.length)




            // console.log('t',t);
            // console.log('tmpData',tmpData);
            // let s1=group.selectAll('rect')
            //     .data(t,d=>d.n)
            // .join(
            //         enter=>enter.append('rect')
            //             .attr('fill', function (d) {
            //                 return d3.interpolateSpectral(keys.indexOf(d.key)/8);
            //             })
            //             .attr('x', d =>{
            //                 // console.log('x',xScale(xValue(d.data))+margin.left)
            //                 return xScale(xValue(d.data))+margin.left
            //             } )
            //             .attr('y',d => (yScale(d[1])+margin.top))
            //             .attr('height',d=>(yScale(d[0])-yScale(d[1]))),
            //
            //         update=>update
            //         //     .attr('x',d=>{
            //         //     console.log(this)
            //         //     if(d.count===count&&d.count>=xLength){
            //         //         return xScale(xValue(d.data))+margin.left
            //         //     }
            //         //     else return this.x
            //         // })
            //     )
            // //要选择的是坐标轴最后一个数据而不是最新的数据！！！而最后一个的当前数据的时间是0点
            // let f=group.selectAll('rect')
            //     .filter(d=>xValue(d.data)===0&&d.count>1)
            //     .attr('fill', function (d) {
            //         // console.log('count',d.count)
            //         return d3.interpolateSpectral(keys.indexOf(d.key)/8);
            //     })
            //     .attr('x', d =>{
            //         // console.log('next!!')
            //         return xScale(xValue(d.data))+margin.left
            //     } )
            //     .attr('y',d => (yScale(d[1])+margin.top))
            //     // .attr('height',d=>(yScale(d[0])-yScale(d[1])))
            //      .attr('width',0)
            //
            // let p1=s1.transition()
            //     .duration(800)
            //     .attr('fill', function (d) {
            //         return d3.interpolateSpectral(keys.indexOf(d.key)/8);
            //     })
            //     .attr('x', d =>{
            //         // console.log('x',xScale(xValue(d.data))+margin.left)
            //         return xScale(xValue(d.data))+margin.left
            //     } )
            //     .attr('y',d => (yScale(d[1])+margin.top))
            //     .attr('height',d=>(yScale(d[0])-yScale(d[1])))
            //     .attr('width',10)
            //     .end()
            // let p2=s1.enter().append('rect')
            //     .attr('fill', function (d) {
            //         return d3.interpolateSpectral(keys.indexOf(d.key)/8);
            //     })
            //     .attr('x', d =>{
            //         // console.log('x',xScale(xValue(d.data))+margin.left)
            //         return xScale(xValue(d.data))+margin.left
            //     } )
            //     .attr('y',d => (yScale(d[1])+margin.top))
            //     .attr('height',d=>(yScale(d[0])-yScale(d[1])))
            //     // .attr('stroke', function (d) { return d3.interpolateSpectral(keys.indexOf(d[0].data[d.index]/8)); })
            //     // .transition()
            //     // .duration(2000)
            //     .transition()
            //     .duration(1000)
            //     .attr('width',10)
            //     .end();



             // let p2= p.enter().append('rect')
             //      .attr('fill', function (d) {
             //    return d3.interpolateSpectral(keys.indexOf(d.key)/8);
             //    })
             //    .transition()
             //    .duration(2000)
             //    .attr('x', d =>{
             //        console.log('x',xScale(xValue(d.data))+margin.left)
             //        return xScale(xValue(d.data))+margin.left
             //    } )
             //    .attr('y',d => (yScale(d[1])+margin.top))
             //    .attr('height',d=>(yScale(d[0])-yScale(d[1])))
             //    // .attr('stroke', function (d) { return d3.interpolateSpectral(keys.indexOf(d[0].data[d.index]/8)); })
             //    // .transition()
             //    // .duration(2000)
             //    .attr('width',10)
             //     .end()
            p1.then(()=>{
                if(count<(rectData.length-1)){
                    // let p2=group.transition()
                    //     .duration(1000)
                    //     .attr("transform", `translate(${xScale(1)-xScale(0)},0)`)
                    //     .end()
                    // p2.then(()=>{
                        count++;
                        // tmpData=tmpData.slice(0,2);

                    // console.log('tmpData1',tmpData);
                    // console.log('t1',t)
                        update()
                        // }
                    // )

                }
                else{
                    // callback()
                    // count=0;
                }
            })
        }

        update();

        // stacked.map((x,index)=>{
        //     // if(index!==0){
        //     //     return
        //     // }
        //     svg.selectAll('rect')
        //         .data(x)
        //
        // })
        // let p=
        //     .end();

        // p.then(r=>{
        //     callback()
        // })
    }

    return null;

}
