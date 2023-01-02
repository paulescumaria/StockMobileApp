import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProvider from './services/UserContext';
import { auth } from './firebase';
import StackNavigator from './components/StackNavigator';
import DrawerNavigator from './components/DrawerNavigator';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLogged, setIsLogged] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((userStatus) => {
      console.log(userStatus);
      if (userStatus)
        setIsLogged(true)
      else
        setIsLogged(false)
      
    })
    console.log('asd');
  }, [])

  return (
    <NavigationContainer>
      <PaperProvider>
        <UserProvider>
          {isLogged ? <DrawerNavigator /> : <StackNavigator />}
        </UserProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}
