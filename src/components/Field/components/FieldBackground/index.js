import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { BOARD_SIDE, BOARD_PADDING, CELLS, CELL_SIDE, CELL_PADDING } from 'config/metrics';
import { underBoxColor, bgColor } from 'config/colors';

class FieldBackground extends PureComponent {
    render() {
        const ids = Array.apply(null, { length: CELLS * CELLS }).map(Function.call, Number);
        return(
            <View style={s.board} >
                {
                    ids.map((id) => (
                        <View key={`bgCell${id}`} style={s.cell} />
                    ))
                }
            </View>
        )
    }
}

const s = StyleSheet.create({
    board: {
        height: BOARD_SIDE,
        width: BOARD_SIDE,
        padding: BOARD_PADDING,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        borderRadius: 3,
        position: "absolute",
        backgroundColor: bgColor
    },
    cell: {
        height: CELL_SIDE,
        width: CELL_SIDE,
        borderWidth: CELL_PADDING,
        borderColor: "rgba(0,0,0,0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: underBoxColor
    }
})

export default FieldBackground;