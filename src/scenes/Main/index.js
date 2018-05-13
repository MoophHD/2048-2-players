import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Side from "components/Side";
import { bgColor } from 'config/colors';
import MyText from "components/MyText";
import Middle from './components/Middle';
import { GAME_STATES } from "config/constants";

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
            },
            score: {
              0: 0,
              1: 0
            },
            gameState: GAME_STATES.IDLE
        }
        
        this.handleReady = this.handleReady.bind(this);
    }
    
    handleReady(id) {
        this.setState(() => ({ readyState: {...this.state.readyState, [id]: true } }),
            () => { if (this.state.readyState[0] && this.state.readyState[1]) this.setTimer() }
        );
        
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
    

    
    handleScoreAdd(id, value) {
        this.setState(() => ({ score: {...this.state.score, [id]: this.state.score[id] + value } }))
    }
    
    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }
    
    handleLose(id) {
        this.setState(() => ({ gameState: GAME_STATES.END }))
    }
    
    render() {
        const { 
                score,
                readyState, 
                isTimedMode, 
                time, 
                gameState } = this.state;
        console.log(readyState);
        let state0;
        let state1;
        
        if (gameState == GAME_STATES.END) {
            if (score[1] > score[0]) {
                state0 = GAME_STATES.LOSE;
                state1 = GAME_STATES.WIN;
            } else {
                state0 = GAME_STATES.WIN;
                state1 = GAME_STATES.LOSE;
            }
        } else {
            state0 = gameState;
            state1 = gameState;
        }
        
        return(
            <View style={s.container}>
        
                <Side 
                    score={score[0]}
                    id={0}
                    degree={180}
                    state={state0}
                    
                    onReady={ () => { this.handleReady(0) } }
                    onScoreAdd={(value) => { this.handleScoreAdd(0, value) }}
                    onLose={() => { this.handleLose(0) }}
                    readyState={readyState}/>
                <Side 
                    score={score[1]}
                    id={1}
                    degree={0}
                    state={state1}
                    
                    onReady={ () => { this.handleReady(1) } }
                    onScoreAdd={(value) => { this.handleScoreAdd(1, value) }}
                    onLose={() => { this.handleLose(1) }}
                    readyState={readyState}/>
                    
              <View style={s.absoluteCenterWrapper}>
                    <Middle
                        state={gameState}
                        score={score}
                        ready={readyState}
                        
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
        padding: 0
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