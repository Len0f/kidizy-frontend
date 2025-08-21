import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Bouton de connexion avec un joli dégradé.
// Utilise LinearGradient (expo-linear-gradient) pour un rendu plus moderne.

export default function SignBtn(props) {
  const handleConnection = () => {
    props.connection();
  };

  return (
    <TouchableOpacity onPress={() => handleConnection()}>
      <LinearGradient
        // Button Linear Gradient
        colors={["#88E19D", "#98C2E6"]}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
      >
        <Text style={styles.text}>Connexion</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    height: 60,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 22,
    color: "#263238",
    fontWeight: "800",
    fontFamily: "Montserrat",
  },
});
