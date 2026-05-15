import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapAssemblyScreen from './index';
import AreaDetailScreen from './AreaDetail';

const Stack = createNativeStackNavigator();

export default function UitGreenLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="MapAssembly"
        component={MapAssemblyScreen}
        options={{ title: 'Bản đồ UIT' }}
      />
      <Stack.Screen
        name="AreaDetail"
        component={AreaDetailScreen}
        options={{ title: 'Chi tiết khu vực' }}
      />
    </Stack.Navigator>
  );
}
