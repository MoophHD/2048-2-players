import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import Field from '../Field';

const GAME_STATES = {
    PLAYING: "PLAYING",
    IDLE: "IDLE",
    LOST: "LOST"
}

class Side extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            gameState: GAME_STATES.PLAYING,
            score: 0,
            backId: 0
        }
        
        this.onMerge = this.onMerge.bind(this);
    }
    
    onBack() {
        this.setState(() => ({ backId: this.state.backId + 1 }));
    }
    
    onLose() {
        this.setState(() => ({  }))
    }
    
    handleLose() {
        this.setState(() => ({ isLost: true }));
    }
    
    onMerge(values=[]) {
        let plusPoints = 0;
        
        for (let i = 0; i < values.length; i++) plusPoints += values[i];
        
        if (plusPoints) this.setState(() => ({ score: this.state.score + plusPoints }));
    }
    
    
    
    render() {
        const { gameState, backId, score } = this.state;
        const { degree=0 } = this.props;
        const colorSheme = "orange";
        return(
            <View style={[s.container, { transform: [ {rotate: `${degree}deg`} ] }]}>
       
                
                <View style={{flex: 1}}>
                    {
                        gameState == GAME_STATES.LOST && 
                            <View style={s.loseContainer}>
                                <TouchableHighlight onPress={() => this.onRestart()}>
                                    <View style={s.restartBtn}>
                                        R
                                    </View>
                                </TouchableHighlight>
                            </View>
                    }
                    <Field
                        rotation={degree}
                        onMerge={this.onMerge}
                        backId={ backId }
                        onLose={() => this.handleLose()}
                        colorSheme={colorSheme}
                        />
                </View>
                
    
            </View>    
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative"
    },
    loseContainer: {
        backgroundColor: 'rgba(0,0,0,.15)'
    },
    restartBtn: {
        
    }
})

Side.propTypes = {
    degree: PropTypes.number
}

export default Side;