import React, { Component } from "react";
import { View, 
         StyleSheet,
         Text,
         TouchableOpacity
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

// metrics
const CELLS = 4;
const CELL_PADDING = 2.5;
const BOARD_PADDING = 5 - CELL_PADDING;
const CELL_SIDE = ( BOARD_SIDE - 2*BOARD_PADDING) / 4;

// cell / board stuff
const TIMING = {
    spawn: 10000
}

const GESTURE_RESPONDER_CONFIG = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

// let last
class Field extends Component {
    constructor(state) {
        super(state);
        
        const BOARD_SIZE = CELLS * CELLS;
        let ids = Array.from(new Array(BOARD_SIZE),(val,index)=>index + 1);
        let byid = {};
        
        ids.forEach((id) => { byid[id] = { value: 0 }; } );
        
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
            this.swipeUp();
            break;
          case SWIPE_DOWN:
            break;
          case SWIPE_LEFT:
            break;
          case SWIPE_RIGHT:
            break;
        }
    }
    
    swipeUp() {
        const { ids, byid } = this.state;
        
        let columns = [];
        
        for (let i = 1; i <= CELLS; i++) {
            let col = [];
            for (let j = 0; j < CELLS; j++) {
                col.push(i + CELLS * j);
            }
            columns.push(col);
        }
        
        console.log(columns);
    }
    
    clear() {
        
        let byid = {};
        this.state.ids.forEach((id) => { byid[id] = { value: 0 }; } );
        this.setState(() => ({
            byid: byid
        }))
    }
    
    start() {
        // Promise.all([
        //     this[`cell1`].zoomIn(TIMING.spawn),
        //     this[`cell2`].zoomIn(TIMING.spawn)
        // ])
        
        
        this.spawn();
        setTimeout(() => this.spawn(), 100);
    }
    
    spawn() {
        const { ids, byid } = this.state;
        
        let freeCells = ids.slice().filter((id) => ( byid[id].value == 0 ));
        let id = freeCells[~~(Math.random()*freeCells.length)];
        let value = Math.random() < 0.1 ? 4 : 2;
        this.setState(() => ({
            byid: {
                ...this.state.byid,
                [id]: {
                    ...this.state.byid[id],
                    value: value
                }
            }
        }),
            () => {
                if (this[`cell${id}`]) {
                    this[`cell${id}`].zoomIn(TIMING.spawn);
                }
            }
        )
        
        
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
                    
                    <TouchableOpacity onPress={() => { flag ? this.start() : this.clear(); flag = !flag }}>
                        <View style={{ backgroundColor: "crimson", height: 50, width: 300, margin: 5}} />
                    </TouchableOpacity>
 
               
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
                            let textCl = value > 4 ? lightTextCl : darkTextCl;
                            return (
                                value > 0 ?
                                    <Animatable.View
                                        key={id}
                                        style={[s.cell, { backgroundColor: cellCl }]}
                                        ref={el => { if (el) this[`cell${id}`] = el }}>
                                        
                                        <Text style={[s.cellValue, {color: textCl} ]}>
                                            {value}
                                        </Text>
                                    </Animatable.View>
                                    :
                                    <View key={`underCell${id}`} style={[s.cell, { backgroundColor: underBoxColor }]} />
                            )
                        })}
                        
                    </View>
                </GestureRecognizer>
        )
    }
}

// {ids.map((id) => (<View key={`bgUnderCell${id}`} style={[s.cell, { backgroundColor: underBoxColor }]} />))}

    let flag = true;
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
        flexWrap: "wrap",
        borderRadius: 3
    },
    cell: {
        height: CELL_SIDE,
        width: CELL_SIDE,
        borderWidth: CELL_PADDING,
        borderColor: boardBgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
    cellValue: {
        color: "#333"
    }
})

Field.propTypes = {
    colorSheme: PropTypes.string
}

export default Field;