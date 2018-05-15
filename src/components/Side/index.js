import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import Field from '../Field';
import { Entypo } from "@expo/vector-icons";
import { getAdjustedSize } from 'config/gist';
import { mainCl, subCl } from 'config/colors';
import { GAME_STATES } from "config/constants";

const iconSize = 32;
const adjustedIconSize = getAdjustedSize(iconSize);

class Side extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            backId: 0
        }
        
        this.onMerge = this.onMerge.bind(this);
    }
    
    onBack() {
        this.setState(() => ({ backId: this.state.backId + 1 }));
    }
    
    handleLose() {
        this.props.onLose();
    }
    
    onMerge(values=[]) {
        let plusPoints = 0;
        
        for (let i = 0; i < values.length; i++) plusPoints = plusPoints + values[i] * 2;
        
        if (plusPoints) this.props.onScoreAdd(plusPoints);
    }
    
    
    render() {
        const { backId } = this.state;
        const { degree=0, readyState, id, onReady, state, score } = this.props;
        const colorSheme = "orange";
        
        const isEnemyReady = readyState[ id == 0 ? 1 : 0];
        const isReady = readyState[id];
        
        return(
            <View style={[s.container, { transform: [ {rotate: `${degree}deg`} ] }]}>
       
                
                <View style={{flex: 1}}>
                
                    {
                        state == GAME_STATES.LOST && 
                            <View style={s.dimContainer}>
                                <TouchableHighlight onPress={() => this.onRestart()}>
                                    <View style={s.centeredBtn}>
                                        R
                                    </View>
                                </TouchableHighlight>
                            </View>
                    }
                    
                    {
                        state == GAME_STATES.IDLE && 
                           <TouchableHighlight onPress={onReady}>
                                <View style={s.dimContainer}>
                                    <View style={s.readyContainer}>
                                        <View style={[ s.readyBall, { backgroundColor: isReady ? mainCl : subCl } ]} />
                                        <View style={[ s.readyBall, { backgroundColor: isEnemyReady ? mainCl : subCl } ]} />
                                    </View>
                                </View>
                            </TouchableHighlight>
                    }

                    {
                        state != GAME_STATES.IDLE &&
                            <Field
                                rotation={degree}
                                onMerge={this.onMerge}
                                backId={backId}
                                onLose={() => this.handleLose()}
                                colorSheme={colorSheme}
                            />
                    }
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
    dimContainer: {
        backgroundColor: "rgba(0,0,0,0)",
        height: '100%',
        width: '100%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    centeredBtn: {
        width: 75,
        height: 75,
        backgroundColor: "crimson",
        justifyContent: "center",
        alignItems: "center",
        display: "flex"
    }
})

Side.propTypes = {
    degree: PropTypes.number
}

export default Side;