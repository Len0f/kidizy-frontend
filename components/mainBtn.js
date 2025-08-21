import { Text, TouchableOpacity, StyleSheet } from "react-native";

// Bouton principal réutilisable pour toute l’application.
// - Peut afficher un simple texte OU un composant (ex: une icône).
// - Gère le disabled (désactive l’action et change l’accessibilité).
// - Props userStyle et textStyle pour personnaliser selon le contexte.
// - Accessible (accessibilityRole='button').

export default function MainBtn(props) {
  const handleClick = () => {
    if (props.disabled) return;
    if (typeof props.clickNav === "function") props.clickNav();
  };

  // Contenu du bouton :
  // - si c’est une string, on la rend dans <Text>
  // - sinon on affiche directement (ex: une icône FontAwesome)
  const content =
    typeof props.btnTitle === "string" ? (
      <Text style={[styles.text, props.textStyle]}>{props.btnTitle}</Text>
    ) : (
      props.btnTitle
    ); // pour faire <view>FontAwersome.../></view>

  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={[styles.btnContainer, props.userStyle]}
      onPress={() => handleClick()}
      accessibilityRole="button"
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#88E19D", //couleur à passer en #98C2E6 si c'est un parent ou #EBE6DA
    alignItems: "center",
    borderRadius: 8,
    padding: 15,
    width: "100%",
  },
  text: {
    fontSize: 22,
    color: "#263238",
    fontWeight: "800",
    fontFamily: "Montserrat",
  },
});
