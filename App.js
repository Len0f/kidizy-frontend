import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider, useUser } from './contexts/UserContext';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// redux
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
import { getDevApiUrl } from './utils/constants';
export const url = getDevApiUrl();

const store = configureStore({
  reducer: { user },
});

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

// Router avec onglets dynamiques selon le profil
const TabsRouter = () => {
  const { profil } = useUser(); // 'parent' ou 'babysitter'

  const userColor = profil === 'parent' ? '#98C2E6' : '#88E19D';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
          } else if (route.name === 'ProfilUser') {
            iconName = 'user';
          } else if (route.name === 'Contacts') {
            iconName = 'comment';
          } else if (route.name === 'Search') {
            iconName = 'tag';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { borderTopWidth: 0 },
        tabBarActiveTintColor: userColor,
        tabBarInactiveTintColor: '#979797',
        tabBarActiveBackgroundColor: '#FFFBF0',
        tabBarInactiveBackgroundColor: '#EBE6DA',
        tabBarLabelStyle: { fontFamily: 'Montserrat', fontWeight: '500', fontSize: 14 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} options={{ title: 'Dashboard' }} />

      {/* ➜ Calendrier visible uniquement si le profil n'est PAS parent */}
      {profil !== 'parent' && (
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendrier' }} />
      )}

      {profil === 'parent' ? (
        <>
          <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Recherche' }} />
          <Tab.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Messagerie' }} />
        </>
      ) : (
        <>
          <Tab.Screen name="ProfilUser" component={ProfilScreen} options={{ title: 'Votre profil' }} />
          <Tab.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Messagerie' }} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default function App() {
  console.log('API URL:', url); // Log the API URL to verify it's correct

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
    <Provider store={store}>
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
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Garde" component={GardeScreen} />
            <Stack.Screen name="Notation" component={NotationScreen} />
            <Stack.Screen name="ProfilUser" component={ProfilScreen} />
            <Stack.Screen name="ProfilBook" component={ProfilBookScreen} />

            {/* Screen Parents */}
            <Stack.Screen name="Pay" component={PayScreen} />

            {/* Screen Baby */}
            <Stack.Screen name="PreviewParent" component={PreviewParentScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </Provider>
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
