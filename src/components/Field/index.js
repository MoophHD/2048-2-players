import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';
import { fieldBgColor } from "config/colors";

class Field extends Component {
    render() {
        return(
            <View style={s.container}>
            
            </View>    
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fieldBgColor,
        margin: 5
    }    

})

export default Field;