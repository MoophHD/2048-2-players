import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import MyText from 'components/MyText';
import { Ionicons } from "@expo/vector-icons";
import { getAdjustedSize } from 'config/gist';
import { mainCl, subCl, mainClDarken, subClDarken } from 'config/colors';
import { GAME_STATES } from "config/constants";

const timeSize = 32;
const adjustedTimeSize = getAdjustedSize(timeSize);

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
        console.log(ready);
        return(
            <View style={s.container}>
                <View style={s.line} />
                
                
                <View style={{borderRadius: 200, overflow: "hidden"}}>
                    <TouchableHighlight 
                        underlayColor={isInfinityActive ? mainClDarken : subClDarken}
                        onPress={() => this.onInfinityTap()}>
                        <View  
                            style={[s.icon, 
                            {   backgroundColor: isInfinityActive ? mainCl : subCl, }]}>
                            <MyText 
                                size={32}
                                style={{fontFamily: "open-sans-bold"}}>
                                8
                            </MyText>
                        </View>
                    </TouchableHighlight>
                </View>
                
                <View style={s.main}>
             
                    { state == GAME_STATES.IDLE ?
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, backgroundColor: ready[0] ? mainCl : subCl }}>
                            
                            </View>
        
                            <View style={{flex: 1, backgroundColor: ready[1] ? subCl : mainCl }}>
                            
                            </View>
                        </View>
                        :
                        <View/>
                    }
                    
                  <View style={{height: "100%", width: "100%", position: "absolute", top:0, left: 0, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <View style={s.mainLine} />
                    </View>
                </View>
                
                           
                <View style={{borderRadius: 200, overflow: "hidden"}}>
                    <TouchableHighlight 
                        underlayColor={!isInfinityActive ? mainClDarken : subClDarken}
                        disabled={!isInfinityActive}
                        onPress={() => this.onTimeTap()}>
                        <View style={[s.icon, {
                                backgroundColor: !isInfinityActive ? mainCl : subCl,
                                transform: [{rotate: `45deg`}]}]}>
                            <Ionicons size={adjustedTimeSize} name="md-time" color="#333" />
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}


                    // <View style={{flex: 1, backgroundColor: ready[0] ? green : subCl}} />
                    // <View style={{flex: 1, backgroundColor: ready[1] ? green : subCl}} />

Middle.propTypes = {
    onInfinityTap: PropTypes.func,
    onTimeTap: PropTypes.func,
    arePlayersOpposite: PropTypes.bool
}
const iconMargin = 13.5;
const iconOpacity = .35;

const lnWidth = 3;
const lnWidthThick = 4;

const s = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
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
        height: 53,
        width: 53,
        borderRadius: 1000,
        display: "flex",
        marginLeft: iconMargin,
        marginRight: iconMargin,
        justifyContent: "center",
        alignItems: "center",
        
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.14
    }
})

export default Middle;


                
