import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import ReturnBtn from "../components/returnBtn";
import InfoBtn from "../components/infoBtn";
import MainBtn from "../components/mainBtn";
import TextInfo from "../components/TextInfo";
import Input from "../components/Input";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useSelector } from "react-redux";
import { API_URL } from "../api/config";

export default function PreviewParentScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const { profil } = useUser();
  const { proposition } = route.params || "";

  // --- État local pour stocker les infos de la proposition
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [day, setDay] = useState("");
  const [hours, setHours] = useState("");
  const [enfant, setEnfant] = useState("");
  const [comment, setComment] = useState("");
  const [avatar, setAvatar] = useState("");

  // --- Chargement des données si profil = babysitter
  useEffect(() => {
    if (profil === "babysitter") {
      fetch(`${API_URL}propositions/id?token=${user.token}&id=${proposition}`)
        .then((response) => response.json())
        .then((data) => {
          setNom(data.propo.lastName);
          setPrenom(data.propo.firstName);
          setDay(data.propo.day);
          setHours(data.propo.propoStart);
          setEnfant(data.propo.kids);
          setComment(data.propo.comment);
          setAvatar(data.propo.avatar);
        });
    }
  }, []);

  // --- Fonctions de navigation
  const returnScreen = () => {
    navigation.navigate("Contacts");
  };
  const goParentProfil = () => {
    navigation.navigate("ProfilBook");
  };

  // --- Accepter la proposition
  const accept = async () => {
    // Création d’une proposition validée
    const newProp = await fetch(`${API_URL}propositions`, {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        token: user.token,
        firstName: prenom,
        lastName: nom,
        kids: enfant,
        idUserParent: user.id,
        idUserBabysitter: user.selectedBabysitterId,
        day,
        propoStart: hours,
        propoEnd: hours,
        updatedAt: new Date(),
        comment,
      }),
    });
    const res = await newProp.json();

    if (res.result) {
      // Si acceptée, création d’une conversation liée
      const newConversation = await fetch(`${API_URL}conversations`, {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          token: user.token,
          idUserParent: user.id,
          idUserBabysitter: user.selectedBabysitterId,
          updatedAt: new Date(),
        }),
      });
      const resConv = await newConversation.json();

      // Redirige vers le chat avec cette nouvelle conversation
      navigation.navigate("Chat", {
        conversation: resConv.newConversation._id,
      });
    }
  };

  // --- Refuser = retour aux contacts
  const refus = () => {
    navigation.navigate("Contacts");
  };

  return (
    <View style={styles.container}>
      {profil === "babysitter" ? (
        <View>
          <SafeAreaView style={styles.btnReturnContainer}>
            <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen} />
          </SafeAreaView>
          <SafeAreaView style={styles.btnProfilContainer}>
            <InfoBtn style={styles.returnBtn} returnScreen={goParentProfil} />
          </SafeAreaView>
          <SafeAreaView style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: avatar }} />
            <Text style={styles.avatarName}>{prenom}</Text>
          </SafeAreaView>

          <View style={styles.mainContent}>
            <TextInfo
              title="Prenom"
              textContent={prenom}
              userStyle={{ color: "#88E19D" }}
              width={"43%"}
            />
            <TextInfo
              title="Nom"
              textContent={nom}
              userStyle={{ color: "#88E19D" }}
              width={"43%"}
            />
            <TextInfo
              title="Jour"
              textContent={day}
              userStyle={{ color: "#88E19D" }}
              width={"43%"}
            />
            <TextInfo
              title="Heure"
              textContent={hours}
              userStyle={{ color: "#88E19D" }}
              width={"43%"}
            />
            <TextInfo
              title="Nombre d'enfant"
              textContent={enfant}
              userStyle={{ color: "#88E19D" }}
              width={"90%"}
            />
            <TextInfo
              title="Commentaire"
              textContent={comment}
              userStyle={{ color: "#88E19D" }}
              width={"90%"}
            />
          </View>

          <View style={styles.mapContainer}>
            <MapView
              initialRegion={{
                latitude: 44.8643352091005,
                longitude: -0.5760245233606299,
                latitudeDelta: 0.0022,
                longitudeDelta: 0.0021,
              }}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  latitude: 44.8643352091005,
                  longitude: -0.5760245233606299,
                }}
                title={prenom}
              />
            </MapView>
          </View>
          <View style={styles.buttons}>
            <MainBtn
              btnTitle={"Accepter"}
              userStyle={{ width: "43%" }}
              clickNav={accept}
            />
            <MainBtn
              btnTitle={"Refuser"}
              userStyle={{ backgroundColor: "#EBE6DA", width: "43%" }}
              clickNav={refus}
            />
          </View>
        </View>
      ) : (
        <ScrollView>
          <SafeAreaView style={styles.btnReturnContainer}>
            <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen} />
          </SafeAreaView>
          <SafeAreaView style={styles.btnProfilContainer}>
            <InfoBtn style={styles.returnBtn} returnScreen={goParentProfil} />
          </SafeAreaView>
          <SafeAreaView style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={require("../assets/babysitter2.png")}
            />
            <Text style={styles.avatarName}>Prenom</Text>
          </SafeAreaView>

          <View style={styles.mainContent}>
            <Input name="Prenom" setText={setNom} text={nom} width={"43%"} />
            <Input name="Nom" setText={setPrenom} text={prenom} width={"43%"} />
            <Input name="Jour" setText={setDay} text={day} width={"43%"} />
            <Input name="Heure" setText={setHours} text={hours} width={"43%"} />
            <Input
              name="Nombre d'enfant"
              setText={setEnfant}
              text={enfant}
              width={"90%"}
            />
            <Input
              name="Commenaire"
              setText={setComment}
              text={comment}
              width={"90%"}
            />
          </View>

          <View style={styles.mapContainer}>
            <MapView
              initialRegion={{
                latitude: 44.8643352091005,
                longitude: -0.5760245233606299,
                latitudeDelta: 0.0022,
                longitudeDelta: 0.0021,
              }}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  latitude: 44.8643352091005,
                  longitude: -0.5760245233606299,
                }}
                title={prenom}
              />
            </MapView>
          </View>
          <View style={styles.buttons}>
            <MainBtn
              btnTitle={"Envoyer"}
              userStyle={{ backgroundColor: "#98C2E6" }}
              clickNav={accept}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF0",
    position: "relative",
  },
  btnReturnContainer: {
    position: "absolute",
    zIndex: 10,
    left: 0,
    marginLeft: 20,
  },
  btnProfilContainer: {
    position: "absolute",
    zIndex: 10,
    right: 0,
    marginRight: 20,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderRadius: 100,
    width: 150,
    height: 150,
    objectFit: "contain",
    margin: 10,
  },
  avatarName: {
    fontFamily: "Montserrat",
    fontSize: 30,
    fontWeight: "700",
  },
  mainContent: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    borderRadius: 8,
    width: "90%",
  },
  buttons: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  mapContainer: {
    height: 130,
    marginVertical: 10,
    alignItems: "center",
  },
});
