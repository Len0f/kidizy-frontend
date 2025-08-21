import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserProvider, useUser } from "./contexts/UserContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// ---------------- REDUX
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

// Récupération dynamique de l’URL API
import { getDevApiUrl } from "./utils/constants";
export const url = getDevApiUrl();

const store = configureStore({
  reducer: { user },
});

SplashScreen.preventAutoHideAsync(); // on garde l’écran de chargement tant que les fonts ne sont pas prêtes

// ---------------- IMPORT DES SCREENS
// Authentification
import ConnexionScreen from "./screens/ConnexionScreen";
import InscriptionScreen from "./screens/InscriptionScreen";
import InfoInscriptScreen from "./screens/InfoInscriptScreen";
import SelectProfilScreen from "./screens/SelectProfilScreen";

// Dashboard + autres pages
import DashboardScreen from "./screens/DashboardScreen";
import CalendarScreen from "./screens/CalendarScreen";
import ChatScreen from "./screens/ChatScreen";
import ContactsScreen from "./screens/ContactsScreen";
import GardeScreen from "./screens/Gardes";
import HistoricGardesScreen from "./screens/HistoricGardesScreen";
import NotationScreen from "./screens/NotationScreen";
import ProfilBookScreen from "./screens/ProfilBookScreen";
import ProfilScreen from "./screens/ProfilScreen";

// Screens Parent.
import PayScreen from "./screens/PayScreen";
import SearchScreen from "./screens/SearchScreen";

// Screens Babysitteur.
import PropositionScreen from "./screens/PropositionScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();

// ---------------- CONFIGURATION DES NAVIGATIONS
// Stack imbriqué dans le tab dashboard
const DashboardStackScreen = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
      <DashboardStack.Screen
        name="HistoricGardes"
        component={HistoricGardesScreen}
      />
    </DashboardStack.Navigator>
  );
};

// Navigation Tabs dynamique (selon profil parent ou babysitter)
const TabsRouter = () => {
  const { profil } = useUser(); // 'parent' ou 'babysitter' récupéré depuis le contexte

  const userColor = profil === "parent" ? "#98C2E6" : "#88E19D";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          // Choix des icônes
          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Calendar") {
            iconName = "calendar";
          } else if (route.name === "ProfilUser") {
            iconName = "user";
          } else if (route.name === "Contacts") {
            iconName = "comment";
          } else if (route.name === "Search") {
            iconName = "tag";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { borderTopWidth: 0 },
        tabBarActiveTintColor: userColor,
        tabBarInactiveTintColor: "#979797",
        tabBarActiveBackgroundColor: "#FFFBF0",
        tabBarInactiveBackgroundColor: "#EBE6DA",
        tabBarLabelStyle: {
          fontFamily: "Montserrat",
          fontWeight: "500",
          fontSize: 14,
        },
        headerShown: false,
      })}
    >
      {/* Onglet Dashboard (toujours présent) */}
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackScreen}
        options={{ title: "Dashboard" }}
      />

      {/* Onglet Calendrier visible uniquement pour les babysitters */}
      {profil !== "parent" && (
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ title: "Calendrier" }}
        />
      )}
      {/* Si profil = parent -> onglets recherche + messagerie */}
      {profil === "parent" ? (
        <>
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: "Recherche" }}
          />
          <Tab.Screen
            name="Contacts"
            component={ContactsScreen}
            options={{ title: "Messagerie" }}
          />
        </>
      ) : (
        // Sinon (babysitter) -> profil + messagerie
        <>
          <Tab.Screen
            name="ProfilUser"
            component={ProfilScreen}
            options={{ title: "Votre profil" }}
          />
          <Tab.Screen
            name="Contacts"
            component={ContactsScreen}
            options={{ title: "Messagerie" }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

// ---------------- COMPOSANT PRINCIPAL APP
export default function App() {
  // Chargement des fonts custom
  const [loaded, error] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // cache l’écran de chargement une fois prêt
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null; // on attend tant que les fonts ne sont pas chargées
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

            {/* Navigation par onglets */}
            <Stack.Screen name="TabNavigator" component={TabsRouter} />

            {/* Autres écrans accessibles depuis n’importe où */}
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Garde" component={GardeScreen} />
            <Stack.Screen name="Notation" component={NotationScreen} />
            <Stack.Screen name="ProfilUser" component={ProfilScreen} />
            <Stack.Screen name="ProfilBook" component={ProfilBookScreen} />
            <Stack.Screen name="Proposition" component={PropositionScreen} />
            <Stack.Screen name="Pay" component={PayScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
