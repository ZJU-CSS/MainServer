/* global requestAnimationFrame, cancelAnimationFrame */
import React, {PureComponent} from 'react';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, styled} from 'baseui';
import {Slider} from 'baseui/slider';
import {Button, SHAPE, SIZE} from 'baseui/button';
import Start from 'baseui/icon/chevron-right';
import Stop from 'baseui/icon/delete';

const engine = new Styletron();


const ButtonContainer=styled('div',{
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    top: '10px',
    left:'10px'
});

const Container = styled('div', {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    bottom: '20px',
    width: '100%'
});

const ThumbValue = styled('div', {
    color: '#000000',
    position: 'absolute',
    top: '-2em'
});

const TickBar = styled('div', {
    width: '480px',
    height: '20px',
    maxWidth: '80vw'
});

const ANIMATION_SPEED = 2;
let count=0;

export default class sliderCovid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false
        };

        this._renderThumbValue = this._renderThumbValue.bind(this);
        this._animate = this._animate.bind(this);
        this._toggle = this._toggle.bind(this);
        this._animationFrame = null;
    }

    componentWillUnmount() {
        cancelAnimationFrame(this._animationFrame);
    }

    _toggle() {
        cancelAnimationFrame(this._animationFrame);
        const {isPlaying} = this.state;
        if (!isPlaying) {
            this._animate();
        }
        this.setState({isPlaying: !isPlaying});
    }

    _animate() {
        count++;
        // console.log(count);
        if(count===ANIMATION_SPEED){
            const {max,value} = this.props;
            let newCount=((value[1]+1)>max)?0:value[1]+1;

            let date=new Date('2020-01-22');
            date.setDate(date.getDate()+value[1]);
            console.log('mounth:',date.getMonth());

            // let month=date.getUTCMonth()+1;
            // if(month<10){
            //     month='0'+month
            // }
            // else{
            //     month=month.toString()
            // }
            // let tmpstr=date.getFullYear()+'-'+date.getUTCMonth()+1+'-'+date.getDate();
            let tmpstr=`${date.getFullYear()}-${(date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1}-${date.getDate()<10?'0'+date.getDate():date.getDate()}`;
            console.log('tmpstr:',tmpstr);
            this.props.onChange({
                date:tmpstr,
                value:[0,newCount]
            });
            count=0
        }
        this._animationFrame = requestAnimationFrame(this._animate);
    }

    _renderThumbValue({$thumbIndex, $value}) {
        //console.log('$thumbIndex:',$thumbIndex);
        if($thumbIndex==1){
            const value = $value[$thumbIndex];
            // console.log('thumb:',value)
            return <ThumbValue Color={[0,0,0,255]}>{this.props.formatLabel(value)}</ThumbValue>;
        }
        else{
            return <ThumbValue></ThumbValue>
        }

        // return <ThumbValue>{0}</ThumbValue>;
    }




    render() {
        const {value, min, max} = this.props;
        const isButtonEnabled = value[0] > min || value[1] < max;
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return (
            <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                    <Container>
                        <Button
                            shape={SHAPE.round}
                            size={SIZE.compact}
                            disabled={!isButtonEnabled}
                            onClick={this._toggle}
                        >
                            {this.state.isPlaying ? <Stop title="Stop" /> : <Start title="Animate" />}
                        </Button>
                        <Slider
                            {...this.props}
                            overrides={{
                                ThumbValue: this._renderThumbValue,
                                TickBar: () => <TickBar />
                            }}
                        />
                    </Container>
                    {/*<ButtonContainer>*/}
                    {/*    <Button*/}
                    {/*        shape={SHAPE.round}*/}
                    {/*        size={SIZE.compact}*/}
                    {/*        disabled={!isButtonEnabled}*/}
                    {/*    >*/}
                    {/*    </Button>*/}
                    {/*</ButtonContainer>*/}
                </BaseProvider>
            </StyletronProvider>
        );
    }
}
