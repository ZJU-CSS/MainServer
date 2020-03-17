import React, {Component, Fragment} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
// import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { Select,SIZE } from "baseui/select";
import{ColumnLayer} from "@deck.gl/layers";

import * as d3 from 'd3'
import {Provider as StyletronProvider} from "styletron-react";
import {BaseProvider, LightTheme, styled} from "baseui";
import SliderTraffic from "./sliderTraffic";

import {Client as Styletron} from 'styletron-engine-atomic';
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
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemhpZ3VhbmdkYSIsImEiOiJjanozdXg0b3EwMHh4M21tcXk2MHlpN3B1In0.lInf8zFl2BsP_bDjMFhf3w'; // eslint-disable-line

// Source data CSV

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});

const pointLight1 = new PointLight({
    color: [255, 255, 255],
    intensity: 1.0,
    position: [0, 0, 80000]
});

const pointLight2 = new PointLight({
    color: [255, 255, 255],
    intensity: 1.0,
    position: [180, 0, 80000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

let qualityMap=new Map()

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// let maxpm10=0;
function getData(){
    return new Promise(resolve => {
        d3.json("./air.json").then(data=>{
            console.log(data)
            data.results.forEach(d=>{
                // console.log('d',d);
                if(d.coordinates){
                    d.measurements.forEach(l=>{
                        // if(l.value>maxpm10){
                        //     maxpm10=l.value;
                        // }
                        // console.log(l)
                        if(qualityMap.has(l.parameter)){
                            qualityMap.get(l.parameter).push(
                                {centroid: [d.coordinates.longitude,d.coordinates.latitude], value: l.value},
                            )
                        }
                        else{
                            qualityMap.set(l.parameter,[{centroid: [d.coordinates.longitude,d.coordinates.latitude], value: l.value}])
                        }
                    })
                }
            })
            // console.log('maxpm',maxpm10)
            // qualityMap.get('pm10').forEach(d=>{
            //     d.value=(d.value/maxpm10)*1000;
            // })
            resolve('0');
        })
    })
}


// let p=getData()
// p.then(results=>{
//     console.log('qulity',qualityMap)
// })


const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51]
};

const INITIAL_VIEW_STATE = {
    longitude:  120.207057,
    latitude: 30.225901,
    // longitude:-74.00823,
    // latitude: 40.71351,
    zoom: 3,
    pitch: 45,
    bearing: 0

};

const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];


/* eslint-disable react/no-deprecated */
export default class AirQuality extends Component {
    static get defaultColorRange() {
        return colorRange;
    }

    constructor(props) {
        super(props);
        this.state = {
            data:[]
        };

    }

    componentDidMount() {
        let p=getData();
        p.then(results=>{
            this.setState({
                data:[]
            });
            console.log('qualityMap:',qualityMap)
        })
        // this._animate();
    }

    _renderLayers() {


        return [
        //     new HexagonLayer({
        //         id: 'heatmap',
        //         colorRange,
        //         coverage,
        //         data,
        //         elevationRange: [0, 3000],
        //         elevationScale: data && data.length ? 50 : 0,
        //         extruded: true,
        //         getPosition: d => d,
        //         onHover: this.props.onHover,
        //         pickable: Boolean(this.props.onHover),
        //         radius,
        //         upperPercentile,
        //         material,
        //
        //         transitions: {
        //             elevationScale: 3000
        //         }
        //     })

            new ColumnLayer({

                    id: 'column-layer',
                    data:this.state.data,
                    diskResolution: 12,
                    radius: 5000,
                    extruded: true,
                    pickable: true,
                    elevationScale: 5000,
                    getPosition: d => d.centroid,
                    getFillColor: d => {
                        let k=(Math.log(d.value)/Math.log(4)).toFixed(0);
                        if(k<=5){
                            return colorRange[k]
                        }
                        else{
                            return colorRange[5]
                        }
                    },
                    getLineColor: [0, 0, 0],
                getElevation:d=>d.value,
                transitions:{
                    getElevation:{
                        duration: 3000,
                        // type: 'spring',
                        // stiffness: 0.01,
                        // damping: 0.15,
                        // easing: d3.easeCubicInOut,
                        enter: d => {
                            console.log(d);
                            let tmp=[];
                            for(let i=0;i<300;i++){
                                tmp.push(d[0]*i/300)
                            }
                            console.log(tmp)
                            return tmp;
                        },
                    }
                },

                updateTriggers:{
                    getElevation: [this.state.data],
                }

                // onHover: ({object, x, y}) => {
                //     const tooltip = `height: ${object.value * 5000}m`;
                //
                // }
            })
         ];

    }

    render() {
        const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;

        return (
            <Fragment>
                <DeckGL
                    layers={this._renderLayers()}
                     effects={[lightingEffect]}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                </DeckGL>
                <StyletronProvider value={engine}>
                    <BaseProvider theme={LightTheme}>
                        <SelectContainer>
                            <Select
                                options={[
                                    {label:"pm10",id:'pm10'},
                                    {label:"pm25",id:'pm25'},
                                    { label: "co", id: "co" },
                                    { label: "no2", id: "no2" },
                                    { label: "so2", id: "so2" },
                                    { label: "o3", id: "o3" },
                                    { label: "bc", id: "bc" },
                                ]}
                                value={this.state.label}
                                placeholder="选择污染类型"
                                // onChange={params => setValue(params.value)}
                                size={SIZE.mini}
                                clearable={true}
                                onChange={parems=> {

                                    this.setState({
                                        data:qualityMap.get(parems.option.id),
                                        label:{label:parems.option.label,id:parems.option.id}
                                    })

                                    // if(parems.option.id=='pm10'){
                                    //     this.setState({
                                    //         data:qualityMap.get()
                                    //         label:{label:"pm10",id:'pm10'}
                                    //     })
                                    // }
                                    // else if(parems.option.id=='pm25'){
                                    //     this.setState({
                                    //
                                    //         label:{label:"pm25",id:'pm25'}
                                    //     })
                                    // }
                                    // else{
                                    //     this.setState({
                                    //         desV:false,
                                    //         depV:false,
                                    //         area:{ label: "隐藏", id: "" }
                                    //     })
                                    // }
                                }}
                            />
                        </SelectContainer>
                    </BaseProvider>
                </StyletronProvider>
            </Fragment>



    );
    }
}
