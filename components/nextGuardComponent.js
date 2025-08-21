import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

// Composant réutilisable qui affiche la prochaine garde (ou un événement prévu).
// Permet un clic pour accéder à plus de détails (via props.click).

export default function NextGuardComponent(props) {
  const handleClick = () => {
    props.click();
  };

  return (
    <TouchableOpacity
      style={[styles.guardComponentContainer, props.guardStyle]}
      onPress={() => handleClick()}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={[styles.nextGuardDate, props.dateStyle]}>
          {props.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  guardComponentContainer: {
    backgroundColor: "#FFFBF0", //couleur à passer en #98C2E6 si c'est un parent ou #EBE6DA
    borderRadius: 8,
    padding: 15,
    width: "91%",
    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#98C2E6",
    marginBottom: 15,
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 15,
  },
  nextGuardDate: {
    fontFamily: "Montserrat",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "#98C2E6",
    padding: 10,
    borderRadius: 8,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});
