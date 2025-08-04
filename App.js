import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Connection/Inscription jusqu'au dashboard.
import ConnexionScreen from './screens/ConnexionScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import SelectProfilScreen from './screens/SelectProfilScreen';
import InfoInscriptParentScreen from './screens/InfoInscriptParentScreen';
import InfoInscriptBabyScreen from './screens/InfoInscriptBabyScreen';
import DashboardParentScreen from './screens/DashboardParentScreen';
import DashboardBabyScreen from './screens/DashboardBabyScreen';

import CalendarScreen from './screens/CalendarScreen';
import ContactsScreen from './screens/ContactsScreen';

//Chemins à partir du dashboard Parent.
import ProfilParentScreen from './screens/ProfilParentScreen';
import RechercheScreen from './screens/RechercheScreen';

//Chemins à partir du dashboard Parent.
import ProfilBabyScreen from './screens/ProfilParentScreen';




const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//TabNavigation pour les parents.
const TabNavigatorParent = () => {
  return (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen name="DashboardParent" component={DashboardParentScreen}/>
    <Tab.Screen name="Calendar" component={CalendarScreen}/>
    <Tab.Screen name="Recherche" component={RechercheScreen}/>
    <Tab.Screen name="Contacts" component={ContactsScreen}/>
  </Tab.Navigator>
  );
}

//TabNavigation pour les babysitters.
const TabNavigatorBaby = () => {
  return (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen name="DashboardBaby" component={DashboardBabyScreen}/>
    <Tab.Screen name="Calendar" component={CalendarScreen}/>
    <Tab.Screen name="ProfilBaby" component={ProfilBabyScreen}/>
    <Tab.Screen name="Contacts" component={ContactsScreen}/>
  </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Connection/Inscription jusqu'au dashboard. */}
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="SelectProfil" component={SelectProfilScreen} />
        <Stack.Screen name="InfoInscriptParent" component={InfoInscriptParentScreen} />
        <Stack.Screen name="InfoInscriptBaby" component={InfoInscriptBabyScreen} />
        <Stack.Screen name="TabNavigatorParent" component={TabNavigatorParent} />
        <Stack.Screen name="TabNavigatorBaby" component={TabNavigatorBaby} />

        {/* Chemins à partir du dashboard Parent. */}

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
