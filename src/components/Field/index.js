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
import MyText from 'components/MyText';
        
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
    merge: 65,
    swipe: 80
}

const GESTURE_RESPONDER_CONFIG = {
  velocityThreshold: 0.2,
  directionalOffsetThreshold: 80
};

const zoomUp = {
    0: { scale: 1 },
    0.3: { scale: 1.35 },
    1: { scale: 1 }
}


// let last
class Field extends Component {
    constructor(state) {
        super(state);
        
        const BOARD_SIZE = CELLS * CELLS;
        let ids = Array.from(new Array(BOARD_SIZE),(val,index)=>index + 1);
        let byid = {};
        let affectedByid = {};
        
        ids.forEach((id) => { byid[id] = { value: 0 }; } );
        ids.forEach((id) => { affectedByid[id] = 0 } );
        
        this.state = {
            ids,
            byid,
            affectedByid
        }
        
        this.previousByid = byid;
        
        this.handleSwipe = this.handleSwipe.bind(this);
        
        Animatable.initializeRegistryWithDefinitions({ zoomUp });
    }
    
    componentWillReceiveProps( nextProps ) {
        if (this.props.backId != nextProps.backId) {
            if ( JSON.stringify(this.byid) != JSON.stringify(this.previousByid) ) {
                this.setState(() => ({ byiid: this.previousByid }));
            }
        }
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
        const rot = this.props.rotation;
        
        let realDir;
        if (rot == 0) {
            realDir = direction;
        } else if (rot == 180) {
            if (direction == SWIPE_UP) realDir = SWIPE_DOWN
            else if (direction == SWIPE_DOWN) realDir = SWIPE_UP
            else if (direction == SWIPE_LEFT) realDir = SWIPE_RIGHT
            else if (direction == SWIPE_RIGHT) realDir =SWIPE_LEFT
        }
        
        switch (realDir) {
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
        let swipeLegend = [];// { from: idFrom, to: idTo };
        let mergeLegend = []; // [id1, id2 ];
        let mergeValues = [];
        let affectedCells = [];
        
        let byid = { ...this.state.byid };
        let affectedByid = { ...this.state.affectedByid };
        let byidBackUp = JSON.parse(JSON.stringify(byid));
        
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
                    byid[column[prevIndex]]  
                    && ( byid[column[prevIndex]].value == 0  || ( byid[column[prevIndex]].value == value && mergeLegend.indexOf(column[prevIndex]) == -1 ))
                    ) {
                        
                    let prevId = column[prevIndex];
                    let prevElem = byid[prevId];
                    if (prevElem.value == value) {
                        //merge
                        swipeLegend.push({ fromId: id, toId: column[prevIndex] })
                        mergeLegend.push(prevId);
                        mergeValues.push(byid[prevId].value);
                        affectedCells.push(id);
                        affectedCells.push(prevId);
                        
                        byid[prevId] = { value: value * 2 };
                        byid[id].value = 0;
                        
                        continue lowerCycle;
                    }
                    
                    prevIndex--;
                }
                
                
                if (prevIndex < i - 1) {
                    
                    //move BEFORE wall || next taken block
                    let prevId = column[prevIndex + 1];
                    swipeLegend.push({ fromId: id, toId: prevId })
                
                    affectedCells.push(id);
                    affectedCells.push(prevId);
                    
                    byid[id].value = 0;
                    byid[prevId].value = value;
                }
                
            }
        }
        
        
        if (JSON.stringify(byid) == JSON.stringify(byidBackUp)) return;
        
        for (let i = 0; i < byid.length; i++ ) {
            let idFrom = byid[i].fromId;
            let idTo = byid[i].toId;
            
            if (affectedCells.indexOf(idFrom) == -1) affectedCells.push(idFrom);
            if (affectedCells.indexOf(idTo) == -1) affectedCells.push(idTo);
        }
        
        for (let i = 0; i < affectedCells.length; i++) affectedByid[affectedCells[i]] +=1;
        
        this.previousByid = byidBackUp;
        this.animateSwipe(swipeLegend).then(() => {
            this.setState(() => ({ byid, affectedByid }), () => { 
                this.spawn() 
                this.animateMerge(mergeLegend).then(() => this.props.onMerge(mergeValues))
            });
        })
    }
    
    animateMerge(legend) {
        return Promise.all(
            legend.map(( id ) => (
                    this[`cell${id}`].zoomUp(TIMING.merge)
                )
            )
        )
    }
    
    animateSwipe(legend) {
        return Promise.all(
            legend.map( (receipt, i) => {
                let to = this.getCoords(receipt.toId);
                
                let refKey = `cell${receipt.fromId}`;
                let cell = this[refKey];
                
                // const cellStyles = cell.props.style[1];
                if (cell) {
                    return cell.transitionTo(
                        { left: to.x, top: to.y },
                        TIMING.swipe,
                        "ease-out"
                    )
                    
                    // cell.transitionTo(
                    //     { left: to.x, top: to.y },
                    //     TIMING.swipe,
                    //     "ease-in"
                    // )
                    
                    // return new Promise((res) => { setTimeout(res, TIMING.swipe )});
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

    componentWillMount() {
        this.start();
    }
    
    start() {
        this.spawn();
        setTimeout(() => { this.spawn() }, 0);

    }
    
    onLose() {
        this.props.onLose();
    }
    
    spawn(id, value) {
        const { ids, byid } = this.state;
        
        let freeCells = ids.slice().filter((id) => ( byid[id].value == 0 ));
        
        if (freeCells.length == 0) this.onLose();
        
        if (!id) id = freeCells[~~(Math.random()*freeCells.length)];
        if (!value) value = Math.random() < 0.1 ? 4 : 2;

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
        const { ids, byid, affectedByid } = this.state;
        const { colorSheme } = this.props;
        const colors = colorShemes[colorSheme];
        return(
                <GestureRecognizer 
                    config={GESTURE_RESPONDER_CONFIG}
                    onSwipe={this.handleSwipe}
                    style={s.container}>
                  
                    <View style={s.board}>
                        <View style={{position: "relative", flex: 1, backgroundColor:"rgba(0,0,0,0)"}}>
                        <View style={[s.board, { backgroundColor: bgColor, position: "absolute"}]}>
                            {ids.map((id) => (
                                <View key={`bgCell${id}`} style={[s.cell, { position: "relative", backgroundColor: underBoxColor }]} />
                            ))}
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
                                let affectedIndex = affectedByid[id];
                                
                                return (
                                    value > 0 &&
                                        <Animatable.View
                                            key={`${id}${affectedIndex}`}
                                            style={[s.cell, { backgroundColor: cellCl,
                                                              left: pos.x,
                                                              top: pos.y
                                            }]}
                                            
                                            ref={el => { if (el) this[`cell${id}`] = el }}>
                                            
                                            <MyText   
                                                size={23}
                                                bold={true}
                                                style={[s.cellValue, {color: textCl} ]}>
                                                {value}
                                            </MyText>
                                            
                                        </Animatable.View>
                                )
                            })}
                        </View>
                    </View>
                </GestureRecognizer>
        )
    }
}



let flag = true;
const s = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0)"
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
    colorSheme: PropTypes.string.isRequired,
    onLose: PropTypes.func.isRequired,
    backId: PropTypes.number.isRequired,
    onMerge: PropTypes.func.isRequired,
    rotation: PropTypes.number.isRequired
}

export default Field;