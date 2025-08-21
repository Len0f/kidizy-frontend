import { Text, TouchableOpacity, StyleSheet } from "react-native";

// Ce composant affiche un bouton rond avec la lettre "i" (pour "information").
// Quand on clique dessus, il exécute la fonction `props.returnScreen()` reçue du parent.

export default function InfoBtn(props) {
  const handleReturn = () => {
    props.returnScreen();
  };

  return (
    <TouchableOpacity
      style={styles.btnContainer}
      onPress={() => handleReturn()}
    >
      <Text style={styles.i}>i</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#EBE6DA", //couleur à passer en #98C2E6 si c'est un parent ou #EBE6DA
    borderRadius: 30,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  i: {
    textAlign: "center",
    padding: 5,
    width: 40,
    height: 40,
    borderRadius: 50,
    fontFamily: "Montserrat",
    fontSize: 30,
    fontWeight: "700",
    backgroundColor: "#979797",
    borderRadius: 50,
    color: "#EBE6DA",
  },
});
