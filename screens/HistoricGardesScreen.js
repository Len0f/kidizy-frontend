import { Image, StyleSheet, SafeAreaView, Text, View } from "react-native";
import UserCard from "../components/userCard";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import { useSelector } from "react-redux";

export default function HistoricGardesScreen() {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.value);

  const [Gardes, setGardes] = useState([]);

  // Data et Couleur change selon le type de profil
  const { profil } = useUser();
  const buttonColor = profil === "parent" ? "#98C2E6" : "#88E19D";

  // Chargement des gardes depuis l’API (une fois au montage)
  useEffect(() => {
    fetch(`${API_URL}gardes/new/id?token=${user.token}&id=${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        // On transforme chaque garde en composant <UserCard />
        const garde = data.garde.map((g, i) => {
          if (profil === "parent") {
            // Vue PARENT : on montre le babysitter
            return (
              <UserCard
                key={i}
                avatar={g.idUserBabysitter.avatar}
                name={`${g.idUserBabysitter.firstName} ${g.idUserBabysitter.lastName}`}
                age={g.idUserBabysitter.babysitterInfos.age}
                guards={"0"} // compteur affiché (non connecté ici)
                btnTitle="Voir"
                userColor={buttonColor}
                onPress={() =>
                  navigation.navigate("Garde", {
                    from: "Contacts",
                    profil,
                    infoGarde: g,
                  })
                }
              />
            );
          } else {
            // Vue BABYSITTER : on montre le parent
            return (
              <UserCard
                key={i}
                avatar={g.idUserParent.avatar}
                name={`${g.idUserParent.firstName} ${g.idUserParent.lastName}`}
                guards={"0"}
                btnTitle="Voir"
                userColor={buttonColor}
                onPress={() =>
                  navigation.navigate("Garde", {
                    from: "Contacts",
                    profil,
                    infoGarde: g,
                  })
                }
              />
            );
          }
        });
        setGardes(garde); // On stocke directement le JSX à afficher
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/KidizyLogo.png")}
        />
        <Text style={styles.screenTitle}>Gardes</Text>
      </View>

      <View>{Gardes}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFBF0",
  },

  header: {
    alignItems: "center",
    marginBottom: 16,
  },

  logo: {
    marginTop: 50,
    height: 50,
    resizeMode: "contain",
  },

  screenTitle: {
    fontFamily: "Montserrat",
    fontSize: 25,
    fontWeight: "700",
    marginTop: 30,
  },
});
