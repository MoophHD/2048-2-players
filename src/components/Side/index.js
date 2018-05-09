import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Field from '../Field';

class Side extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLost: false,
            score: 0,
            backId: 0
        }
    }
    
    onBack() {
        this.setState(() => ({ backId: this.state.backId + 1 }));
    }
    
    onLose() {
        
    }
    
    handleLose() {
        this.setState(() => ({ isLost: true }));
    }
    
    onMerge(values=[]) {
        let plusPoints = 0;
        
        for (let i = 0; i < values.length; i++) plusPoints += values[i];
        
        if (plusPoints) this.setState(() => ({ score: this.state.score + plusPoints }));
    }
    
    render() {
        const { isLost, backId, score } = this.state;
        const { rotate=0 } = this.props;
        const colorSheme = "orange";
        return(
            <View style={[s.container, { transform: [ {rotate: `${rotate}deg`} ] }]}>
                <Field
                    backId={ backId }
                    onLose={() => this.handleLose()}
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
    degree: PropTypes.number
}

export default Side;