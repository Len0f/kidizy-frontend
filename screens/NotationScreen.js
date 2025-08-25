import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Input from "../components/InputLarge";
import MainBtn from "../components/mainBtn";
import { API_URL } from "../api/config";
import { useSelector } from "react-redux";

// ----------- Utilitaires de formatage
// Formatage en devise (ex: 12 -> "12€", 12.5 -> "12,50€")
const formatCurrency = (n) => {
  const x = Number(n) || 0;
  return Number.isInteger(x) ? `${x}€` : `${x.toFixed(2).replace(".", ",")}€`;
};

// Normalisation du taux horaire (si données incohérentes)
const normalizeHourlyRate = (raw) => {
  const r = Number(raw);
  if (!Number.isFinite(r) || r <= 0) return 0;
  if (r >= 8 && r <= 80) return r; // plage réaliste €/h
  // sinon on essaie de trouver une valeur plausible en corrigeant l’unité
  const candidates = [r / 100, r * 60, r * 3600, r * 1000, r * 10000];
  const plausible = candidates.find((v) => v >= 8 && v <= 80);
  return plausible ?? r;
};

export default function NotationScreen({ navigation, route }) {
  const { profil } = useUser();
  const { infoGarde } = route.params;

  // ----------------- États locaux
  const [personalStar, setPersonalStar] = useState(0); // rating par étoiles
  const [text, setText] = useState(""); // avis écrit
  const [prenom, setPrenom] = useState("");
  const [avatar, setAvatar] = useState("");
  const [payer, setPayer] = useState(""); // "Total dû" ou "Total à percevoir"

  const user = useSelector((state) => state.user.value);

  // Initialisation selon le type de profil
  useEffect(() => {
    if (profil === "parent") {
      setAvatar(infoGarde.idUserBabysitter.avatar);
      setPrenom(infoGarde.idUserBabysitter.firstName);
      setPayer("Total dû :");
    } else {
      setAvatar(infoGarde.idUserParent.avatar);
      setPrenom(infoGarde.idUserParent.firstName);
      setPayer("Total a percevoir :");
    }
  }, []);

  // ----------------- Variables calculées
  const cost = Number(infoGarde.idUserBabysitter.babysitterInfos.price) || 0;
  const billedHours = Number(route?.params?.billedHours) || 0;
  const elapsedMs = Number(route?.params?.elapsedMs) || 0;

  // ----------------- Envoi au backend
  const handleSubmit = () => {
    fetch(`${API_URL}gardes/${infoGarde._id}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        rating: personalStar,
        avis: text,
        idUserBabysitter: infoGarde.idUserBabysitter._id,
        idUserParent: infoGarde.idUserParent._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("clic", data);
        if (data.result) {
          navigation.navigate("Dashboard"); // retour au dashboard
        }
      });
  };

  const color = profil === "parent" ? "#98C2E6" : "#88E19D";

  // Conversion ms → HH:MM:SS (durée réelle de la garde)
  const formatHMS = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  // Génération dynamique des 5 étoiles cliquables
  const stars = [];
  for (let i = 1; i < 6; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name="star"
        size={60}
        color={i <= personalStar ? color : "#323232"}
        onPress={() => setPersonalStar(i)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <SafeAreaView style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{ uri: avatar }} />
          <Text style={styles.avatarName}>{prenom}</Text>
        </SafeAreaView>

        <View style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color }]}>
            Résumé de la garde
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Durée réelle</Text>
            <Text style={styles.summaryValue}>{formatHMS(elapsedMs)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Durée facturée</Text>
            <Text style={styles.summaryValue}>{`${billedHours} h`}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taux horaire</Text>
            <Text
              style={styles.summaryValue}
            >{`${infoGarde.idUserBabysitter.babysitterInfos.price}/h`}</Text>
          </View>

          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={[styles.summaryLabel, styles.summaryTotalLabel]}>
              {payer}
            </Text>
            <Text style={[styles.summaryValue, styles.summaryTotalValue]}>
              {formatCurrency(cost)}
            </Text>
          </View>
        </View>

        <View style={styles.containeText}>
          <Text style={styles.text}>
            Comment s'est déroulé votre expérience ?
          </Text>
        </View>

        <View style={styles.etoiles}>{stars}</View>

        <View style={styles.containeIB}>
          <View style={styles.containeInput}>
            <Input
              name="Avis"
              setText={setText}
              text={text}
              userStyle={{ color }}
            />
          </View>
          <View style={styles.containeBtn}>
            <MainBtn
              userStyle={{ backgroundColor: color }}
              btnTitle="Soumettre"
              clickNav={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  avatar: {
    borderRadius: 100,
    width: 150,
    height: 150,
    objectFit: "contain",
    margin: 10,
  },
  avatarName: { fontFamily: "Montserrat", fontSize: 30, fontWeight: "700" },

  // ---- Résumé
  summaryCard: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e6e2d9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 18,
  },
  summaryTitle: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: { fontFamily: "Montserrat", fontSize: 14, color: "#444" },
  summaryValue: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#111",
    fontWeight: "700",
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 6,
    paddingTop: 10,
  },
  summaryTotalLabel: { fontSize: 16 },
  summaryTotalValue: { fontSize: 16 },

  containeText: { marginVertical: 25, alignItems: "center" },
  text: { fontFamily: "Montserrat", fontSize: 15, fontWeight: "700" },
  etoiles: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  containeIB: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  containeInput: { width: "90%", maxWidth: "90%" },
  containeBtn: { width: "90%", marginTop: 25 },
});
