import React,{Fragment}from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route,  Switch,Link } from 'react-router-dom'


import Map from "./components/map";

import Covid from "./components/covid-19"

import AirQuality from "./components/airQuality";

import {getData} from "./components/bubble"



const map = document.getElementById("map");


// const map=document.getElementById("map");


function Getpage(){
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Map />
                </Route>
                <Route path="/covid">
                    <Covid />
                </Route>
                <Route path="/airquality">
                    <AirQuality />
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

// ReactDOM.render(
//     <Covid />,
//     map
//
// )

ReactDOM.render(
    <Getpage/>
    ,map
)
