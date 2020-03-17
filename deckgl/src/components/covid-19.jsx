import React, {Component, Fragment} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {DataFilterExtension} from '@deck.gl/extensions';
import {MapView} from '@deck.gl/core';
import SliderCovid from './sliderCovid'
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import * as d3 from 'd3'


// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemhpZ3VhbmdkYSIsImEiOiJjanozdXg0b3EwMHh4M21tcXk2MHlpN3B1In0.lInf8zFl2BsP_bDjMFhf3w';


const MAP_VIEW = new MapView({
    // 1 is the distance between the camera and the ground
    farZMultiplier: 100
});


let days=39;

let flag=-1;

//read data

let dateMap=new Map();
function getData(){
    return new Promise(resolve => {
        d3.csv("./COVID19_open_line_list.csv").then(function (data) {
            data.forEach(d=>{
                let tmp=d.date_confirmation.split('.');
                let tmpstr=tmp[2]+'-'+tmp[1]+'-'+tmp[0];
                if(dateMap.has(tmpstr)){
                    dateMap.get(tmpstr).push([d.longitude,d.latitude])
                }
                else{
                    dateMap.set(tmpstr,[]);
                }
            })
            resolve('done');
        })
    })
}





const INITIAL_VIEW_STATE = {
    longitude:  120.207057,
    latitude: 30.225901,
    zoom: 3,
    pitch: 0,
    bearing: 0
};

const MS_PER_DAY = 8.64e7; // milliseconds in a day

const dataFilter = new DataFilterExtension({filterSize: 1});

