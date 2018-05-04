import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { bgColor } from "config/colors";
import Field from "components/Field";

class Main extends Component {
    render() {
        return(
            <View style={s.container}>
                <Field />
                <Field />
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