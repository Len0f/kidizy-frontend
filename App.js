import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Écrans de connexion / inscription
import ConnexionScreen from './screens/ConnexionScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import InfoInscriptBabyScreen from './screens/InfoInscriptBabyScreen';
import InfoInscriptParentScreen from './screens/InfoInscriptParentScreen';
import SelectProfilScreen from './screens/SelectProfilScreen';

// Dashboards
import DashboardBabyScreen from './screens/DashboardBabyScreen';
import DashboardParentScreen from './screens/DashboardParentScreen';

// Screens communs.
import CalendarScreen from './screens/CalendarScreen';
import ChatScreen from './screens/ChatScreen';
import ContactsScreen from './screens/ContactsScreen';
import GardeScreen from './screens/Gardes';
import HistoricGardesScreen from './screens/HistoricGardesScreen';
import NotationScreen from './screens/NotationScreen';

// Screens Parent.
import PayScreen from './screens/PayScreen';
import ProfilBabyBookScreen from './screens/ProfilBabyBook';
import ProfilParentScreen from './screens/ProfilParentScreen';
import SearchScreen from './screens/SearchScreen';

// Screens Baby.
import ProfilBabyScreen from './screens/ProfilBabyScreen';
import PreviewParentScreen from './screens/PreviewParentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// Stack imbriqué dans le tab parent
const ParentStack = createNativeStackNavigator();

const ParentStackScreen = () => {
  return (
    <ParentStack.Navigator screenOptions={{ headerShown: false }}>
      <ParentStack.Screen name="DashboardParentHome" component={DashboardParentScreen} />
      <ParentStack.Screen name="HistoricGardes" component={HistoricGardesScreen} />
    </ParentStack.Navigator>
  );
};

// Permet de garder le même screen mais mettre des conditions selon les profils.
const CalendarScreenParent = (props) => (
  <CalendarScreen {...props} route={{ ...props.route, params: { profil: 'parent' } }} />
);
const CalendarScreenBaby = (props) => (
  <CalendarScreen {...props} route={{ ...props.route, params: { profil: 'babysitter' } }} />
);



// Tab Parent.
const TabNavigatorParent = () => {
  return (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen name="DashboardParent" component={ParentStackScreen}/>
    <Tab.Screen name="Calendar" component={CalendarScreenParent}/>
    <Tab.Screen name="Search" component={SearchScreen}/>
    <Tab.Screen name="Contacts" component={ContactsScreen}/>
  </Tab.Navigator>
  );
}

// Tab Babysitter.
const TabNavigatorBaby = () => {
  return (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen name="DashboardBaby" component={DashboardBabyScreen}/>
    <Tab.Screen name="Calendar" component={CalendarScreenBaby}/>
    <Tab.Screen name="ProfilBaby" component={ProfilBabyScreen}/>
    <Tab.Screen name="Contacts" component={ContactsScreen}/>
  </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Connection/Inscription */}
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="SelectProfil" component={SelectProfilScreen} />
        <Stack.Screen name="InfoInscriptParent" component={InfoInscriptParentScreen} />
        <Stack.Screen name="InfoInscriptBaby" component={InfoInscriptBabyScreen} />

        {/* Dashboard */}
        <Stack.Screen name="TabNavigatorParent" component={TabNavigatorParent} />
        <Stack.Screen name="TabNavigatorBaby" component={TabNavigatorBaby} />

        {/* Screens communs. */}
        <Stack.Screen name="Chat" component={ChatScreen}/>
        <Stack.Screen name="Garde" component={GardeScreen}/>
        <Stack.Screen name="Notation" component={NotationScreen}/>
        <Stack.Screen name="ProfilBabyBook" component={ProfilBabyBookScreen}/>

        {/* Screen Parents */}
        <Stack.Screen name="Pay" component={PayScreen}/>
        <Stack.Screen name="ProfilParent" component={ProfilParentScreen}/>

        {/* Screen Baby */}
        <Stack.Screen name="PreviewParent" component={PreviewParentScreen}/>


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
