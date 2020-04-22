import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { Select,SIZE } from "baseui/select";
import {BaseProvider, LightTheme, styled} from "baseui";
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import { makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3'
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";

let keys=[];
let ip={}
let content={}
function readData(){
    d3.csv('./panel.csv').then(d=>{
        d.map(x=>{
            ip[x['no']]=x['ip']
        })
        console.log(ip)
    })

}

function setK() {
    d3.csv('./content.csv').then(d=>{
        d.map(x=>{
            content[x['name']]=x['path']
        })
        console.log(content)

        keys=Object.keys(content)

    })
}
setK()

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));



readData()
export function Panel() {
    const [value, setValue] = React.useState('MIC');
    const classes = useStyles();
    function handleChange(event) {
        console.log()
        setValue(event.target.value);
    }

    function send(event) {

        console.log(event.currentTarget)

        const http=new XMLHttpRequest()

        const url=ip[event.currentTarget.value]+'/url/'+value;
        console.log(url)
        http.open('GET',url)
        http.send()

    }


    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Content</FormLabel>
            <RadioGroup aria-label="content" name="content" value={value} onChange={handleChange}>
                <FormControlLabel value={keys[0]} control={<Radio />} label={keys[0]}  />
                <FormControlLabel value={keys[1]}  control={<Radio />} label={keys[1]} />
                <FormControlLabel value={keys[2]} control={<Radio />} label={keys[2]}  />
                <FormControlLabel value={keys[3]} control={<Radio />} label={keys[3]} />
                <FormControlLabel value={keys[4]} control={<Radio />} label={keys[4]} />
            </RadioGroup>
            <div className={classes.root}>
            <Button variant="contained" color="primary" value={1} onClick={send} >
                1号机(MIC)
            </Button>
            <Button variant="contained" color="primary" value={2} onClick={send}>
                2号机(ML)
            </Button>
            <Button variant="contained" color="primary" value={3} onClick={send}>
                3号机(DTW)
            </Button>
            <Button variant="contained" color="primary" value={4} onClick={send}>
                4号机(news)
            </Button>
            <Button variant="contained" color="primary" value={5} onClick={send}>
                5号机(conclusion)
            </Button>
            <Button variant="contained" color="primary" value={6} onClick={send}>
                6号机(融合)
            </Button>
                <Button variant="contained" color="primary" value={7} onClick={send}>
                    7号机(玻璃)
                </Button>
                <Button variant="contained" color="primary" value={8} onClick={send}>
                    8号机(窗户)
                </Button>
            </div>
        </FormControl>

    );
}

