import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import MyText from 'components/MyText';
import { Ionicons } from "@expo/vector-icons";
import { DEVICE_HEIGHT } from "config/metrics";

const getAdjustedSize = ( size ) => {
    return Math.round(size * DEVICE_HEIGHT / 375);
}

const timeSize = 32;
const adjustedTimeSize = getAdjustedSize(32);

class IconContainer extends Component {
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
        const { arePlayersOpposite } = this.props;
        return(
            <View style={s.container}>
                <TouchableOpacity 
                
                    disabled={isInfinityActive}
                    activeOpacity={iconOpacity}
                    onPress={() => this.onInfinityTap()}>
                    <View  
                        style={[s.icon, 
                        {   opacity: isInfinityActive ? 1 : iconOpacity,
                            transform: [{rotate: `${arePlayersOpposite ? 270 : 180}deg`}]}]}>
                        <MyText 
                            size={32}
                            style={{fontFamily: "open-sans-bold"}}>
                            8
                        </MyText>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                
                    disabled={!isInfinityActive}
                    activeOpacity={iconOpacity}
                    onPress={() => this.onTimeTap()}>
                    <View style={[s.icon, {
                            opacity: isInfinityActive ? iconOpacity : 1,
                            transform: [{rotate: `90deg`}]}]}>
                        <Ionicons size={adjustedTimeSize} name="md-time" color="#333" />
                    </View>
                </TouchableOpacity>
            </View>
            )
    }
}

IconContainer.propTypes = {
    onInfinityTap: PropTypes.func,
    onTimeTap: PropTypes.func,
    arePlayersOpposite: PropTypes.bool
}
const iconMargin = 13.5;
const iconOpacity = .35;
const s = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
    },
    icon: {
        backgroundColor: "white",
        height: 85,
        width: 85,
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

export default IconContainer;