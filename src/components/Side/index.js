import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Field from '../Field';

class Side extends Component {
    render() {
        const { colorSheme, degree=0 } = this.props;
        return(
            <View style={[s.container, { transform: [ {rotate: `${degree}deg`} ] }]}>
                <Field 
                    colorSheme={colorSheme}
                    />
            </View>    
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative"
    }
})

Side.propTypes = {
    degree: PropTypes.number,
    colorSheme: PropTypes.string
}

export default Side;