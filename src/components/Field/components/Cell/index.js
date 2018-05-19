import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable-promise';
import MyText from 'components/MyText';
import { CELL_SIDE, CELL_PADDING } from 'config/metrics';
//ref = { el => { if (el) ref(el) } }
class Cell extends PureComponent { 
    render() {
        const { id, innerRef, pos, textCl, cellCl, value } = this.props;
        return(
            <Animatable.View
                ref={el => { if (el){innerRef(el)}}}
                style={[s.cell, {
                    backgroundColor: cellCl,
                    left: pos.x,
                    top: pos.y
                }]}>

                <MyText
                    size={23}
                    bold={true}
                    style={[s.cellValue, { color: textCl }]}>
                    {value}
                </MyText>

            </Animatable.View>
        )
    }
}



const s = StyleSheet.create({
    cell: {
        height: CELL_SIDE,
        width: CELL_SIDE,
        borderWidth: CELL_PADDING,
        borderColor: "rgba(0,0,0,0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        position: "absolute",
        left: 0,
        top: 0
    },
    cellValue: {
        color: "#333"
    }
})

export default Cell;