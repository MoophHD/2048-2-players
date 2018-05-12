import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Side from "components/Side";
import { bgColor } from 'config/colors';
import MyText from "components/MyText";
import IconContainer from './components/IconContainer';

const TIME_MODE_SECS = 480;

class Main extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            time: -1,
            isTimedMode: false,
            readyState: {
                0: false,
                1: false
            }
        }
    }
    
    setTimer() {
        setInterval(() => ({ time: this.state.time - 1 }), 1000);
    }
    
    handleTimeTap() {
        this.setState(() => ({ isTimedMode: true, time: TIME_MODE_SECS }))
    }
    
    handleInfinityTap() {
        this.setState(() => ({ isTimedMode: false }))
    }
    
    handleReady(id) {
        this.setState(() => ({ readyState: {...this.state.readyState, id: true } }),
            () => { if (this.state.readyState[0] && this.state.readyState[1]) this.setTimer() }
        );
        
    }
    
    render() {
        const { readyState, isTimedMode, time } = this.state;
        return(
            <View style={s.container}>
                <Side 
                    degree={180}
                    id={0}
                    time = { isTimedMode ? time : -1 }
                    readyState={readyState}/>
                <Side 
                    degree={0}
                    id={1}
                    time = { isTimedMode ? time : -1 }
                    readyState={readyState}/>
                
                <View style={s.absoluteCenterWrapper}>
                    <IconContainer
                        arePlayersOpposite={true}
                        onTimeTap={() => this.handleTimeTap()}
                        onInfinityTap={() => this.handleInfinityTap()} />
                </View>
                
            </View>
        )
    }
}



const s = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: bgColor,
        padding: 2.5
    },
    absoluteCenterWrapper: {
        left: 0,
        top: 0,
        height: "100%",
        width: "100%",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Main;