import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Pressable
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import ReturnBtn from "../components/returnBtn";
import InfoBtn from "../components/infoBtn";
import MainBtn from "../components/mainBtn";
import TextInfo from "../components/TextInfo";
import Input from "../components/Input";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useSelector } from "react-redux";
import { url } from "../App"; // Import the API URL from App.js

export default function PropositionScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const { profil } = useUser();
  const isParent = profil === "parent";
  const isBabysitter = profil === "babysitter";

  const {
    proposition, // pour les baby (lecture)
    firstName: firstNameParam, // pour parent
    lastName: lastNameParam,
    day: dayParam,
    hours: hoursParam,
    kids: kidsParam,
    comment: commentParam,
    idUserBabysitter: babysitterFromParams, // utile côté parent
  } = route?.params || {};

  // Etat d'affichages/édition
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [day, setDay] = useState("");
  const [hours, setHours] = useState("");
  const [enfant, setEnfant] = useState("");
  const [comment, setComment] = useState("");
  const [lat, setLat]=useState('');
  const [lon, setLon]=useState('')
 

  // Ids pour créer la conversation après acceptation
  const [parentId, setParentId] = useState(user.id || "");
  const [babysitterId, setBabysitterId] = useState(
    babysitterFromParams || user.selectedBabysitterId || ""
  );

  const [loading, setLoading] = useState(false);

  // AJOUT 14/08 : Pour gérer les dates.
  const [dayDate, setDayDate]   = useState(new Date());
  const [timeDate, setTimeDate] = useState(new Date());
  const [showDay, setShowDay]   = useState(false);
  const [showTime, setShowTime] = useState(false);

  const pad = (n)=>String(n).padStart(2,'0');
  const toYYYYMMDD = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const fmtHeure   = d => {
    const h = pad(d.getHours()), m = pad(d.getMinutes());
    return m === '00' ? `${h}h` : `${h}h${m}`;
  };

  // ----------------- PARENT : préremplir depuis route.params
  useEffect(() => {
    if (!isParent) return;
    fetch(`${url}users/me/${user.token}`)
        .then(response=>response.json())
        .then(data=>{
            setLat(data.user.location.lat)
            setLon(data.user.location.lon)
        })
    setNom(lastNameParam || "");
    setPrenom(firstNameParam || "");
    setDay(dayParam || "");
    setHours(hoursParam || "");
    setEnfant(String(kidsParam ?? ""));
    setComment(commentParam || "");
    setParentId((prev) => prev || user.id || "");
    setBabysitterId(
      (prev) => prev || babysitterFromParams || user.selectedBabysitterId || ""
    );
  }, [
    isParent,
    firstNameParam,
    lastNameParam,
    dayParam,
    hoursParam,
    kidsParam,
    commentParam,
    babysitterFromParams,
    user.id,
    user.selectedBabysitterId,
  ]);

  // ------------------ BABYSITTER : Chargement de la proposition existante.
  useEffect(() => {
    if (isBabysitter && proposition) {
      fetch(`${url}propositions/id?token=${user.token}&id=${proposition}`)
        .then((response) => response.json())
        .then((data) => {
          setNom(data.propo.lastName || "");
          setPrenom(data.propo.firstName || "");
          setDay(data.propo.day || "");
          setHours(data.propo.propoStart || "");
          setEnfant(String(data.propo.kids ?? ""));
          setComment(data.propo.comment || "");
          setLat(data.propo.idUserParent.location.lat);
          setLon(data.propo.idUserParent.location.lon)
          

          // ids utiles pour ChatScreen si besoin
          setParentId(
            data.propo.idUserParent?._id || data.propo.idUserParent || parentId
          );
          setBabysitterId(
            data.propo.idUserBabysitter?._id ||
            data.propo.idUserBabysitter ||
            babysitterId
          );
        });
    }
  }, [isBabysitter, proposition, user.token]);

  const returnScreen = () => {
    navigation.navigate("Contacts");
  };

  const goParentProfil = () => {
    navigation.navigate("ProfilBook");
  };

  // ------------------ PARENT : Créer une proposition.
  
  const createProposition = async () => {
    try {
      setLoading(true);
      
      // Pour envoyer la date dans la bdd au bon format.
      const dayToSend = (() => {
        const d = day ? new Date(day) : new Date(dayDate);
        d.setHours(0,0,0,0);
        return d;
      })();
      const timeToSend = hours || fmtHeure(timeDate);

      const newProp = await fetch(`${url}propositions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          idUserParent: user.id,
          idUserBabysitter: user.selectedBabysitterId,
          firstName: prenom,
          lastName: nom,
          kids: Number.isNaN(Number(enfant)) ? enfant : Number(enfant),
          // day,
          // propoStart: hours,
          // propoEnd: hours,
          day: dayToSend,
          propoStart: timeToSend,
          propoEnd: timeToSend,
          updatedAt: new Date(),
          comment,
        }),
      });

      const res = await newProp.json();
      if (res?.result) {
        Alert.alert("Envoyé", "Ta proposition a été envoyée.");
        returnScreen();
      } else {
        Alert.alert(
          "Erreur",
          res?.error || "Impossible de créer la proposition."
        );
      }
    } catch (e) {
      Alert.alert("Erreur réseau", e.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ BABYSITTER : MISE A JOUR DE LA PROPOSITION : ACCEPTED
  const accept = async () => {
    
   const accepted = await fetch(`${url}propositions/id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          id: proposition,
          status: "ACCEPTED",
        })
      });
      const acceptRes= await accepted.json()
      
      if (acceptRes.result){
        fetch(`${url}conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        idUserParent: parentId,
        idUserBabysitter: user.id,
        updatedAt: new Date(),
      })
    })
        fetch(`${url}gardes/new`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          token: user.token,
          idUserParent: parentId,
          idUserBabysitter: user.id,
          proposition,
          updatedAt: new Date(),
      }),
      })
      navigation.navigate('Dashboard')
      }
    }
      // On marque la proposition comme acceptée
      
       
  

  // ------------------ BABYSITTER : MISE A JOUR DE LA PROPOSITION : REFUSED + SUPPRESSION
  const refuse = async () => {
    if (!proposition) returnScreen();

    setLoading(true);

    // Mise à jour du status
    await fetch(`${url}propositions/id`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        id: proposition,
        status: "REFUSED",
      }),
    });

    // Suppression
    await fetch(`${url}propositions/${proposition}`, { method: "DELETE" });

    setLoading(false);
    returnScreen();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
        <Text style={styles.avatarName}>{prenom || "Prenom"}</Text>
      </SafeAreaView>

      {isParent ? (
        // --------- PARENT CREATION PROPO
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.mainContent}>
            <Input name="Prenom" setText={setNom} text={nom} width={"43%"} />
            <Input name="Nom" setText={setPrenom} text={prenom} width={"43%"} />

            {/* INPUT DATE */}
            {/* <Input name="Jour" setText={setDay} text={day} width={"43%"} />
            <Input name="Heure" setText={setHours} text={hours} width={"43%"} /> */}

            {/* -- FAUX INPUT "Jour" en pleine largeur -- */}
            <Pressable onPress={() => setShowDay(true)} style={styles.fakeInput}>
              <Text style={styles.fakeLabel}>Jour</Text>
              <Text style={styles.fakeValue}>
                {day ? toYYYYMMDD(new Date(day)) : toYYYYMMDD(dayDate)}
              </Text>
            </Pressable>

            {/* -- FAUX INPUT "Heure" en pleine largeur -- */}
            <Pressable onPress={() => setShowTime(true)} style={styles.fakeInput}>
              <Text style={styles.fakeLabel}>Heure</Text>
              <Text style={styles.fakeValue}>
                {hours || fmtHeure(timeDate)}
              </Text>
            </Pressable>

            {showDay && (
              <DateTimePicker
                value={day ? new Date(day) : dayDate}
                mode="date"
                display="default"
                onChange={(event, selected) => {
                  // sur Android, le picker se ferme tout seul
                  if (Platform.OS === 'android') setShowDay(false);
                  if (selected) {
                    setDayDate(selected);
                    setDay(selected.toISOString()); // on garde une valeur ISO propre
                  }
                }}
              />
            )}

            {showTime && (
              <DateTimePicker
                value={timeDate}
                mode="time"
                is24Hour
                minuteInterval={5}
                display="default"
                onChange={(event, selected) => {
                  if (Platform.OS === 'android') setShowTime(false);
                  if (selected) {
                    setTimeDate(selected);
                    setHours(fmtHeure(selected)); // "HHh" ou "HHhMM"
                  }
                }}
              />
            )}


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
              region={{
                latitude: 40,
                longitude: 39,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  latitude: 40,
                  longitude: 39,
                }}
                title={prenom}
              />
            </MapView>
          </View>

          <View style={styles.buttons}>
            <MainBtn
              btnTitle={"Envoyer"}
              userStyle={{ backgroundColor: "#98C2E6" }}
              clickNav={createProposition}
              disabled={loading}
            />
          </View>
        </ScrollView>
      ) : (
        // --------- BABYSITTER : lecture + actions
        <View>
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
              region={{
                latitude: parseFloat(lat),
                longitude: parseFloat(lat),
                latitudeDelta: 0.0022,
                longitudeDelta: 0.0021,
              }}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(lat),
                  longitude: parseFloat(lon),
                }}
                title={prenom || ""}
              />
            </MapView>
          </View>

          <View style={[styles.buttons, { gap: 12, paddingHorizontal: 20 }]}>
            <MainBtn
              btnTitle={loading ? "..." : "Accepter"}
              userStyle={{ width: "50%", backgroundColor: "#88E19D" }}
              clickNav={accept}
              disabled={loading}
            />
            <MainBtn
              btnTitle={"Refuser"}
              userStyle={{ width: "50%", backgroundColor: "#EBE6DA" }}
              clickNav={() => {
                if (loading) return;
                // Popup de conformation de suppression.
                Alert.alert(
                  "Refuser la proposition ?",
                  "Cette action supprime la demande.",
                  [{ text: "Annuler" }, { text: "Accepter", onPress: refuse }]
                );
              }}
              disabled={loading}
            />
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
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

  // AJOUT pour les Input Dates
  fakeInput: {
  width: '85%',
  height: 52,
  backgroundColor: '#EBE6DA',
  borderRadius: 12,
  alignSelf: 'center',
  justifyContent: 'center',
  paddingHorizontal: 14,
  marginTop: 20,
  },

fakeLabel: {
  position: 'absolute',
  top: -10,
  left: 14,
  fontSize: 12,
  color: '#8A8A8A',
},
fakeValue: {
  fontSize: 16,
  color: '#323232',
}
 
});
