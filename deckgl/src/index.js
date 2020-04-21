import React,{Fragment}from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route,  Switch,Link } from 'react-router-dom'

import {City} from './components/city/city'
import RouteMap from "./components/routeMap";
import Covid from "./components/covid-19"
import AirQuality from "./components/airQuality";
import {StreamG} from "./components/streamgraph/main";
import {BarG} from "./components/Barchart/main";

import {Panel} from "./components/panel/control";

import LineChart from "./components/lineChart/main";

const map = document.getElementById("map");
function Getpage(){
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <RouteMap />
                </Route>
                <Route path="/covid">
                    <Covid />
                </Route>
                <Route path="/airquality">
                    <AirQuality />
                </Route>
                <Route path="/city">
                    <City />
                </Route>
                <Route path="/stream">
                    <StreamG />
                </Route>
                <Route path="/bar">
                    <BarG />
                </Route>
                <Route path="/line">
                    <LineChart />
                </Route>
                <Route path="/control">
                    <Panel/>
                </Route>
            </Switch>
        </Router>
    )
}


// getData();

// ReactDOM.render(
//         <Map />,
//     map
// );

ReactDOM.render(
    <Getpage />,
    map

)

// ReactDOM.render(
//     <Getpage/>
//     ,map
// )
