import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

// Ce composant représente un bloc cliquable (une "carte") servant à afficher
// une information synthétique : par exemple le nombre de messages non lus,
// de propositions, ou toute autre statistique importante.
// - Titre (ex: "Messages")
// - Sous-titre conditionnel ("Non lus") affiché uniquement si le titre est "Messages" et count > 0
// - Pastille circulaire qui contient le compteur (props.count).
// - Couleurs et styles adaptés selon l’état (0 = gris neutre, sinon props.colorCount).

export default function GuardComponent(props) {
  const handleClick = () => {
    props.click();
  };

  return (
    <TouchableOpacity
      style={[styles.guardComponentContainer, props.guardStyle]}
      onPress={() => handleClick()}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
        <View style={styles.noRead}>
          <Text
            style={
              props.title === "Messages" && props.count !== 0
                ? styles.secondaryTitle
                : styles.secondaryTitleNone
            }
          >
            Non lus
          </Text>
        </View>
      </View>
      <View style={styles.mainContent}>
        <View
          style={[
            styles.countContainer,
            {
              ...(props.count === 0
                ? { backgroundColor: "#EBE6DA" }
                : { backgroundColor: props.colorCount }),
            },
          ]}
        >
          <Text style={styles.count}>{props.count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  guardComponentContainer: {
    backgroundColor: "#FFFBF0", //couleur à passer en #98C2E6 si c'est un parent ou #EBE6DA
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 15,
    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#98C2E6",
  },
  header: {
    width: "100%",
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 26,
    fontWeight: "700",
  },
  noRead: {
    height: 20,
  },
  secondaryTitle: {
    fontFamily: "Montserrat",
  },
  secondaryTitleNone: {
    display: "none",
  },
  mainContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  countContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 55,
    height: 55,
    backgroundColor: "#EBE6DA",
  },
  count: {
    fontFamily: "Montserrat",
    fontSize: 26,
    fontWeight: "700",

    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
