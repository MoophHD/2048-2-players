import React from 'react';
import { StyleSheet} from 'react-native';
import Main from './src/scenes/Main';
import { Font } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoaded: false
    }
  }
  
  async componentWillMount() {
    await Font.loadAsync({
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    });
    
    await Font.loadAsync({
      'open-sans-light': require('./assets/fonts/OpenSans-Light.ttf'),
    });
    
    await Font.loadAsync({
      'open-sans-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    });
    
    this.setState(() => ({ isLoaded: true }));
  }
  render() {
    return (
        this.state.isLoaded && <Main />
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
