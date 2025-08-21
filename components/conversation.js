import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import MainBtn from "./mainBtn";

// Ce composant affiche une "carte" représentant une conversation possible entre un parent et une babysitter (ou inversement).
// Il montre l’avatar, le nom de l’utilisateur et un bouton d’action (par ex. "Voir la conversation" ou "Contacter").

export default function Conversation(props) {
  // Fonction appelée quand on clique sur l’avatar → ouvre le profil
  const goProfil = () => {
    props.click();
  };

  return (
    <View style={styles.userContainer}>
      <View style={styles.userHeader}>
        <TouchableOpacity onPress={() => goProfil()}>
          <Image style={styles.avatar} source={{ uri: props.urlImage }} />
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.userName}>
            {props.firstName} {props.lastName}
          </Text>
        </View>
      </View>

      <View style={styles.userFooter}>
        <MainBtn
          clickNav={() => props.clickNav(props.convId)}
          style={styles.button}
          btnTitle={props.btnTitle}
          userStyle={{
            backgroundColor: props.userColor,
            paddingVertical: 6,
            paddingHorizontal: 12,
            width: "auto",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    width: "90%",
    backgroundColor: "#FFFBF0",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },

  userHeader: {
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  infoContainer: {
    flex: 1,
    marginHorizontal: 10,
  },

  userName: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "bold",
  },

  userDetails: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "400",
  },

  button: {
    height: 40,
    borderRadius: 100,
  },
});
