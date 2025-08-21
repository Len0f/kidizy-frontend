import { TextInput, View, StyleSheet, Text } from "react-native";
import { useState } from "react";

// Input permettant la saisie de textes longs (ex: commentaires).
//
// Améliorations par rapport à la version simple :
// - Support du mode `multiline={true}` et `numberOfLines={8}` pour agrandir la zone de saisie.
// - `maxLength` limité à 350 caractères pour éviter des textes trop longs.
// - La hauteur est personnalisable via la prop `height`.

export default function Input(props) {
  const [actif, setActif] = useState(false); // état qui détermine si le label s'affiche
  const [text, setText] = useState(""); // état interne (non utilisé pour value -> contrôlé par parent)

  const handleClick = () => {
    if (text != "") {
      return;
    }
    setActif(!actif);
  };

  // Choix du placeholder affiché
  let titre = props.placeholder;
  if (!props.placeholder) {
    titre = props.name;
  }

  return (
    <View style={styles.container} width={props.width}>
      {actif ? (
        <View style={styles.containLabel}>
          <Text style={[styles.label, props.userStyle]}>{props.name}</Text>
        </View>
      ) : null}
      <TextInput
        style={styles.textInput}
        height={props.height}
        onFocus={() => handleClick()}
        onBlur={() => handleClick()}
        editable
        multiline={true}
        numberOfLines={8}
        maxLength={350}
        placeholder={titre}
        placeholderTextColor={"#979797"}
        onChangeText={(value) => props.setText(value)}
        value={props.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: 15,
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative",
  },
  textInput: {
    height: 60,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#EBE6DA",
    fontFamily: "Montserrat",
    paddingLeft: 18,
    fontSize: 18,
  },
  label: {
    height: 20,
    width: "100%",
    textAlign: "left",
    margin: 5,
    zIndex: 1,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  containLabel: {
    padding: 0,
    margin: 0,
    backgroundColor: "#FFFBF0",
    borderRadius: 50,
    position: "absolute",
    top: 0,
    left: 15,
    zIndex: 1,
  },
});
