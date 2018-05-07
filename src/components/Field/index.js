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
import * as Animatable from 'react-native-animatable-promise';

// metrics
const CELLS = 3;
const CELL_PADDING = 2.5;
const BOARD_PADDING = 5 - CELL_PADDING;

const CELL_SIDE = ( BOARD_SIDE - 2*BOARD_PADDING) / CELLS;

// cell / board stuff
const TIMING = {
    spawn: 125,
    swipe: 100
}

const GESTURE_RESPONDER_CONFIG = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 40
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
    
    getCoords(id) {
        // pivot is centered, relative coords
        id--;
        
        let y = ~~(id / CELLS);
        
        let x = id % CELLS;
        return { x: CELL_SIDE * x, y: CELL_SIDE * y};
    }
    
    getId(x,y) {
        //ids are shiftet by 1
        if (x < 0 || y < 0 || x > CELLS - 1 || y > CELLS - 1) return -1;
        return y * CELLS + x + 1;
    }
    
    handleSwipe(direction, state) {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        
        switch (direction) {
            
          case SWIPE_UP:
            this.swipe(false, false);
            break;
          case SWIPE_DOWN:
            this.swipe(false, true);
            break;
          case SWIPE_LEFT:
            this.swipe(true, false);
            break;
          case SWIPE_RIGHT:
            this.swipe(true, true);
            break;
        }
    }
    
 
    swipe( isHorizontal=false, isReverse=false ) {
        let aniLegend = [];// { from: idFrom, to: idTo };
        const byid = { ...this.state.byid };
        
        let columns = [];
        if (isHorizontal) {
            for (let i = 0; i < CELLS; i++) {
                let col = [];
                for (let x = 1; x <= CELLS; x++) {
                    col.push(i * CELLS + x);
                }
                columns.push(col);
        }
        } else {
            for (let i = 1; i <= CELLS; i++) {
                let col = [];
                for (let j = 0; j < CELLS; j++) {
                    col.push(i + CELLS * j);
                }
                columns.push(col);
            } 
        }
    
        // revers order if to down scroll
        
        if (isReverse) columns.forEach((col) => col.reverse());
    
        for (let j = 0; j < columns.length; j++) {
            let column = columns[j];
            lowerCycle: for (let i = 1; i < column.length; i++) {
                let id = column[i];
                let value = byid[id].value;
                //if blank empty
                if (value == 0) continue;
                let prevIndex = i - 1;
                
             
                //if not a wall and empty
                while(
                    byid[column[prevIndex]] && byid[column[prevIndex]].value == 0
                    ) {
                        
                    let prevId = column[prevIndex];
                    let prevElem = byid[prevId];
                    //     console.log(`interation index ${prevIndex}`);
                    //   if (value == 4) {
                    //         console.log(`i ${i}`)
                    //         console.log(`prev index ${prevIndex}`)
                    //         console.log(`prev id ${prevId}`)
                    //         console.log(prevElem);
                    //     }
                    
                    if (prevElem.value == value) {
                        //merge
                        aniLegend.push({ fromId: id, toId: column[prevIndex] })
                        byid[prevId] = { value: value * 2 };
                        byid[id].value = 0;
                        
                        continue lowerCycle;
                    }
                    prevIndex--;
                }
                
                if (prevIndex < i - 1) {
                    
                    //move BEFORE wall || next taken block
                    let prevId = column[prevIndex + 1];
                    aniLegend.push({ fromId: id, toId: prevId })
                    byid[id].value = 0;
                    byid[prevId].value = value;
                }
            }
        }
        console.log(byid);
        this.animateSwipe(aniLegend).then(() => {
            this.setState(() => ({ byid }));
        })
        
        // this.setState(() => ({ byid }));
    }
    
    animateSwipe(legend) {
        return Promise.all(
            legend.map( (receipt, i) => {
            
                let from = this.getCoords(receipt.fromId);
                let to = this.getCoords(receipt.toId);
                let dx = to.x - from.x;
                let dy = to.y - from.y;
                
                let refKey = `cell${receipt.fromId}`;
                let cell = this[refKey];
                if (cell) {
                    return cell.transitionTo(
                        { left: to.x, top: to.y },
                        TIMING.swipe
                    )
                }
                
            })
        )
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
        
        
        this.spawn(1, 2);
        setTimeout(() => { this.spawn(2, 4) }, 0);
        // setTimeout(() => this.spawn(), 100);
        
        // setTimeout(() => {
        //     this.animateSwipe(
        //         [
        //             { fromId: 2, toId: 5 },
        //             { fromId: 1, toId: 7 }
        //         ]
                
        //         ).then(() => alert("finished!"))
        // }, 250);
    }
    
    spawn(id, value) {
        const { ids, byid } = this.state;
        
        let freeCells = ids.slice().filter((id) => ( byid[id].value == 0 ));
        if (!id) id = freeCells[~~(Math.random()*freeCells.length)];
        if (!value) value = Math.random() < 0.5 ? 4 : 2;

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
        
        
        console.log("render");
        console.log(byid);
        
        return(
                <GestureRecognizer 
                    config={GESTURE_RESPONDER_CONFIG}
                    onSwipe={this.handleSwipe}
                    style={s.container}>
                    
                    <TouchableOpacity onPress={() => { flag ? this.start() : this.clear(); flag = !flag }}>
                        <View style={{ backgroundColor: "crimson", height: 50, width: 300, margin: 5}} />
                    </TouchableOpacity>
 
               
                    <View style={s.board}>
                        <View style={{position: "relative", flex: 1, backgroundColor:"rgba(0,0,0,0)"}}>
                            <View style={[s.board, { backgroundColor: boardBgColor, padding: 0, left: 0, top: 0, position: "relative" }]}>
                                {ids.map((id) => (<View key={`bgUnderCell${id}`} style={[s.cell, { backgroundColor: underBoxColor, position: "relative" }]} />))}
                            </View>
    
         
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
                                const pos = this.getCoords(id);
                                return (
                                    value > 0 &&
                                        <Animatable.View
                                            key={id}
                                            style={[s.cell, { backgroundColor: cellCl,
                                                              left: pos.x,
                                                              top: pos.y
                                            }]}
                                            
                                            ref={el => { if (el) this[`cell${id}`] = el }}>
                                            
                                            <Text style={[s.cellValue, {color: textCl} ]}>
                                                {value}
                                            </Text>
                                        </Animatable.View>
                                )
                            })}
                        </View>
                    </View>
                </GestureRecognizer>
        )
    }
}

        // <View style={[s.board, { backgroundColor: boardBgColor, padding: BOARD_PADDING / 2 }]}>
        //                     {ids.map((id) => (<View key={`bgUnderCell${id}`} style={[s.cell, { backgroundColor: underBoxColor }]} />))}
        //                 </View>

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
        height: BOARD_SIDE,
        width: BOARD_SIDE,
        padding: BOARD_PADDING,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        borderRadius: 3,
        position: "relative"
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
        position: "absolute",
        left: 0,
        top: 0
    },
    cellValue: {
        color: "#333"
    }
})

Field.propTypes = {
    colorSheme: PropTypes.string
}

export default Field;