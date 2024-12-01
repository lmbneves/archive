/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { AppContextProvider } from './src/context/app-context-provider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './src/navigation/types';
import { HomeScreen, ArchiveScreen, ItemScreen } from './src'

const Stack = createNativeStackNavigator<RootStackParamList>(); 

export default function App() {
  return (
    <AppContextProvider>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={ HomeScreen }
            />
            <Stack.Screen
              name="Archive"
              component={ ArchiveScreen }
              options={({ route }) => ({
                title: route.params?.archive.name || 'Archive'
              })}
            />
            <Stack.Screen
              name="Item"
              component={ ItemScreen }
              options={({ route }) => ({
                title: route.params?.item.name || 'Item'
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});