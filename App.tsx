import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store';
import Home from './src/screens/HomeScreen';
import Track from './src/screens/TrackScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Track" component={Track} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
