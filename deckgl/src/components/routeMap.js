// /// app.js
import React,{Fragment} from 'react';
import DeckGL from '@deck.gl/react';
import {TripsLayer} from '@deck.gl/geo-layers';
import {StaticMap} from 'react-map-gl';
import * as d3 from 'd3'
//
// // Set your mapbox access token here
// const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiemhpZ3VhbmdkYSIsImEiOiJjanozdXg0b3EwMHh4M21tcXk2MHlpN3B1In0.lInf8zFl2BsP_bDjMFhf3w';
//
// // Initial viewport settings
// const initialViewState = {
//     longitude: -122.41669,
//     latitude: 37.7853,
//     zoom: 13,
//     pitch: 0,
//     bearing: 0
// };
//
// // Data to be used by the LineLayer
// const data = [   {
//              waypoints: [{coordinates: [-122.3907988, 37.7664413], timestamp: 1554772579000},
//                      {coordinates: [-122.3908298,37.7667706], timestamp: 1554772579010},
//                      {coordinates: [-122.4485672, 37.8040182], timestamp: 1554772580200}
//              ]
//      }];
//
// class App extends React.Component {
//     render() {
//         const layers = [
//             new TripsLayer({id: 'trips-layer', data,
//                 getPath:d => d.waypoints.map(p => p.coordinates),
//                 getTimestamps: d => d.waypoints.map(p => p.timestamp - 1554772579000),
//                 getColor: [253, 128, 93],
//                 opacity: 0.8,
//                 widthMinPixels: 5,
//                 rounded: true,
//                 trailLength: 200,
//                 currentTime: 0
//
//             })
//         ];
//
//         return (
//             <DeckGL
//                 initialViewState={initialViewState}
//                 controller={true}
//                 layers={layers}
//             >
//                 <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
//             </DeckGL>
//         );
//     }
// }
// ReactDOM.render(<App />, document.getElementById('root'));
import {Component} from 'react';

import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {ColumnLayer, PolygonLayer,IconLayer,ScatterplotLayer} from '@deck.gl/layers';

import SliderTraffic from "./sliderTraffic";
import { Select,SIZE } from "baseui/select";
import {BaseProvider, LightTheme, styled} from "baseui";
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';

const SelectContainer=styled('div',{
    position: 'absolute',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 1,
    top: '50px',
    right:'10px',
    width:'15%',
    // height:'5%'
});
const SelectContainer2=styled('div',{
    position: 'absolute',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 1,
    top: '50px',
    left:'10px',
    width:'15%',
    // height:'5%'
});
const engine = new Styletron();


// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemhpZ3VhbmdkYSIsImEiOiJjanozdXg0b3EwMHh4M21tcXk2MHlpN3B1In0.lInf8zFl2BsP_bDjMFhf3w';

const DATA_URL =
    'https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/data.csv';

//加载区域数据
var depData=[];
var depCenter=[];

let desCenter=[];
let desData=[];

let depPolygon=[];
let desPolygon=[];

let colorTable=[[128,255,0,255],[255,255,40,255],[255,128,0,255],[255,64,64,255],[255,0,0,255]];


const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 32, height: 32, mask: true}
};



// Source data CSV
// const DATA_URL = {
//     BUILDINGS:
//         'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
//     TRIPS:
//         'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips-v7.json' // eslint-disable-line
// };

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});