export default class Covid extends Component {
    // constructor(props) {
    //     super(props);
    //
    //     const timeRange = this._getTimeRange(props.data);
    //
    //     this.state = {
    //         timeRange,
    //         filterValue: timeRange,
    //         hoveredObject: null
    //     };
    //     this._onHover = this._onHover.bind(this);
    //     this._renderTooltip = this._renderTooltip.bind(this);
    // }
    constructor(props) {
        super(props);
        // const [value, setValue] = React.useState([0]);
        this.state = {
            pointData:[],
            days:days,
            dayCount:0
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.data !== this.props.data) {
    //         const timeRange = this._getTimeRange(nextProps.data);
    //         this.setState({timeRange, filterValue: timeRange});
    //     }
    // }

    // _getTimeRange(data) {
    //     if (!data) {
    //         return null;
    //     }
    //     return data.reduce(
    //         (range, d) => {
    //             const t = d.timestamp / MS_PER_DAY;
    //             range[0] = Math.min(range[0], t);
    //             range[1] = Math.max(range[1], t);
    //             return range;
    //         },
    //         [Infinity, -Infinity]
    //     );
    // }

    // _onHover({x, y, object}) {
    //     this.setState({x, y, hoveredObject: object});
    // }
    _renderLayers() {

        return [
            // new ScatterplotLayer({
            //     id: 'covid',
            //     data:this.state.pointData,
            //     opacity: 0.8,
            //     radiusScale: 100,
            //     radiusMinPixels: 1,
            //     wrapLongitude: true,
            //
            //     getPosition: d =>d.coordinate,
            //     getRadius: 500,
            //     // getFillColor: d => {
            //     //     const r = Math.sqrt(Math.max(d.depth, 0));
            //     //     return [255 - r * 15, r * 5, r * 10];
            //     // },
            //
            //     getFillColor:[255,0,0,255],
            //
            //     // getFilterValue: d => d.timestamp / MS_PER_DAY, // in days
            //     // filterRange: [filterValue[0], filterValue[1]],
            //     // filterSoftRange: [
            //     //     filterValue[0] * 0.9 + filterValue[1] * 0.1,
            //     //     filterValue[0] * 0.1 + filterValue[1] * 0.9
            //     // ],
            //     // extensions: [dataFilter],
            //
            //     pickable: true,
            //     // onHover: this._onHover
            // }),
            new HeatmapLayer({
                id:'heatmap',
                data:this.state.pointData,
                getPosition:d=>d.coordinate,
                getWeight:10,
                radiusPixels:20

            })
        ];
    }

    // _renderTooltip() {
    //     const {x, y, hoveredObject} = this.state;
    //     return (
    //         hoveredObject && (
    //             <div className="tooltip" style={{top: y, left: x}}>
    //                 <div>
    //                     <b>Time: </b>
    //                     <span>{new Date(hoveredObject.timestamp).toUTCString()}</span>
    //                 </div>
    //                 <div>
    //                     <b>Magnitude: </b>
    //                     <span>{hoveredObject.magnitude}</span>
    //                 </div>
    //                 <div>
    //                     <b>Depth: </b>
    //                     <span>{hoveredObject.depth} km</span>
    //                 </div>
    //             </div>
    //         )
    //     );
    // }

    _formatLabel(t) {
        const date = new Date('2020-01-22');
        date.setDate(date.getDate()+t);
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
    }

    render() {
        const {mapStyle = 'mapbox://styles/mapbox/light-v9'} = this.props;
        // const {timeRange, filterValue} = this.state;

        return (
            <Fragment>
                <DeckGL
                    views={MAP_VIEW}
                    layers={this._renderLayers()}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />

                    {/*{this._renderTooltip}*/}
                </DeckGL>

                <SliderCovid
                    min={0}
                    max={this.state.days}
                    value={[0,this.state.dayCount]}
                    formatLabel={this._formatLabel}

                    onChange={({date,value}) => {
                        console.log('value:',value)

                        if(flag===-1){
                            let p=getData();
                            console.log(dateMap);
                            p.then(result=>{
                                let pointData=[];
                                if(dateMap.has(date)){
                                    dateMap.get(date).forEach(d=>{
                                        console.log(d)
                                        pointData.push({
                                            coordinate:[parseFloat(d[0]),parseFloat(d[1])]
                                        })
                                    })
                                    this.setState({
                                        pointData:pointData,
                                        dayCount:value[1]
                                    })
                                }

                                flag=0;

                            });

                        }
                        else{
                            let pointData=[];

                            if(dateMap.has(date)){
                                dateMap.get(date).forEach(d=>{
                                    pointData.push({
                                        coordinate:[parseFloat(d[0]),parseFloat(d[1])]
                                    })
                                });
                                this.setState({
                                    pointData:pointData,
                                    // dayCount:this.state.dayCount+1
                                });
                            }

                            this.setState({
                                dayCount:value[1]
                            })
                            console.log(this.state.pointData);
                        }




                        // let nowTime=value[1];
                        // // console.log('nowTime:',nowTime);
                        // if(Math.floor(nowTime/3600)!==this.state.hour){
                        //     this.setState({hour:Math.floor(nowTime/3600)})
                        //     console.log('nowztime:',nowTime);
                        //     var hour=(nowTime/3600).toFixed(0);
                        //     console.log('hour:',hour);
                        //     var p=getRoute(hour);
                        //     p.then(function() {
                        //         this.setState({
                        //             Route:Routes,
                        //             depPolygon:depPolygon,
                        //             desPolygon:desPolygon
                        //         })
                        //     }.bind(this))
                        // }
                        // this.setState({time: nowTime})
                        // //console.log(this.state)
                        // //console.log('value:',value)
                    }}
                />
            </Fragment>
        );
    }
}

// export function renderToDOM(container) {
//     render(<App />, container);
//     require('d3-request').csv(DATA_URL, (error, response) => {
//         if (!error) {
//             const data = response.map(row => ({
//                 timestamp: new Date(`${row.DateTime} UTC`).getTime(),
//                 latitude: Number(row.Latitude),
//                 longitude: Number(row.Longitude),
//                 depth: Number(row.Depth),
//                 magnitude: Number(row.Magnitude)
//             }));
//             render(<App data={data} />, container);
//         }
//     });
// }
