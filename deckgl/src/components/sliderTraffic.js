/* global requestAnimationFrame, cancelAnimationFrame */
import React, {PureComponent} from 'react';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, styled} from 'baseui';
import {Slider} from 'baseui/slider';
import {Button, SHAPE, SIZE} from 'baseui/button';
import Start from 'baseui/icon/chevron-right';
import Stop from 'baseui/icon/delete';
import { Select } from "baseui/select";

const engine = new Styletron();

const SelectContainer=styled('div',{
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
    color: '#00FFFF',
    position: 'absolute',
    top: '-2em'
});

const TickBar = styled('div', {
    width: '480px',
    height: '24px',
    maxWidth: '80vw'
});

const ANIMATION_SPEED = 2;

export default class sliderTraffic extends PureComponent {
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
    componentDidMount() {
        // this._animate()
    }

    // componentWillUnmount() {
    //     cancelAnimationFrame(this._animationFrame);
    // }

    _toggle() {
        cancelAnimationFrame(this._animationFrame);
        const {isPlaying} = this.state;
        if (!isPlaying) {
            this._animate();
        }
        this.setState({isPlaying: !isPlaying});
    }

    _animate() {
        const {min,max, value} = this.props;
        let newValue=value[1]+ANIMATION_SPEED;
        if(value[1]>max){
            newValue=min;
        }
        this.props.onChange({
            value: [value[0],newValue]
        });
        this._animationFrame = requestAnimationFrame(this._animate);
    }

    _renderThumbValue({$thumbIndex, $value}) {
        //console.log('$thumbIndex:',$thumbIndex);
        if($thumbIndex==1){
            const value = $value[$thumbIndex];
            if(value==3600){
                console.log('thumb==3600')
            }
           // console.log('thumb:',value)
            return <ThumbValue Color={[0,0,0,255]}>{this.props.formatLabel(value)}</ThumbValue>;
        }
        else{
            return <ThumbValue></ThumbValue>
        }

        // return <ThumbValue>{0}</ThumbValue>;
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }


    render() {
        const {value, min, max} = this.props;
        const isButtonEnabled = value[0] > min || value[1] < max;
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return (

                    <Container>
                        <Button
                            id={'start'}
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



        );
    }
}
