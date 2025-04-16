import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import TrackScreen from './src/screens/TrackScreen';  
import CitySearchScreen from './src/screens/CitySearchScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="Track" 
            component={TrackScreen}
            options={{ 
              title: 'Статуси відправлень',
              headerStyle: {
                backgroundColor: '#FF6B08',
              },
              headerTintColor: '#fff',
            }} 
          />
          <Stack.Screen name="CitySearch" component={CitySearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;