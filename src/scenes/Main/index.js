import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Side from "components/Side";
import { bgColor } from 'config/colors';

class Main extends Component {
    render() {
        return(
            <View style={s.container}>
                <Side colorSheme={"orange"}/>
            </View>
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: bgColor
    }
})

export default Main;