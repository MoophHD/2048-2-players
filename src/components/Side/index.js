import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Field from '../Field';

class Side extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLost: false,
            score: 0
        }
    }
    
    handleLose() {
        
    }
    
    onMerge(values=[]) {
        let plusPoints = 0;
        
        for (let i = 0; i < values.length; i++) plusPoints += values[i];
        
        if (plusPoints) this.setState(() => ({ score: this.state.score + plusPoints }));
    }
    
    render() {
        const { colorSheme, degree=0 } = this.props;
        return(
            <View style={[s.container, { transform: [ {rotate: `${degree}deg`} ] }]}>
                <Field 
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
    degree: PropTypes.number,
    colorSheme: PropTypes.string
}

export default Side;