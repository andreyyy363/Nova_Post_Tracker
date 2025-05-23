import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import TrackScreen from './src/screens/TrackScreen';
import CitySearchScreen from './src/screens/CitySearchScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarActiveTintColor: '#FF6B08',
            tabBarInactiveTintColor: '#666',
            headerShown: false,
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Головна',
              tabBarIcon: ({color}) => (
                <Text style={{fontSize: 24, color}}>🏠</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Track"
            component={TrackScreen}
            options={{
              tabBarLabel: 'Відстеження',
              tabBarIcon: ({color}) => (
                <Text style={{fontSize: 24, color}}>🔍</Text>
              ),
            }}
          />
          <Tab.Screen
            name="CitySearch"
            component={CitySearchScreen}
            options={{
              tabBarLabel: 'Відділення',
              tabBarIcon: ({color}) => (
                <Text style={{fontSize: 24, color}}>📍</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={{
              tabBarLabel: 'Калькулятор',
              tabBarIcon: ({color}) => (
                <Text style={{fontSize: 24, color}}>🧮</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
