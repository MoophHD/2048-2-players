import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DEVICE_HEIGHT } from 'config/metrics';

const getAdjustedSize = ( size ) => {
    return Math.round(size * DEVICE_HEIGHT / 375);
}

const MyText = ({ children, style, size }) => (
    <Text style={[
        s.text,
        {
            fontSize: getAdjustedSize(size || 16),
            ...style
        }
    ]}>
        {children}
    </Text>
)

const s = StyleSheet.create({
    text: {
        color: "#333",
        fontFamily: "open-sans-regular"
    }
})

export default MyText;