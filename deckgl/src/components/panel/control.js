import React ,{Component} from 'react';
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

// let keys=[];
let ip={}
let content={}
//读取ip地址
function readipData(){

    return new Promise(resolve => {
        d3.csv('https://raw.githubusercontent.com/HOOLoLo/ITS/master/deckgl/public/panel.csv').then(d=>{
            d.map(x=>{
                ip[x['no']]=x['ip']
            })
            let name=Object.keys(ip);
            console.log(name)
            resolve(name)
            // console.log(ip)
        })
    })

}

function setK() {
    return new Promise(resolve => {
        d3.csv('https://raw.githubusercontent.com/HOOLoLo/webserver/master/content.csv').then(d=>{
            d.map(x=>{
                content[x['name']]=x['path']
            })
            console.log(content)
            let k=Object.keys(content);
            console.log('k',k)
            resolve(k)
        })
    })
}

// setK().then()


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));









// export class Panel extends Component{
//
//     constructor(props){
//         super(props)
//         keys=setK()
//
// }
//
// render() {
//
// }
//
//
// }
let p=setK();
let p2=readipData()
export function Panel() {
    const [value, setValue] = React.useState('MIC');
    const [ipValue,setIP]=React.useState('1号机(MIC)');

    const[keys,setKeys]=React.useState(['wait']);
    const[ipName,setName]=React.useState(['wait']);

    p.then((result)=>{
        setKeys(result)
    });

    p2.then((result)=>{
        setName(result)
    })


    // setKeys(setK());


    const classes = useStyles();
    function handleChange(event) {
        console.log()
        setValue(event.target.value);
    }

    function handleIPChoese(event) {
        setIP(event.target.value);
    }


    function send(event) {

        console.log(event.currentTarget)

        const http=new XMLHttpRequest();

        const url=ip[event.currentTarget.value]+'/url/'+value;
        console.log(url)
        http.open('GET',url)
        http.send()
    }

    function sendVolume(event){
        const http=new XMLHttpRequest();
        console.log(event.currentTarget.value)
        const url=ip[ipValue]+'/volume/'+event.currentTarget.value;
        http.open('GET',url)
        http.send()
    }
    function sendScroll(event) {
        const http=new XMLHttpRequest();
        console.log(event.currentTarget.value)
        const url=ip[ipValue]+'/scroll/'+event.currentTarget.value;
        http.open('GET',url)
        http.send()

    }
    function sendOpenChrome(event) {
        const http=new XMLHttpRequest();
        const url=ip[ipValue]+'/openChrome';
        http.open('GET',url);
        http.send()
    }

    function shutdown() {
        let message=window.confirm('确定关闭'+ipValue+'吗？')
        if (message===true){
            const http=new XMLHttpRequest();
            const url=ip[ipValue]+'/shutdown';
            http.open('GET',url);
            http.send()
        }
        else return
    }

    function openAllChrome(){
        for(let prop in ip){
            if(ip[prop]){
                console.log(ip[prop])
                const http=new XMLHttpRequest();
                const url=ip[prop]+'/openChrome';
                http.open('GET',url);
                http.send()
            }
        }
    }

    // if(!keys){
    //     console.log('keys')
    //     return <div>wait</div>
    // }

    // function startBackMusic() {
    //     const http=new XMLHttpRequest();
    //     const url=ip[ipValue]+'/openMusic';
    //     http.open('GET',url);
    //     http.send()
    // }
    // function stopBackMusic() {
    //     const http=new XMLHttpRequest();
    //     const url=ip[ipValue]+'/stopMusic';
    //     http.open('GET',url);
    //     http.send()
    // }

    return (
            <FormControl component="fieldset">
                <FormLabel component="legend">Content</FormLabel>

                <div className={classes.root}>
                    <Button variant="contained" color="primary"  onClick={openAllChrome} >
                        打开所有浏览器
                    </Button>
                </div>

                <RadioGroup aria-label="content" name="content" value={value} onChange={handleChange}>
                    {/*{*/}
                    {/*    ()=>{*/}
                    {/*        if(keys!==[]){*/}
                    {/*            console.log(keys);*/}
                    {/*   */}
                    {/*        }*/}
                    {/*    }*/}
                    {/*}*/}
                    {
                        keys.map((value,index)=>{
                            console.log('d',value);
                            return(
                                <FormControlLabel key={index} value={value} control={<Radio />} label={value}  />
                            )
                        })
                    }


                    {/*<FormControlLabel value={keys[0]} control={<Radio />} label={d}  />*/}
                    {/*<FormControlLabel value={d} control={<Radio />} label={d}  />*/}
                    {/*<FormControlLabel value={d} control={<Radio />} label={d}  />*/}
                    {/*<FormControlLabel value={d} control={<Radio />} label={d}  />*/}
                    {/*<FormControlLabel value={d} control={<Radio />} label={d}  />*/}
                </RadioGroup>
                <div className={classes.root}>
                    {
                        ipName.map(((value, index) => {
                            return(
                                <Button key={index} variant="contained" color="primary" value={value} onClick={send} >
                                    {value}
                                </Button>
                            )
                        }))
                    }
                    {/*<Button variant="contained" color="primary" value={1} onClick={send} >*/}
                    {/*    1号机(MIC)*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" value={2} onClick={send}>*/}
                    {/*    2号机(ML)*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" value={3} onClick={send}>*/}
                    {/*    3号机(DTW)*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" value={4} onClick={send}>*/}
                    {/*    4号机(news)*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" value={5} onClick={send}>*/}
                    {/*    5号机(conclusion)*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" value={6} onClick={send}>*/}
                    {/*    6号机(融合)*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" value={7} onClick={send}>*/}
                    {/*    7号机(玻璃)*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" value={8} onClick={send}>*/}
                    {/*    8号机(窗户)*/}
                    {/*</Button>*/}
                </div>
                <RadioGroup aria-label="ipLabel" name="ipLabel" value={ipValue} onChange={handleIPChoese}>
                {
                    ipName.map((value,index)=>{
                        console.log('d',value);
                        return(
                            <FormControlLabel key={index} value={value} control={<Radio />} label={value}  />
                        )
                    })
                }
                </RadioGroup>
                <div className={classes.root}>
                    <Button variant="contained" color="secondary"  value={'up'} onClick={sendVolume}> 增大音量</Button>
                    <Button variant="contained" color="secondary"  value={'down'} onClick={sendVolume} > 减小音量</Button>
                </div>
                <div className={classes.root}>
                    <Button variant="contained" color="secondary"  value={'front'} onClick={sendScroll}> 向前滑动</Button>
                    <Button variant="contained" color="secondary"  value={'back'} onClick={sendScroll} > 向后滑动</Button>
                </div>
                <div className={classes.root}>
                    <Button variant="contained" color="secondary" onClick={sendOpenChrome}> 打开浏览器</Button>
                    <Button variant="contained" color="secondary"  onClick={shutdown}> 关机</Button>
                </div>


            </FormControl>

        );



}