const pointLight = new PointLight({
    color: [255, 255, 255],
    intensity: 2.0,
    position: [120.167057, 30.185901, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = {
    ambient: 0.1,
    diffuse: 0.9,
    shininess: 64,
    specularColor: [60, 64, 70]
};

const DEFAULT_THEME = {
    buildingColor: [74, 80, 87],
    trailColor0: [253, 128, 93],
    trailColor1: [23, 184, 190],
    material,
    effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
    longitude:  120.207057,
    latitude: 30.225901,
    // longitude:-74.00823,
    // latitude: 40.71351,
    zoom: 12.4,
    pitch: 45,
    bearing: 0
};

//柱状图的颜色
const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];




// d3.json("https://api.openaq.org/v1/latest?limit=10000").then(data=>{
//     console.log(data)
// })


var Routes=[];
function Rad(d){
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}
var getDistance=function(lng1,lat1,lng2,lat2){
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var  b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    //s=s.toFixed(4);
    return s;
}

// var od=[];
// var getRoutedata=function(start,end) {
//
//     var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + depCenter[start][0] + ',' + depCenter[start][1] + ';' + desCenter[end][0] + ',' + desCenter[end][1] + '?steps=true&geometries=geojson&access_token=' + 'pk.eyJ1IjoiemhpZ3VhbmdkYSIsImEiOiJjanozdXg0b3EwMHh4M21tcXk2MHlpN3B1In0.lInf8zFl2BsP_bDjMFhf3w';
//
//     // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
//     var req = new XMLHttpRequest();
//     req.open('GET', url, true);
//     req.send()
//     req.onload = function () {
//         var json = JSON.parse(req.response);
//         // console.log('route:',json)
//         var data = json.routes[0];
//         var route = data.geometry.coordinates;
//         var timestamps=[0];//先设置每条路径1000stamp
//         for(var i=0;i<route.length;i++){
//             if(i!==0){
//                 var dist=getDistance(route[i-1][0],route[i-1][1],route[i][0],route[i][1])*50;
//                 timestamps.push(dist+timestamps[i-1])
//             }
//         }
//         var geojson = {
//             'path': route,
//             'timestamps':timestamps,
//         };
//         console.log(geojson)
//         Routes.push(geojson)
//
//     }
// }
//getRoutedata([120.167057,30.185901], [120.302548	,30.399632])

var saveJson={}

// var getRoute=new function(time) {
//     // var gets = [];
//     d3.csv("./edge_dep_csv.csv").then(function (data) {
//
//         let re=/([-+]?[0-9]*\.?[0-9]+)/g;
//         console.log('data1:',data)
//         data.forEach(d=>{
//             let tmp=d.value.match(re)
//             let tmpData=[];
//             for(let i=0;i<tmp.length-1;i+=2){
//                 tmpData.push([parseFloat(tmp[i+1]),parseFloat(tmp[i])])
//             }
//             depData.push(tmpData)
//         })
//         depData.forEach(d=>{
//             let sumlong=0
//             let sumlat=0;
//             d.forEach(data=>{
//                 sumlong+=data[0];
//                 sumlat+=data[1];
//             })
//             depCenter.push([sumlong/d.length,sumlat/d.length])
//         })
//         d3.csv("./edge_des_csv.csv").then(function (data) {
//             let re=/([-+]?[0-9]*\.?[0-9]+)/g
//             console.log('data2:',data)
//             data.forEach(d=>{
//                 let tmp=d.value.match(re)
//                 let tmpData=[];
//                 for(let i=0;i<tmp.length-1;i+=2){
//                     tmpData.push([parseFloat(tmp[i+1]),parseFloat(tmp[i])])
//                 }
//                 desData.push(tmpData)
//             })
//             desData.forEach(d=>{
//                 let sumlong=0;
//                 let sumlat=0;
//                 d.forEach(data=>{
//                     sumlong+=data[0];
//                     sumlat+=data[1];
//                 })
//                 desCenter.push([sumlong/d.length,sumlat/d.length])
//             });
//             // d3.json('http://localhost:5000/data/12:00:00').then(function(data){
//             //     data.forEach(d=>{
//             //         var tmp=d.split(',');
//             //         if(tmp[0]!=-1 && tmp[1]!=-1) {
//             //             if(tmp[0]>46&&tmp[0]<=60){
//             //              //   if (tmp[2] !== '0') {
//             //                 var urlNow = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + depCenter[tmp[0]][0].toFixed(6) + ',' + depCenter[tmp[0]][1].toFixed(6) + ';' + desCenter[tmp[1]][0].toFixed(6) + ',' + desCenter[tmp[1]][1].toFixed(6) + '?steps=true&geometries=geojson&access_token=' + MAPBOX_TOKEN;
//             //                 gets.push($.ajax({
//             //                     type: 'GET',
//             //                     url: urlNow,
//             //                     success: function (r) {
//             //                         console.log('r:', r)
//             //                         //var json = JSON.parse(data);
//             //                         var plan = r.routes[0];
//             //                         var route = plan.geometry.coordinates;
//             //                         var timestamps = [0];//先设置每条路径1000stamp
//             //                         for (var i = 0; i < route.length; i++) {
//             //                             if (i !== 0) {
//             //                                 var dist = getDistance(route[i - 1][0], route[i - 1][1], route[i][0], route[i][1]) * 50;
//             //                                 timestamps.push(dist + timestamps[i - 1])
//             //                             }
//             //                         }
//             //                         var geojson = {
//             //                             'vendor': 1,
//             //                             'path': route,
//             //                             'timestamps': timestamps,
//             //
//             //                         };
//             //                         console.log(geojson)
//             //                         Routes.push(geojson)
//             //                         saveJson[tmp[0]+','+tmp[1]] = geojson
//             //                     },
//             //                     error:function(){
//             //                         console.log('err')
//             //                     }
//             //                 }));
//             //
//             //            // }
//             //             }
//             //         }
//             //     })
//             //     // url.forEach(function(value) {
//             //     //     console.log('url:',value)
//             //     //     gets.push($.ajax({
//             //     //         type: 'GET',
//             //     //         url: value,
//             //     //         success: function(data) {
//             //     //             console.log('data:',data)
//             //     //             //var json = JSON.parse(data);
//             //     //             var plan = data.routes[0];
//             //     //             var route = plan.geometry.coordinates;
//             //     //             var timestamps=[0];//先设置每条路径1000stamp
//             //     //             for(var i=0;i<route.length;i++){
//             //     //                 if(i!==0){
//             //     //                     var dist=getDistance(route[i-1][0],route[i-1][1],route[i][0],route[i][1])*50;
//             //     //                     timestamps.push(dist+timestamps[i-1])
//             //     //                 }
//             //     //             }
//             //     //             var geojson = {
//             //     //                 'vendor':1,
//             //     //                 'path': route,
//             //     //                 'timestamps':timestamps,
//             //     //
//             //     //             };
//             //     //             console.log(geojson)
//             //     //             Routes.push(geojson)
//             //     //
//             //     //
//             //     //         }
//             //     //     }));
//             //     // });
//             //
//             //     $.when.apply($, gets).then(function() {
//             //         console.log(saveJson)
//             //         var jsonData=JSON.stringify(saveJson)
//             //         download(jsonData,'route.json','text/plain')
//             //         console.log('Routes:',Routes)
//             //         resolve(Routes);
//             //         // resolve([
//             //         //     {
//             //         //         "vendor": 1,
//             //         //         "path": [
//             //         //             [120.167057,30.185901],
//             //         //             [120.165752,30.185723],
//             //         //             [120.16581,30.188491],
//             //         //             [120.190417,30.198224],
//             //         //             [120.191971	,30.204],
//             //         //             [120.189622	,30.20767],
//             //         //             [120.182369	,30.218973],
//             //         //             [120.180889	,30.222601],
//             //         //             [120.200108	,30.306856],
//             //         //             [120.23477	,30.311914],
//             //         //             [120.246959	,30.316748],
//             //         //             [120.309708	,30.387518],
//             //         //             [120.312426	,30.39154],
//             //         //             [120.309069	,30.400897],
//             //         //             [120.302548	,30.399632],],
//             //         //
//             //         //             "timestamps": [ 838, 867.979, 947.036, 962.913, 996.971, 1032.865, 1060.03, 1077.834, 1205.212, 1210.243, 1295.677, 1315.668, 1431.726, 1480.25, 1488.658]
//             //         //     }])
//             //     });
//             // })
//
//             d3.json('http://localhost:5000/data/'+time+':00:00').then(function(data){
//                 var count=0;
//                 d3.json('./10.json').then(function (map) {
//                    // console.log('map:',map)
//                     data.forEach(d=>{
//                         var tmp=d.split(',');
//                         if(tmp[0]!=-1 && tmp[1]!=-1) {
//                             if(parseInt(tmp[2])>=5){
//                                 count++;
//                                 var key=tmp[0]+','+tmp[1];
//                                 console.log(map[key]);
//                                 Routes.push(map[key]);
//                             }
//                             // if(tmp[0]>40&&tmp[0]<=60&&tmp[1]>40&&tmp[1]<=60){
//                                 //   if (tmp[2] !== '0') {
//                                 // var urlNow = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + depCenter[tmp[0]][0].toFixed(6) + ',' + depCenter[tmp[0]][1].toFixed(6) + ';' + desCenter[tmp[1]][0].toFixed(6) + ',' + desCenter[tmp[1]][1].toFixed(6) + '?steps=true&geometries=geojson&access_token=' + MAPBOX_TOKEN;
//                                 // gets.push($.ajax({
//                                 //     type: 'GET',
//                                 //     url: urlNow,
//                                 //     success: function (r) {
//                                 //         console.log('r:', r)
//                                 //         //var json = JSON.parse(data);
//                                 //         var plan = r.routes[0];
//                                 //         var route = plan.geometry.coordinates;
//                                 //         var timestamps = [0];//先设置每条路径1000stamp
//                                 //         for (var i = 0; i < route.length; i++) {
//                                 //             if (i !== 0) {
//                                 //                 var dist = getDistance(route[i - 1][0], route[i - 1][1], route[i][0], route[i][1]) * 50;
//                                 //                 timestamps.push(dist + timestamps[i - 1])
//                                 //             }
//                                 //         }
//                                 //         var geojson = {
//                                 //             'vendor': 1,
//                                 //             'path': route,
//                                 //             'timestamps': timestamps,
//                                 //
//                                 //         };
//                                 //         console.log(geojson)
//                                 //         Routes.push(geojson)
//                                 //         saveJson[tmp[0]+','+tmp[1]] = geojson
//                                 //     },
//                                 //     error:function(){
//                                 //         console.log('err')
//                                 //     }
//                                 // }));
//
//                                 // }
//                            // }
//                         }
//                     })
//                     console.log('count:',count)
//                    // console.log(Routes)
//                 })
//                 // url.forEach(function(value) {
//                 //     console.log('url:',value)
//                 //     gets.push($.ajax({
//                 //         type: 'GET',
//                 //         url: value,
//                 //         success: function(data) {
//                 //             console.log('data:',data)
//                 //             //var json = JSON.parse(data);
//                 //             var plan = data.routes[0];
//                 //             var route = plan.geometry.coordinates;
//                 //             var timestamps=[0];//先设置每条路径1000stamp
//                 //             for(var i=0;i<route.length;i++){
//                 //                 if(i!==0){
//                 //                     var dist=getDistance(route[i-1][0],route[i-1][1],route[i][0],route[i][1])*50;
//                 //                     timestamps.push(dist+timestamps[i-1])
//                 //                 }
//                 //             }
//                 //             var geojson = {
//                 //                 'vendor':1,
//                 //                 'path': route,
//                 //                 'timestamps':timestamps,
//                 //
//                 //             };
//                 //             console.log(geojson)
//                 //             Routes.push(geojson)
//                 //
//                 //
//                 //         }
//                 //     }));
//                 // });
//
//                 // $.when.apply($, gets).then(function() {
//                 //     console.log(saveJson)
//                 //     var jsonData=JSON.stringify(saveJson)
//                 //     download(jsonData,'route.json','text/plain')
//                 //     console.log('Routes:',Routes)
//                 //     resolve(Routes);
//                 //
//                 // });
//             })
//         });
//     });
//
// };



//每条路径按流量加线的数量
let getStep=function(step,trip){
    let newTrip=[]
    trip.forEach(d=>{
        d+=3600/step;
        newTrip.push(d)
    })
    return newTrip;
}


function getArea(){
    d3.csv("./edge_dep_csv.csv").then(function (data) {
        let re = /([-+]?[0-9]*\.?[0-9]+)/g;
        console.log('data1:', data)
        data.forEach((d,index) => {
            let tmp = d.value.match(re)
            let tmpData = [];
            for (let i = 0; i < tmp.length - 1; i += 2) {
                tmpData.push([parseFloat(tmp[i + 1]), parseFloat(tmp[i])])
            }
            depData.push(tmpData)
            depPolygon.push({
                contour:tmpData,
                in:0,
                out:0,
                number:index
            })
        })
        depData.forEach(d => {
            let sumlong = 0
            let sumlat = 0;
            d.forEach(data => {
                sumlong += data[0];
                sumlat += data[1];
            })
            depCenter.push([sumlong / d.length, sumlat / d.length])
        })
        d3.csv("./edge_des_csv.csv").then(function (data) {
            let re = /([-+]?[0-9]*\.?[0-9]+)/g
            console.log('data2:', data)
            data.forEach((d,index)=> {
                let tmp = d.value.match(re)
                let tmpData = [];
                for (let i = 0; i < tmp.length - 1; i += 2) {
                    tmpData.push([parseFloat(tmp[i + 1]), parseFloat(tmp[i])])
                }
                desData.push(tmpData)

                desPolygon.push({
                    contour:tmpData,
                    in:0,
                    out:0,
                    number:index
                })


            });
            desData.forEach(d => {
                let sumlong = 0;
                let sumlat = 0;
                d.forEach(data => {
                    sumlong += data[0];
                    sumlat += data[1];
                })
                desCenter.push([sumlong / d.length, sumlat / d.length])
            });
        })
})
}
//获取流量数据
function getRoute(time) {
    return new Promise(resolve => {
        // var gets = [];
        // d3.json('http://localhost:5000/data/'+time).then(function (data) {
        d3.json('http://192.168.0.161:8888/data/'+time).then(function (data) {

                var count = 0;
            d3.json('./10.json').then(function (map) {
                // console.log('map:',map)
                var routeData=[];
                var sumMax=0;
                data.forEach(d => {
                    var tmp = d.split(',');
                    if (tmp[0] != -1 && tmp[1] != -1) {
                        if (parseInt(tmp[2]) >= 2) {

                            depPolygon[parseInt(tmp[0])].out+=parseInt(tmp[2]);
                            desPolygon[parseInt(tmp[1])].in+=parseInt(tmp[2]);
                            count++;
                            var key = tmp[0] + ',' + tmp[1];

                            //  console.log(map[key]);
                            var pre=[];
                            var sum=0;
                            var countD=[];
                            map[key].path.forEach(d=>{
                                if(pre.length==0){
                                    pre=d
                                }
                                else{
                                    // console.log('pre:',pre);
                                    var m=getDistance(pre[0],pre[1],d[0],d[1]);
                                    countD.push(m);
                                    sum+=m;
                                    pre=d;
                                }
                            });
                            if(sum>=sumMax){
                                sumMax=sum
                            }
//control color
                            if(parseInt(tmp[2]) >= 2&& parseInt(tmp[2]) < 5){
                                routeData.push({
                                    'od':parseInt(tmp[0])+','+parseInt(tmp[1]),
                                    'traffic':parseInt(tmp[2]),
                                    "color":0,
                                    "path":map[key].path,
                                    "timestamps":countD
                                })
                                // console.log('path',map[key].path)
                            }

                            else if(parseInt(tmp[2]) >=5&&parseInt(tmp[2]) <20){
                                routeData.push({
                                    'od':parseInt(tmp[0])+','+parseInt(tmp[1]),
                                    'traffic':parseInt(tmp[2]),
                                    "color":1,
                                    "path":map[key].path,
                                    "timestamps":countD
                                })
                            }
                            else if(parseInt(tmp[2]) >=20&&parseInt(tmp[2]) <100){
                                routeData.push({
                                    'od':parseInt(tmp[0])+','+parseInt(tmp[1]),
                                    'traffic':parseInt(tmp[2]),
                                    "color":2,
                                    "path":map[key].path,
                                    "timestamps":countD
                                })
                            }
                            else if(parseInt(tmp[2]) >= 100&&parseInt(tmp[2]) <150){
                                routeData.push({
                                    'od':parseInt(tmp[0])+','+parseInt(tmp[1]),
                                    'traffic':parseInt(tmp[2]),
                                    "color":3,
                                    "path":map[key].path,
                                    "timestamps":countD
                                })
                            }
                            else if(parseInt(tmp[2]) >= 150){
                                routeData.push({
                                    'od':parseInt(tmp[0])+','+parseInt(tmp[1]),
                                    'traffic':parseInt(tmp[2]),
                                    "color":4,
                                    "path":map[key].path,
                                    "timestamps":countD
                                })
                            }

                        }

                    }
                });
                let newRoutes=[];
                //按照流量多加动画效果
                routeData.forEach(d=>{
                    var tmpTime=[time*3600];
                    let preIndex=0;
                    // console.log('timestamps:',d.timestamps)
                    d.timestamps.forEach(t=>{
                        // console.log('t:',t)
                        tmpTime.push(tmpTime[preIndex]+(3600/sumMax)*t)//加上当前已经过去的小时的时间
                        preIndex++;
                    });
                    d.timestamps=tmpTime;
                    let tmpStep=tmpTime;
                    for(let i=0;i<(d.traffic);i++){
                        tmpStep=getStep((d.traffic),tmpStep);
                        newRoutes.push({
                            'od':d.od,
                            'traffic':d.traffic,
                            "color":d.color,
                            "path":d.path,
                            "timestamps":tmpStep
                        })
                    }
                });
                newRoutes.forEach(d=>{
                    routeData.push(d)
                })
                // routeData.forEach(d=>{
                //     Routes.push(d)
                // })
                Routes=routeData;
                console.log('count:', count);
                console.log('Routes:', Routes)
                resolve('0')
                // console.log(Routes)
            })

        })

    });
}


let predict_origin=new Map();
let predict_des=new Map();

//获取预测流量数据
function getPredictData(){
    return new Promise( resolve => {
        d3.csv('./Traffic_Predict_Data/prediction1-origin.csv').then(d=>{
            d.map((x,index)=>{
                // console.log('time',x.DepTime);
                let date=new Date(x.DepTime);
                // console.log('hour',date.getHours())
                let hour=date.getHours();
                if(!predict_origin.has(hour)){
                    predict_origin.set(hour,{})
                }
                let tmp=predict_origin.get(hour)
                tmp[x.Origin]=x.Trips
            })
            d3.csv('./Traffic_Predict_Data/prediction2-dep.csv').then(d=>{d.map((x,index)=>{
                let date=new Date(x.DepTime);
                // console.log('hour',date.getHours())
                let hour=date.getHours();
                    if(!predict_des.has(hour)){
                        predict_des.set(hour,{})
                    }
                    let tmp=predict_des.get(hour)
                        tmp[x.Destination]=x.Trips;
                    });
                resolve();
                }
            )
            }
        )
    })
}

let realOrg=new Map()
let realDes=new Map()
//获取真实流量数据
function getRealData(){
    d3.csv('./Traffic_Predict_Data/origin.csv').then(d=>{
            d.map((x,index)=>{
                // console.log('time',x.DepTime);
                let date=new Date(x.DepTime);
                // console.log('hour',date.getHours())
                let hour=date.getHours();
                if(!realOrg.has(hour)){
                    realOrg.set(hour,{})
                }
                let tmp=realOrg.get(hour)
                tmp[x.Origin]=x.Trips
            })
            d3.csv('./Traffic_Predict_Data/destination.csv').then(d=>{d.map((x,index)=>{
                    let date=new Date(x.DepTime);
                    // console.log('hour',date.getHours())
                    let hour=date.getHours();
                    if(!realDes.has(hour)){
                        realDes.set(hour,{})
                    }
                    let tmp=realDes.get(hour)
                    tmp[x.Destination]=x.Trips;
                });
                }
            )
        }
    )
}

let blockRoute=[]
let count=[]
let blockData=new Map();
function getBlockData(){
    d3.csv('./blockdetect/anomalyFile.csv').then(d=>{
        d.map(x=>{
            console.log(x)
            console.log(x['occurencingTime'])
            let da=new Date(x['occurencingTime']);
            console.log('da',da)
            let h=da.getHours();
            let m=da.getMinutes();
            let s=da.getSeconds();
            let t=h*3600+m*60+s;
            blockData.set(t,[parseFloat(x['longitude']),parseFloat(x['latitude'])])
        })
        console.log(blockData)
    })
}
function getBlockRoute(){
    return new Promise(resolve => {
        d3.csv('./blockdetect/GPS_588_merge.csv').then(d=>{
            console.log(d)
            let path=[];
            let timestamps=[]
            let m=0;
            d.map((x,index)=>{
                // console.log('x',x);
                // console.log('lat',x.lat)
                let da=new Date(x['date']);
                let h=da.getHours();
                let m=da.getMinutes();
                let s=da.getSeconds();
                let t=h*3600+m*60+s;
                if(count.indexOf(t)===-1&&m%5===0){
                    m++;
                    count.push(t)
                    timestamps.push(t)
                    path.push([parseFloat(x['Long']),parseFloat(x['Lat'])])
                    if(m%1===0){
                        blockData.set(t,[parseFloat(x['Long']),parseFloat(x['Lat'])])

                    }
                }

            })
            blockRoute.push({
                path:path,
                timestamps:timestamps,
                color:0
            })


            resolve();
        })

    })






}

//设置预测流量数据
function setPredictData(hour){
    console.log('org',predict_origin);
    let data=[];
    let tmp=predict_origin.get(parseInt(hour));
    console.log('tmp',tmp)
    for(let key in tmp){
        // console.log('key',key)
        data.push({
            centroid: depCenter[parseInt(key)],
            value:tmp[key]
        })
    }
    // console.log('data',data)
    return data;
}
//设置实际流量数据
function setRealData(hour){
    // console.log('org',predict_origin)
    let data=[];
    let tmp=realOrg.get(parseInt(hour));
    console.log('tmp',tmp)
    for(let key in tmp){
        // console.log('key',key)
        data.push({
            centroid: depCenter[parseInt(key)],
            value:tmp[key]
        })
    }
    console.log('data',data)
    return data;

}



// getRoute.then(function () {
//     console.log('get')
// });

let tmpIcon=[];

export default class RouteMap extends Component {

    constructor(props) {
        super(props);
         // const [value, setValue] = React.useState([0]);
        this.state = {
            time: 18000,
            hour:-1,
            depV:false,
            desV:false,
            area:[],
            options:[],
            block:false,
            pre_org:[],
            pre_des:[],
            real_org:[],
            real:false,
            showPredict:true,
            blockIcon:[],
            showRoute:true


        };
    }
    componentDidMount() {
        getArea();
        let p= getPredictData();
        p.then(function() {
            // this.setState({
            //     pre_origin: predict_origin,
            //     pre_des : predict_des
            // })
        }.bind(this))

        getRealData();

        let p2=getBlockRoute();
        p2.then(function () {
            console.log('blockRoute',blockRoute)

            this.setState({
                blockRoute:blockRoute
            })
        }.bind(this) )


        let button=document.getElementById('start')
        console.log(button)

        setTimeout(()=>{button.click()},1200)

        // getBlockData();


        // this.setState({
        //     depPolygon:depPolygon,
        //     desPolygon:desPolygon
        // })
    }

    componentWillUnmount() {
        // if (this._animationFrame) {
        //     window.cancelAnimationFrame(this._animationFrame);
        // }
    }

//get route from mapbox
    // getRoute(){
    //     d3.csv("./edge_dep_csv.csv").then(function (data) {
    //
    //         let re=/([-+]?[0-9]*\.?[0-9]+)/g;
    //         console.log('data1:',data)
    //         data.forEach(d=>{
    //             let tmp=d.value.match(re)
    //             let tmpData=[];
    //             for(let i=0;i<tmp.length-1;i+=2){
    //                 tmpData.push([parseFloat(tmp[i+1]),parseFloat(tmp[i])])
    //             }
    //             depData.push(tmpData)
    //         })
    //         depData.forEach(d=>{
    //             let sumlong=0
    //             let sumlat=0;
    //             d.forEach(data=>{
    //                 sumlong+=data[0];
    //                 sumlat+=data[1];
    //             })
    //             depCenter.push([sumlong/d.length,sumlat/d.length])
    //         })
    //         d3.csv("./edge_des_csv.csv").then(function (data) {
    //             let re=/([-+]?[0-9]*\.?[0-9]+)/g
    //             console.log('data2:',data)
    //             data.forEach(d=>{
    //                 let tmp=d.value.match(re)
    //                 let tmpData=[];
    //                 for(let i=0;i<tmp.length-1;i+=2){
    //                     tmpData.push([parseFloat(tmp[i+1]),parseFloat(tmp[i])])
    //                 }
    //                 desData.push(tmpData)
    //             })
    //             desData.forEach(d=>{
    //                 let sumlong=0;
    //                 let sumlat=0;
    //                 d.forEach(data=>{
    //                     sumlong+=data[0];
    //                     sumlat+=data[1];
    //                 })
    //                 desCenter.push([sumlong/d.length,sumlat/d.length])
    //             });
    //             // d3.json('http://localhost:5000/data/12:00:00').then(function(data){
    //             //     data.forEach(d=>{
    //             //         var tmp=d.split(',');
    //             //         if(tmp[0]!=-1 && tmp[1]!=-1) {
    //             //             if(tmp[0]>46&&tmp[0]<=60){
    //             //              //   if (tmp[2] !== '0') {
    //             //                 var urlNow = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + depCenter[tmp[0]][0].toFixed(6) + ',' + depCenter[tmp[0]][1].toFixed(6) + ';' + desCenter[tmp[1]][0].toFixed(6) + ',' + desCenter[tmp[1]][1].toFixed(6) + '?steps=true&geometries=geojson&access_token=' + MAPBOX_TOKEN;
    //             //                 gets.push($.ajax({
    //             //                     type: 'GET',
    //             //                     url: urlNow,
    //             //                     success: function (r) {
    //             //                         console.log('r:', r)
    //             //                         //var json = JSON.parse(data);
    //             //                         var plan = r.routes[0];
    //             //                         var route = plan.geometry.coordinates;
    //             //                         var timestamps = [0];//先设置每条路径1000stamp
    //             //                         for (var i = 0; i < route.length; i++) {
    //             //                             if (i !== 0) {
    //             //                                 var dist = getDistance(route[i - 1][0], route[i - 1][1], route[i][0], route[i][1]) * 50;
    //             //                                 timestamps.push(dist + timestamps[i - 1])
    //             //                             }
    //             //                         }
    //             //                         var geojson = {
    //             //                             'vendor': 1,
    //             //                             'path': route,
    //             //                             'timestamps': timestamps,
    //             //
    //             //                         };
    //             //                         console.log(geojson)
    //             //                         Routes.push(geojson)
    //             //                         saveJson[tmp[0]+','+tmp[1]] = geojson
    //             //                     },
    //             //                     error:function(){
    //             //                         console.log('err')
    //             //                     }
    //             //                 }));
    //             //
    //             //            // }
    //             //             }
    //             //         }
    //             //     })
    //             //     // url.forEach(function(value) {
    //             //     //     console.log('url:',value)
    //             //     //     gets.push($.ajax({
    //             //     //         type: 'GET',
    //             //     //         url: value,
    //             //     //         success: function(data) {
    //             //     //             console.log('data:',data)
    //             //     //             //var json = JSON.parse(data);
    //             //     //             var plan = data.routes[0];
    //             //     //             var route = plan.geometry.coordinates;
    //             //     //             var timestamps=[0];//先设置每条路径1000stamp
    //             //     //             for(var i=0;i<route.length;i++){
    //             //     //                 if(i!==0){
    //             //     //                     var dist=getDistance(route[i-1][0],route[i-1][1],route[i][0],route[i][1])*50;
    //             //     //                     timestamps.push(dist+timestamps[i-1])
    //             //     //                 }
    //             //     //             }
    //             //     //             var geojson = {
    //             //     //                 'vendor':1,
    //             //     //                 'path': route,
    //             //     //                 'timestamps':timestamps,
    //             //     //
    //             //     //             };
    //             //     //             console.log(geojson)
    //             //     //             Routes.push(geojson)
    //             //     //
    //             //     //
    //             //     //         }
    //             //     //     }));
    //             //     // });
    //             //
    //             //     $.when.apply($, gets).then(function() {
    //             //         console.log(saveJson)
    //             //         var jsonData=JSON.stringify(saveJson)
    //             //         download(jsonData,'route.json','text/plain')
    //             //         console.log('Routes:',Routes)
    //             //         resolve(Routes);
    //             //         // resolve([
    //             //         //     {
    //             //         //         "vendor": 1,
    //             //         //         "path": [
    //             //         //             [120.167057,30.185901],
    //             //         //             [120.165752,30.185723],
    //             //         //             [120.16581,30.188491],
    //             //         //             [120.190417,30.198224],
    //             //         //             [120.191971	,30.204],
    //             //         //             [120.189622	,30.20767],
    //             //         //             [120.182369	,30.218973],
    //             //         //             [120.180889	,30.222601],
    //             //         //             [120.200108	,30.306856],
    //             //         //             [120.23477	,30.311914],
    //             //         //             [120.246959	,30.316748],
    //             //         //             [120.309708	,30.387518],
    //             //         //             [120.312426	,30.39154],
    //             //         //             [120.309069	,30.400897],
    //             //         //             [120.302548	,30.399632],],
    //             //         //
    //             //         //             "timestamps": [ 838, 867.979, 947.036, 962.913, 996.971, 1032.865, 1060.03, 1077.834, 1205.212, 1210.243, 1295.677, 1315.668, 1431.726, 1480.25, 1488.658]
    //             //         //     }])
    //             //     });
    //             // })
    //
    //             d3.json('http://localhost:5000/data/0:00:00').then(function(data){
    //                 var count=0;
    //                 d3.json('./10.json').then(function (map) {
    //                     // console.log('map:',map)
    //                     data.forEach(d=>{
    //                         var tmp=d.split(',');
    //                         if(tmp[0]!=-1 && tmp[1]!=-1) {
    //                             if(parseInt(tmp[2])>=5){
    //                                 count++;
    //                                 var key=tmp[0]+','+tmp[1];
    //                                 console.log(map[key]);
    //                                 Routes.push(map[key]);
    //                             }
    //                             // if(tmp[0]>40&&tmp[0]<=60&&tmp[1]>40&&tmp[1]<=60){
    //                             //   if (tmp[2] !== '0') {
    //                             // var urlNow = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + depCenter[tmp[0]][0].toFixed(6) + ',' + depCenter[tmp[0]][1].toFixed(6) + ';' + desCenter[tmp[1]][0].toFixed(6) + ',' + desCenter[tmp[1]][1].toFixed(6) + '?steps=true&geometries=geojson&access_token=' + MAPBOX_TOKEN;
    //                             // gets.push($.ajax({
    //                             //     type: 'GET',
    //                             //     url: urlNow,
    //                             //     success: function (r) {
    //                             //         console.log('r:', r)
    //                             //         //var json = JSON.parse(data);
    //                             //         var plan = r.routes[0];
    //                             //         var route = plan.geometry.coordinates;
    //                             //         var timestamps = [0];//先设置每条路径1000stamp
    //                             //         for (var i = 0; i < route.length; i++) {
    //                             //             if (i !== 0) {
    //                             //                 var dist = getDistance(route[i - 1][0], route[i - 1][1], route[i][0], route[i][1]) * 50;
    //                             //                 timestamps.push(dist + timestamps[i - 1])
    //                             //             }
    //                             //         }
    //                             //         var geojson = {
    //                             //             'vendor': 1,
    //                             //             'path': route,
    //                             //             'timestamps': timestamps,
    //                             //
    //                             //         };
    //                             //         console.log(geojson)
    //                             //         Routes.push(geojson)
    //                             //         saveJson[tmp[0]+','+tmp[1]] = geojson
    //                             //     },
    //                             //     error:function(){
    //                             //         console.log('err')
    //                             //     }
    //                             // }));
    //
    //                             // }
    //                             // }
    //                         }
    //                     })
    //                     console.log('count:',count)
    //                     this.layers[1].setData(Routes)
    //                     // resolve(Routes);
    //                     // console.log(Routes)
    //                 })
    //
    //                 // url.forEach(function(value) {
    //                 //     console.log('url:',value)
    //                 //     gets.push($.ajax({
    //                 //         type: 'GET',
    //                 //         url: value,
    //                 //         success: function(data) {
    //                 //             console.log('data:',data)
    //                 //             //var json = JSON.parse(data);
    //                 //             var plan = data.routes[0];
    //                 //             var route = plan.geometry.coordinates;
    //                 //             var timestamps=[0];//先设置每条路径1000stamp
    //                 //             for(var i=0;i<route.length;i++){
    //                 //                 if(i!==0){
    //                 //                     var dist=getDistance(route[i-1][0],route[i-1][1],route[i][0],route[i][1])*50;
    //                 //                     timestamps.push(dist+timestamps[i-1])
    //                 //                 }
    //                 //             }
    //                 //             var geojson = {
    //                 //                 'vendor':1,
    //                 //                 'path': route,
    //                 //                 'timestamps':timestamps,
    //                 //
    //                 //             };
    //                 //             console.log(geojson)
    //                 //             Routes.push(geojson)
    //                 //
    //                 //
    //                 //         }
    //                 //     }));
    //                 // });
    //
    //                 // $.when.apply($, gets).then(function() {
    //                 //     console.log(saveJson)
    //                 //     var jsonData=JSON.stringify(saveJson)
    //                 //     download(jsonData,'route.json','text/plain')
    //                 //     console.log('Routes:',Routes)
    //                 //     resolve(Routes);
    //                 //     // resolve([
    //                 //     //     {
    //                 //     //         "vendor": 1,
    //                 //     //         "path": [
    //                 //     //             [120.167057,30.185901],
    //                 //     //             [120.165752,30.185723],
    //                 //     //             [120.16581,30.188491],
    //                 //     //             [120.190417,30.198224],
    //                 //     //             [120.191971	,30.204],
    //                 //     //             [120.189622	,30.20767],
    //                 //     //             [120.182369	,30.218973],
    //                 //     //             [120.180889	,30.222601],
    //                 //     //             [120.200108	,30.306856],
    //                 //     //             [120.23477	,30.311914],
    //                 //     //             [120.246959	,30.316748],
    //                 //     //             [120.309708	,30.387518],
    //                 //     //             [120.312426	,30.39154],
    //                 //     //             [120.309069	,30.400897],
    //                 //     //             [120.302548	,30.399632],],
    //                 //     //
    //                 //     //             "timestamps": [ 838, 867.979, 947.036, 962.913, 996.971, 1032.865, 1060.03, 1077.834, 1205.212, 1210.243, 1295.677, 1315.668, 1431.726, 1480.25, 1488.658]
    //                 //     //     }])
    //                 // });
    //             })
    //         });
    //     });
    // }



//routeTip
//     _renderTooltip() {
//         const {hoveredObject, pointerX, pointerY} = this.state || {};
//         return hoveredObject && (
//             <div className="tooltip" style={{color:'#ffffff',position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY}}>
//                 <div>
//                     <b>O-D: </b>
//                     <span>{hoveredObject.od}</span>
//                 </div>
//                 <div>
//                     <b>Traffic: </b>
//                     <span>{hoveredObject.traffic}</span>
//                 </div>
//
//             </div>
//
//         );
//     }

//areaTipDep
    _renderTooltipDep() {
        const { depObject,  depX,  depY} = this.state || {};
        return depObject && (
            <div className="tooltip" style={{color:'#00ffff',position: 'absolute', zIndex: 1, pointerEvents: 'none', left: depX, top: depY}}>
                <div>
                    <b>区域 id: </b>
                    <span>{depObject.number}</span>
                </div>

                <div>
                    <b>驶出流量: </b>
                    <span>{depObject.out}</span>
                </div>

            </div>

        );
    }
    //areaTipDes
    _renderTooltipDes() {
        const { desObject, desX, desY} = this.state || {};
        return desObject && (
            <div className="tooltip" style={{color:'#00ffff',position: 'absolute', zIndex: 1, pointerEvents: 'none', left: desX, top: desY}}>
                <div>
                    <b>区域: </b>
                    <span>{desObject.number}</span>
                </div>

                <div>
                    <b>驶入流量: </b>
                    <span>{desObject.in}</span>
                </div>

            </div>

        );
    }

    _getPredictData(){
        if(this.state.showPredict){
            return this.state.real?this.state.real_org:this.state.pre_org
        }
        else return [{
            centroid: [0,0],
            value:[0,0]
        }]
    }

    _renderLayers() {
        const {
            // buildings = DATA_URL.BUILDINGS,
            trailLength = 120,
            theme = DEFAULT_THEME,
            // TripsLayer=new TripsLayer({
            //     id: 'trips',
            //     //data: trips,
            //     // data:[
            //     //     {
            //     //         "vendor": 1,
            //     //         "path": [
            //     //             [120.167057,30.185901],
            //     //             [120.165752,30.185723],
            //     //             [120.16581,30.188491],
            //     //             [120.190417,30.198224],
            //     //             [120.191971	,30.204],
            //     //             [120.189622	,30.20767],
            //     //             [120.182369	,30.218973],
            //     //             [120.180889	,30.222601],
            //     //             [120.200108	,30.306856],
            //     //             [120.23477	,30.311914],
            //     //             [120.246959	,30.316748],
            //     //             [120.309708	,30.387518],
            //     //             [120.312426	,30.39154],
            //     //             [120.309069	,30.400897],
            //     //             [120.302548	,30.399632],],
            //     //
            //     //             "timestamps": [ 838, 867.979, 947.036, 962.913, 996.971, 1032.865, 1060.03, 1077.834, 1205.212, 1210.243, 1295.677, 1315.668, 1431.726, 1480.25, 1488.658]
            //     //     }],
            //     data:Routes,
            //     getPath: d => d.path,
            //     getTimestamps: d => d.timestamps,
            //     getColor: d => (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
            //     opacity: 0.3,
            //     widthMinPixels: 2,
            //     rounded: true,
            //     trailLength,
            //     currentTime: this.state.time,
            //
            //     shadowEnabled: false
            // }),
        } = this.props;

        return [
         new ScatterplotLayer({
            id: 'scatterplot-layer',
            data:this.state.blockIcon,
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusScale: 6,
            radiusMinPixels: 1,
            radiusMaxPixels: 100,
            lineWidthMinPixels: 1,
            getPosition: d => d.coordinates,
            getRadius: d => 20,
            getFillColor: d => [255, 140, 0],
            getLineColor: d => [0, 0, 0],
            visible:this.state.block
        }),

            // new IconLayer({
            //     id:'blockIcon',
            //     data:this.state.blockIcon,
            //     iconAtlas:'./warning.png',
            //     iconMapping:ICON_MAPPING,
            //     getIcon: d => 'marker',
            //     sizeScale: 15,
            //     getPosition: d => d.coordinates,
            //     getColor:[255,255,0],
            //     getSize: d => 5,
            //
            // }),
            new TripsLayer({
                id:'blockRoute',
                data:this.state.blockRoute,
                getPath:d=>d.path,
                getTimestamps: d => d.timestamps,
                // getColor: d => colorTable[d.color],
                getColor:[0,140,255,255],
                opacity: 0.3,
                widthMinPixels: 5,
                rounded: true,
                trailLength:1200,
                currentTime: this.state.time,
                shadowEnabled: false,
                pickable:true,
                visible:this.state.block
            }),

            new TripsLayer({
                id: 'trips',
                //data: trips,
                // data:[
                //     {
                //         "vendor": 1,
                //         "path": [
                //             [120.167057,30.185901],
                //             [120.165752,30.185723],
                //             [120.16581,30.188491],
                //             [120.190417,30.198224],
                //             [120.191971	,30.204],
                //             [120.189622	,30.20767],
                //             [120.182369	,30.218973],
                //             [120.180889	,30.222601],
                //             [120.200108	,30.306856],
                //             [120.23477	,30.311914],
                //             [120.246959	,30.316748],
                //             [120.309708	,30.387518],
                //             [120.312426	,30.39154],
                //             [120.309069	,30.400897],
                //             [120.302548	,30.399632],],
                //
                //             "timestamps": [ 838, 867.979, 947.036, 962.913, 996.971, 1032.865, 1060.03, 1077.834, 1205.212, 1210.243, 1295.677, 1315.668, 1431.726, 1480.25, 1488.658]
                //     }],
                // data:getRoute,
                data:this.state.Route,
                // updateTriggers:{
                //   data:Routes
                // },
                getPath: d => d.path,
                getTimestamps: d => d.timestamps,
                getColor: d => colorTable[d.color],
                // getColor:[0,255,255,255],
                opacity: 0.3,
                widthMinPixels: 10,
                rounded: true,
                trailLength,
                currentTime: this.state.time,
                shadowEnabled: false,
                pickable:true,
                visible:this.state.showRoute
                // onHover: info=>this.setState({
                //     hoveredObject: info.object,
                //     pointerX: info.x,
                //     pointerY: info.y
                // })
                // onHover:info=>{
                //     console.log(info)
                // }
            }),

            new PolygonLayer({
                id: 'dep_polygon',
                data:this.state.depPolygon,
                pickable: true,
                stroked: true,
                filled: true,
                wireframe: true,
                lineWidthMinPixels: 1,
                getPolygon: d => d.contour,
                // getElevation: d => d.population / d.area / 10,
                getFillColor: d => [255, 255, 0,50],
                getLineColor: [80, 80, 80],
                getLineWidth: 1,
                onHover: info=>this.setState({
                    depObject: info.object,
                    depX: info.x,
                    depY: info.y
                }),
                visible:this.state.depV
                // onHover: info=>{
                //     console.log(info)
                // }

            }),

            new PolygonLayer({
                id:'des_polygon',
                data:this.state.desPolygon,
                pickable: true,
                stroked: true,
                filled: true,
                wireframe: true,
                lineWidthMinPixels: 1,
                getPolygon: d => d.contour,
                // getElevation: d => d.population / d.area / 10,
                getFillColor: d => [255, 0, 0,50],
                getLineColor: [80, 80, 80],
                getLineWidth: 1,
                onHover: info=>this.setState({
                    desObject: info.object,
                    desX: info.x,
                    desY: info.y
                }),
                visible:this.state.desV
            }),

            new ColumnLayer({
                id: 'predict-origin-layer',
                data: this._getPredictData(),
                diskResolution: 12,
                radius: 100,
                extruded: true,
                pickable: true,
                elevationScale: 5000,
                getPosition: d => d.centroid,
                getFillColor: d => {
                    let k = (Math.log(d.value) / Math.log(4)).toFixed(0);
                    if (k <= 5) {
                        return colorRange[k]
                    } else {
                        return colorRange[5]
                    }
                },
                getLineColor: [0, 0, 0],
                getElevation: d =>parseInt(d.value)/100,
                transitions: {
                    getElevation: {
                        duration: 3000,
                        // type: 'spring',
                        // stiffness: 0.01,
                        // damping: 0.15,
                        // easing: d3.easeCubicInOut,
                        enter: d => {
                            // console.log(d);
                            let tmp = [];
                            for (let i = 0; i < 300; i++) {
                                tmp.push(d[0] * i / 300)
                            }
                            // console.log(tmp)
                            return tmp;
                        },
                    }
                },
                updateTriggers: {
                    getElevation: [this.state.pre_org,this.state.real_org],
                }
            }),
            // new PolygonLayer({
            //     id: 'buildings',
            //     data: buildings,
            //     extruded: true,
            //     wireframe: false,
            //     opacity: 0.5,
            //     getPolygon: f => f.polygon,
            //     getElevation: f => f.height,
            //     getFillColor: theme.buildingColor,
            //     material: theme.material
            // })
        ];
    }
    _formatLabel(t) {
        return `${Math.floor(t/3600)}:${Math.floor((t%3600)/60)}:${Math.floor((t%3600)%60)}`;
    }

    render() {
        const {
            viewState,
            mapStyle = 'mapbox://styles/mapbox/dark-v9',
            theme = DEFAULT_THEME,
        } = this.props;

        return (
            <Fragment>
                <DeckGL
                    layers={this._renderLayers()}
                    effects={theme.effects}
                    initialViewState={INITIAL_VIEW_STATE}
                    viewState={viewState}
                    controller={true}
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                </DeckGL>

                { this._renderTooltipDep() }
                {this._renderTooltipDes()}

                <StyletronProvider value={engine}>
                    <BaseProvider theme={LightTheme}>
                        <SliderTraffic

                            min={0}
                            max={86400}
                            value={[0,this.state.time]}
                            formatLabel={this._formatLabel}
                            onChange={({value}) => {
                                let nowTime=value[1];

                                if(blockData.has(nowTime)){
                                    console.log('icon')
                                    tmpIcon.push({
                                        coordinates:blockData.get(nowTime)
                                    })
                                    let tmp=[];
                                    tmpIcon.forEach(d=>{
                                        tmp.push(d)
                                    })
                                    // if(tmpIcon.length>10){
                                        console.log('set')
                                        this.setState({
                                            blockIcon:tmp
                                        })
                                    // }


                                    console.log(this.state.blockIcon)
                                }

                                // console.log('nowTime:',nowTime);
                                if(Math.floor(nowTime/3600)!==this.state.hour){
                                    this.setState({hour:Math.floor(nowTime/3600)})
                                    console.log('nowztime:',nowTime);
                                    var hour=(nowTime/3600).toFixed(0);
                                    console.log('hour:',hour);
                                    this.setState({
                                        pre_org:setPredictData(hour),
                                        real_org:setRealData(hour)
                                    });
                                    // console.log('pre_org',this.state.pre_org);

                                    var p=getRoute(hour);
                                    p.then(function() {
                                        console.log('Route',Routes)
                                        this.setState({
                                            Route:Routes,
                                            depPolygon:depPolygon,
                                            desPolygon:desPolygon
                                        })
                                    }.bind(this))
                                }
                                this.setState({time: nowTime})
                                // console.log('time',this.state.time)
                                //console.log(this.state)
                                //console.log('value:',value)
                            }}
                        />
                {/*     <SelectContainer>*/}
                {/*        <Select id={'area'}*/}
                {/*        options={[*/}
                {/*            {label:"出发区域",id:'dep_polygon'},*/}
                {/*            {label:"到达区域",id:'des_polygon'},*/}
                {/*            { label: "隐藏", id: "" },*/}

                {/*        ]}*/}
                {/*        value={this.state.area}*/}
                {/*        placeholder="显示区域"*/}
                {/*        // onChange={params => setValue(params.value)}*/}
                {/*        size={SIZE.mini}*/}
                {/*        onChange={params=> {*/}
                {/*            // console.log('params:',params);*/}
                {/*            if(params.option!=null){*/}


                {/*                if(params.option.id=='dep_polygon'){*/}
                {/*                    console.log()*/}
                {/*                    this.setState({*/}
                {/*                        depPolygon:depPolygon,*/}
                {/*                        depV:true,*/}
                {/*                        desV:false,*/}
                {/*                        area:[{label:"出发区域",id:'dep_polygon'}]*/}
                {/*                    })*/}
                {/*                }*/}
                {/*                else if(params.option.id=='des_polygon'){*/}
                {/*                    console.log('desPolygon',this.state.desPolygon)*/}
                {/*                    this.setState({*/}
                {/*                        desPolygon:desPolygon,*/}
                {/*                        desV:true,*/}
                {/*                        depV:false,*/}
                {/*                        area:[{label:"到达区域",id:'des_polygon'}]*/}
                {/*                    })*/}
                {/*                }*/}
                {/*                else{*/}
                {/*                    this.setState({*/}
                {/*                        desV:false,*/}
                {/*                        depV:false,*/}
                {/*                        area:[{ label: "隐藏", id: "" }]*/}
                {/*                    })*/}
                {/*                }*/}
                {/*            }*/}
                {/*            else{*/}
                {/*                this.setState({*/}
                {/*                    area:[],*/}
                {/*                    desV:false,*/}
                {/*                    depV:false,*/}
                {/*                })*/}
                {/*            }*/}

                {/*        }}*/}
                {/*    />*/}

                {/*</SelectContainer>*/}
                {/*        <SelectContainer2>*/}
                {/*            <Select id={'option'}*/}
                {/*                    options={[*/}
                {/*                        {label:"显示轨迹",id:'route'},*/}
                {/*                        {label:'预测流量',id:"predict"},*/}
                {/*                        {label:"实际流量",id:'real'},*/}
                {/*                        {label:'路障检测',id:'block'}*/}
                {/*                    ]}*/}
                {/*                    value={this.state.options}*/}
                {/*                    placeholder={'选择服务'}*/}
                {/*                    size={SIZE.mini}*/}
                {/*                    onChange={ params=>{*/}
                {/*                        if (params.option!==null){*/}
                {/*                            if(params.option.id==='predict'){*/}
                {/*                                this.setState({*/}
                {/*                                    real:false,*/}
                {/*                                    options:[{label:"预测流量",id:"predict"}],*/}
                {/*                                    showPredict:true*/}
                {/*                                })*/}
                {/*                            }*/}
                {/*                            else if(params.option.id==='real'){*/}
                {/*                                this.setState({*/}
                {/*                                    real:true,*/}
                {/*                                    options:[{label:"实际流量",id:"real"}],*/}
                {/*                                    showPredict:true*/}
                {/*                                })*/}
                {/*                            }*/}
                {/*                            else if(params.option.id==='block'){*/}
                {/*                                this.setState({*/}
                {/*                                    block:true,*/}
                {/*                                    options:[{label:"路障检测",id:"block"}],*/}
                {/*                                    time:45466,*/}
                {/*                                    showPredict:false,*/}
                {/*                                    showRoute:false*/}
                {/*                                })*/}

                {/*                            }*/}
                {/*                            else if(params.option.id==='route'){*/}
                {/*                                this.setState({*/}
                {/*                                    block:false,*/}
                {/*                                    options:[{label:"显示轨迹",id:"route"}],*/}
                {/*                                    showRoute:true,*/}

                {/*                                })*/}
                {/*                            }*/}
                {/*                        }*/}
                {/*                    }}*/}
                {/*            />*/}
                {/*        </SelectContainer2>*/}
                    </BaseProvider>
                </StyletronProvider>


            </Fragment>
        );
    }
}




/* {(<SliderInput
                     value={[0,this.state.time]}
                    min={0}
                    max={24 * 60}
                    formatLabel={this._formatLabel}
                    onChange={({value}) => {
                        if (value % 3600 === 0) {
                            var p = getRoute(value / 3600);
                            p.then(function () {
                                this.setState({
                                    Routes: Routes
                                })
                            }.bind(this))
                        }
                        this.setState({time: value});
                        console.log(value)
                    }}
                />)
                }*/


// export function renderToDOM(container) {
//     render(<App />, container);
// }







//ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<CustomTicks />,document.getElementById('app'))

// require('d3-request').csv(DATA_URL, (error, response) => {
//         if (!error) {
//             const data = response.map(row => ({
//                 timestamp: new Date(`${row.DateTime} UTC`).getTime(),
//                 latitude: Number(row.Latitude),
//                 longitude: Number(row.Longitude),
//                 depth: Number(row.Depth),
//                 magnitude: Number(row.Magnitude)
//             }));
//             ReactDOM.render(<App2 data={data} />, document.getElementById('root'));
//         }
//     });
