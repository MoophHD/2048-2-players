import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import MyText from 'components/MyText';
import { Ionicons, Entypo } from "@expo/vector-icons";
import { getAdjustedSize } from 'config/gist';
import { mainCl, subCl, mainClDarken, subClDarken, darkTextCl, green, red } from 'config/colors';
import { GAME_STATES } from "config/constants";

const timeSize = 28;
const adjustedTimeSize = getAdjustedSize(timeSize);

const infSize = 18;
const adjustedInfTime = getAdjustedSize(infSize);

class Middle extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isInfinityActive: true
        }
    }
    onTimeTap() {
        this.props.onTimeTap();
        
        this.setState(() => ({ isInfinityActive: false }))
    }
    
    onInfinityTap() {
        this.props.onInfinityTap();
        
        
        this.setState(() => ({ isInfinityActive: true }))
    }
    render() {
        const { isInfinityActive } = this.state;
        const { state, score, ready } = this.props;

        return(
            state == GAME_STATES.PLAYING ?
            <View style={s.container}>
                <View style={s.line} />

                <View style={[s.scorePanel, 
                    { marginTop: -scorePanel.height, 
                      transform: [{rotate: "180deg"}]}]}>
                    <MyText>
                        {score[0]}
                    </MyText>
                </View>
                
                <View style={[s.scorePanel, { marginTop: scorePanel.height }]}>
                    <MyText>
                        {score[1]}
                    </MyText>
                </View>

            </View> 

            :


            <View style={s.container}>

                <View style={s.line} />
                
                
                <View style={{borderRadius: 200, overflow: "hidden", margin: iconMargin}}>
                    <TouchableHighlight 
                        underlayColor={isInfinityActive ? subClDarken : mainClDarken}
                        onPress={() => this.onInfinityTap()}>
                        <View style={[s.icon, {
                            backgroundColor: isInfinityActive ? mainCl : subCl
                        }]}>
                                <Entypo size={adjustedTimeSize} name="500px" color={darkTextCl} />
                        </View>
                    </TouchableHighlight>
                </View>
                
                <View style={s.main}>
             
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, backgroundColor: ready[0] ? mainCl : subCl }} />
    
                        <View style={{flex: 1, backgroundColor: ready[1] ? mainCl : subCl }} />
                    </View>
                    
                    <View style={{height: "100%", width: "100%", position: "absolute", top:0, left: 0, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <View style={s.mainLine} />
                    </View>
                </View>
                
                           
                <View style={{ borderRadius: 200, overflow: "hidden", margin: iconMargin }}>
                    <TouchableHighlight 
                        underlayColor={!isInfinityActive ? mainClDarken : subClDarken}
                        disabled={!isInfinityActive}
                        onPress={() => this.onTimeTap()}>
                        <View style={[s.icon, {
                                backgroundColor: !isInfinityActive ? mainCl : subCl,
                                transform: [{rotate: `45deg`}]}]}>
                                <Ionicons size={adjustedTimeSize} name="md-time" color={darkTextCl} />
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

{/* <View style={[s.main, { borderRadius: 5 }]}>

    <View style={{ flex: 1 }}>
        <View style={[s.score, { backgroundColor: score[0] != score[1] ? (score[0] > score[1] ? green : red) : subCl }]}>
            <MyText
                style={{ transform: [{ rotate: "180deg" }] }}>
                {score[0]}
            </MyText>
        </View>

        <View style={[s.score, { backgroundColor: score[0] != score[1] ? (score[1] > score[0] ? green : red) : subCl }]}>
            <MyText>
                {score[1]}
            </MyText>
        </View>
    </View>
</View> */}


                    // <View style={{flex: 1, backgroundColor: ready[0] ? green : subCl}} />
                    // <View style={{flex: 1, backgroundColor: ready[1] ? green : subCl}} />

Middle.propTypes = {
    onInfinityTap: PropTypes.func,
    onTimeTap: PropTypes.func,
    arePlayersOpposite: PropTypes.bool
}
const iconMargin = 19.5;
const iconOpacity = .35;

const lnWidth = 3;
const lnWidthThick = 4;


const scorePanel = {
    height: 25,
    width: 125
}
const s = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    scorePanel:  {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: scorePanel.height,
        width: scorePanel.width,
        backgroundColor: "crimson"
    },
    main: {
        backgroundColor: subCl,
        borderWidth: lnWidthThick,
        borderColor: mainCl,
        borderRadius: 100,
        height: 125,
        width: 125,
        display: "flex",
        overflow: "hidden",
    },
    mainLine: {
        opacity: 0.25,
        backgroundColor: "#000",
        width: "85%",
        height: 1,
        margin: "auto"
    },
    line: {
      position: "absolute",
      width: "100%",
      height: lnWidth,
      backgroundColor: mainCl
    },
    icon: {
        backgroundColor: "white",
        height: 50,
        width: 50,
        borderRadius: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.14
    },
    score: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Middle;


                
