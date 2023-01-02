import {React, useContext} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { UserContext } from '../services/UserContext';
import HomeScreen from '../screens/HomeScreen';
import StockScreen from '../screens/StockScreen'
import WaiterScreen from '../screens/WaiterScreen';
import Menu from './Menu';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { user } = useContext(UserContext);
  
  return (
          <Drawer.Navigator 
           useLegacyImplementation
           drawerContent={(props) => <Menu {...props} />}>
          {user?.isManager && 
            <>
              <Drawer.Screen name="Stock" component={StockScreen} />
              <Drawer.Screen name="Waiters" component={WaiterScreen} />
            </>
          }
            <Drawer.Screen name="Home" component={HomeScreen} />
          </Drawer.Navigator>
  );
}
