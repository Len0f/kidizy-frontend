import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import MainBtn from "../components/mainBtn";

export default function PayScreen({ navigation }) {
  // Bouton "Annuler" -> retour à l’écran précédent
  const handleCancel = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Image
              style={styles.logo}
              source={require("../assets/KidizyLogo.png")}
            />
          </View>
          <TouchableOpacity style={styles.cancelWrapper} onPress={handleCancel}>
            <Text style={styles.cancel}>Annuler</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.block}>
            <Text style={styles.title}>Souscription</Text>
            <Text style={styles.price}>9,99€/ mois</Text>
          </View>

          <Text style={styles.subtitle}>Choisissez un mode de paiement:</Text>

          <View style={styles.buttons}>
            <MainBtn
              btnTitle="PayPal"
              userStyle={styles.payBtn}
              clickNav={handleCancel}
            />
            <MainBtn
              btnTitle="Google Pay"
              userStyle={styles.payBtn}
              clickNav={handleCancel}
            />
            <MainBtn
              btnTitle="Apple pay"
              userStyle={styles.payBtn}
              clickNav={handleCancel}
            />
            <MainBtn
              btnTitle="Payer par carte"
              userStyle={styles.payBtn}
              clickNav={handleCancel}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFBF0",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: "#FFFBF0",
    flexGrow: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    justifyContent: "center",
    position: "relative",
  },
  logoWrapper: {
    alignItems: "center",
    flex: 1,
  },
  logo: {
    height: 56,
    width: 180,
    resizeMode: "contain",
    marginTop: 120,
  },
  cancelWrapper: {
    position: "absolute",
    right: 0,
  },
  cancel: {
    fontSize: 14,
    color: "#222",
  },
  content: {
    flex: 1,
    marginTop: 120,
    alignItems: "center",
  },
  block: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
    textAlign: "center",
  },
  price: {
    fontSize: 14,
    color: "#6b6b6b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  buttons: {
    width: "100%",
    gap: 14,
    alignItems: "center",
  },
  payBtn: {
    backgroundColor: "#98C2E6",
    borderRadius: 10,
    paddingVertical: 14,
    width: "100%",
  },
});
