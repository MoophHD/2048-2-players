import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DEVICE_HEIGHT } from 'config/metrics';

const getAdjustedSize = ( size ) => {
    return Math.round(size * DEVICE_HEIGHT / 375);
}

const MyText = ({ children, style, size, bold }) => {
    if (Array.isArray(style)) style = style[1];
    let font = bold ? "open-sans-bold" : "open-sans-regular";
    return ( 
        <Text style={[
            s.text,
            {
                fontSize: getAdjustedSize(size || 16),
                fontFamily: font,
                ...style
            }
        ]}>
            {children}
        </Text>
    )
}

const s = StyleSheet.create({
    text: {
        color: "#333"
    }
})

MyText.propTypes = {
    size: PropTypes.number,
    bold: PropTypes.bool
}

export default MyText;