import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
  View,
} from "react-native";

// Ce bouton permet à l’utilisateur d’accéder directement au site officiel du Casier Judiciaire National, via un lien externe.
// L’ouverture est sécurisée avec Linking.canOpenURL (contrôle préalable).

export default function FranceConnectBtn() {
  const handleSummit = async () => {
    const url = "https://casier-judiciaire.justice.gouv.fr/";

    try {
      const supported = await Linking.canOpenURL(url); // vérifie si le lien peut être ouvert
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  };

  return (
    <TouchableOpacity
      onPress={() => handleSummit()}
      style={styles.btnContainer}
    >
      <Image
        style={styles.logoFranceConnect}
        source={require("../assets/Logo_FranceConnect.svg.png")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.textBtn2}> Ici</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoFranceConnect: {
    objectFit: "contain",
    width: 40,
    height: 40,
  },
  btnContainer: {
    borderWidth: 2,
    borderColor: "#040493",
    backgroundColor: "#FFF", //couleur à passer en #98C2E6 si c'est un parent ou #EBE6DA
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textBtn1: {
    color: "#040493",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Montserrat",
  },
  textBtn2: {
    color: "#E1000F",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Montserrat",
  },
});
