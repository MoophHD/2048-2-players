import React, { Component } from "react";
import { View, 
         StyleSheet,
         Text
} from 'react-native';
import PropTypes from 'prop-types';
import {
        bgColor,
        lightTextCl,
        darkTextCl,
        colorShemes,
        boardBgColor,
        underBoxColor } from "config/colors";
        
import GestureRecognizer, { swipeDirections } from '../GestureRecognizer';
import { BOARD_SIDE } from "config/metrics";
import * as Animatable from 'react-native-animatable';


const CELLS = 4;
const CELL_PADDING = 2.5;
const BOARD_PADDING = 5 - CELL_PADDING;
const CELL_SIDE = ( BOARD_SIDE - 2*BOARD_PADDING) / 4;

const GESTURE_RESPONDER_CONFIG = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

class Field extends Component {
    constructor(state) {
        super(state);
        
        const BOARD_SIZE = CELLS * CELLS;
        let ids = Array.from(new Array(BOARD_SIZE),(val,index)=>index + 1);
        let byid = {};
        
        ids.forEach((id) => { byid[id] = { value: 8 }; } );
        
        this.state = {
            ids,
            byid
        }
        
        this.handleSwipe = this.handleSwipe.bind(this);
    }
    handleSwipe(direction, state) {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        
        switch (direction) {
          case SWIPE_UP:
            this.setState({backgroundColor: 'red'});
            break;
          case SWIPE_DOWN:
            this.setState({backgroundColor: 'green'});
            break;
          case SWIPE_LEFT:
            this.setState({backgroundColor: 'blue'});
            break;
          case SWIPE_RIGHT:
            this.setState({backgroundColor: 'yellow'});
            break;
        }
    }
    
    render() {
        const { ids, byid } = this.state;
        const { colorSheme } = this.props;
        const colors = colorShemes[colorSheme];
        
        return(
                <GestureRecognizer 
                    config={GESTURE_RESPONDER_CONFIG}
                    onSwipe={this.handleSwipe}
                    style={s.container}>
                    <View style={s.board}>
                        
                        {ids.map((id) => {
                            let cell = byid[id];
                            let value = cell.value;
                            let cellCl;
                            //value is too big, pick last one
                            if (colors.hasOwnProperty(value)) {
                                cellCl = colors[value];
                            } else {
                                cellCl = colors[8192];
                            }
                            let textCl = value > 4 ? darkTextCl : lightTextCl;
                            return (
                                value > 0 ?
                                    <Animatable.View
                                        key={id}
                                        style={[s.cell, { backgroundColor: cellCl }]}
                                        ref={`cell${id}`}>
                                        
                                        <Text style={[s.cellValue, {color: textCl} ]}>
                                            {value}
                                        </Text>
                                    </Animatable.View>
                                    :
                                    <View key={id} style={[s.cell, { backgroundColor: underBoxColor }]} />
                            )
                        })}
                        
                    </View>
                </GestureRecognizer>
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    board: {
        backgroundColor: boardBgColor,
        height: BOARD_SIDE,
        width: BOARD_SIDE,
        padding: BOARD_PADDING,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    cell: {
        height: CELL_SIDE,
        width: CELL_SIDE,
        borderWidth: CELL_PADDING,
        borderColor: boardBgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    cellValue: {
        color: "#333"
    }
})

Field.propTypes = {
    colorSheme: PropTypes.string
}

export default Field;