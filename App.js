import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConnexionScreen from './screens/ConnexionScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import SelectProfilScreen from './screens/SelectProfilScreen';
import InfoPersoParentScreen from './screens/InfoPersoParentScreen';
import InfoPersoBabyScreen from './screens/InfoPersoBabyScreen';
import DashboardParentScreen from './screens/DashboardParentScreen';
import DashboardBabyScreen from './screens/DashboardBabyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="SelectProfil" component={SelectProfilScreen} />
        <Stack.Screen name="InfoPersoParent" component={InfoPersoParentScreen} />
        <Stack.Screen name="InfoPersoBaby" component={InfoPersoBabyScreen} />
        <Stack.Screen name="DashboardParent" component={DashboardParentScreen} />
        <Stack.Screen name="DashboardBaby" component={DashboardBabyScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
