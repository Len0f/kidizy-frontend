import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider, useUser } from './contexts/UserContext';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();


// Écrans de connexion / inscription
import ConnexionScreen from './screens/ConnexionScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import InfoInscriptScreen from './screens/InfoInscriptScreen';
import SelectProfilScreen from './screens/SelectProfilScreen';

// Dashboards
import DashboardScreen from './screens/DashboardScreen';

import CalendarScreen from './screens/CalendarScreen';
import ChatScreen from './screens/ChatScreen';
import ContactsScreen from './screens/ContactsScreen';
import GardeScreen from './screens/Gardes';
import HistoricGardesScreen from './screens/HistoricGardesScreen';
import NotationScreen from './screens/NotationScreen';
import ProfilBookScreen from './screens/ProfilBookScreen';
import ProfilScreen from './screens/ProfilScreen';

// Screens Parent.
import PayScreen from './screens/PayScreen';
import SearchScreen from './screens/SearchScreen';

// Screens Baby.
import PreviewParentScreen from './screens/PreviewParentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// Stack imbriqué dans le tab dashboard
const DashboardStack = createNativeStackNavigator();

const DashboardStackScreen = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
      <DashboardStack.Screen name="HistoricGardes" component={HistoricGardesScreen} />
    </DashboardStack.Navigator>
  );
};

// On fait un routeur pour avoir les bons onglets selon le profil.
const TabsRouter = () => {
  const { profil } = useUser();

  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Dashboard" component={DashboardStackScreen}/>
      <Tab.Screen name="Calendar" component={CalendarScreen}/>
      {profil === 'parent' ? (
        <>
          <Tab.Screen name="Search" component={SearchScreen}/>
          <Tab.Screen name="Contacts" component={ContactsScreen}/>
        </>
      ) : (
        <>
          <Tab.Screen name="ProfilUser" component={ProfilScreen} />
          <Tab.Screen name="Contacts" component={ContactsScreen} />
        </>
      )}
    </Tab.Navigator>

  )
}

export default function App() {

  const [loaded, error] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <UserProvider>

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Connection/Inscription */}
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} />
          <Stack.Screen name="SelectProfil" component={SelectProfilScreen} />
          <Stack.Screen name="InfoInscript" component={InfoInscriptScreen} />

          {/* Tab */}
          <Stack.Screen name="TabNavigator" component={TabsRouter} />

          {/* Screens communs. */}
          <Stack.Screen name="Chat" component={ChatScreen}/>
          <Stack.Screen name="Garde" component={GardeScreen}/>
          <Stack.Screen name="Notation" component={NotationScreen}/>
          <Stack.Screen name="ProfilUser" component={ProfilScreen}/>
          <Stack.Screen name="ProfilBook" component={ProfilBookScreen}/>

          {/* Screen Parents */}
          <Stack.Screen name="Pay" component={PayScreen}/>

          {/* Screen Baby */}
          <Stack.Screen name="PreviewParent" component={PreviewParentScreen}/>


        </Stack.Navigator>
      </NavigationContainer>
      
    </UserProvider>
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
