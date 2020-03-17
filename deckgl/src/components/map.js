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
import {PolygonLayer} from '@deck.gl/layers';

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
    width:'20%',
    height:'10%'
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
    zoom: 11,
    pitch: 45,
    bearing: 0
};




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
// getArea();
function getRoute(time) {
    return new Promise(resolve => {
        // var gets = [];
        d3.json('http://localhost:5000/data/'+time+':00:00').then(function (data) {
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

// getRoute.then(function () {
//     console.log('get')
// });

export default class Map extends Component {

    constructor(props) {
        super(props);
         // const [value, setValue] = React.useState([0]);
        this.state = {
            time: 0,
            hour:-1,
            depV:false,
            desV:false,
            area:[],

        };
    }
    componentDidMount() {
        getArea();
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

    _animate() {
        const {
            loopLength = 3000, // unit corresponds to the timestamp in source data
            animationSpeed = 60 // unit time per second
        } = this.props;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;
        var lastTime=this.state.time;
        // console.log('last Time:',this.state.time);
        console.log('timeStamp:',timestamp)
        this.setState({
            time: ((timestamp % loopTime) / loopTime) * loopLength
        });
        //console.log(((timestamp % loopTime) / loopTime) * loopLength);
        //console.log('nowtime',this.state.time);
        var nowTime=this.state.time;

        if(lastTime>nowTime){
            this.setState({
                hour: (this.state.hour+1),
                timRange:[this.state.hour,this.state.hour+1]
            })
            console.log('hour:',this.state.hour);
            var p=getRoute(this.state.hour);
            p.then(function() {
                this.setState({
                    Route:Routes
                })
            }.bind(this))
            //   console.log(this.state.Route);
        }
        this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

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
            // This is only needed when using shadow effects
            // new PolygonLayer({
            //     id: 'ground',
            //     data: landCover,
            //     getPolygon: f => f,
            //     stroked: false,
            //     getFillColor: [0, 0, 0, 0]
            // }),
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
                widthMinPixels: 2,
                rounded: true,
                trailLength,
                currentTime: this.state.time,
                shadowEnabled: false,
                pickable:true,
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
            })

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
                                // console.log('nowTime:',nowTime);
                                if(Math.floor(nowTime/3600)!==this.state.hour){
                                    this.setState({hour:Math.floor(nowTime/3600)})
                                    console.log('nowztime:',nowTime);
                                    var hour=(nowTime/3600).toFixed(0);
                                    console.log('hour:',hour);
                                    var p=getRoute(hour);
                                    p.then(function() {
                                        this.setState({
                                            Route:Routes,
                                            depPolygon:depPolygon,
                                            desPolygon:desPolygon
                                        })
                                    }.bind(this))
                                }
                                this.setState({time: nowTime})
                                //console.log(this.state)
                                //console.log('value:',value)
                            }}
                        />
                     <SelectContainer>
                        <Select
                        options={[
                            {label:"出发区域",id:'dep_polygon'},
                            {label:"到达区域",id:'des_polygon'},
                            { label: "隐藏", id: "" },
                        ]}
                        value={this.state.area}
                        placeholder="显示区域"
                        // onChange={params => setValue(params.value)}
                        size={SIZE.mini}
                        onChange={params=> {
                            console.log('params:',params);
                            if(params.option!=null){
                                if(params.option.id=='dep_polygon'){
                                    console.log()
                                    this.setState({
                                        depPolygon:depPolygon,
                                        depV:true,
                                        desV:false,
                                        area:[{label:"出发区域",id:'dep_polygon'}]
                                    })
                                }
                                else if(params.option.id=='des_polygon'){
                                    console.log('desPolygon',this.state.desPolygon)
                                    this.setState({
                                        desPolygon:desPolygon,
                                        desV:true,
                                        depV:false,
                                        area:[{label:"到达区域",id:'des_polygon'}]
                                    })
                                }
                                else{
                                    this.setState({
                                        desV:false,
                                        depV:false,
                                        area:[{ label: "隐藏", id: "" }]
                                    })
                                }
                            }
                            else{
                                this.setState({
                                    area:[],
                                    desV:false,
                                    depV:false,
                                })
                            }

                        }}
                    />
                </SelectContainer>
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
