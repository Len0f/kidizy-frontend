import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import ReturnBtn from "../components/returnBtn";
import MainBtn from "../components/mainBtn";
import TextInfo from "../components/TextInfo";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect, useRef, useMemo } from "react";
import { useUser } from "../contexts/UserContext";
import { useSelector } from "react-redux";
import { API_URL } from "../api/config";

// ----------------- HELPERS
// const formatCurrency = (n) => {
//   const x = Number(n) || 0;
//   return Number.isInteger(x) ? `${x}€` : `${x.toFixed(2).replace('.', ',')}€`;
// };

// La fonction formatCurrency permet de transformer un nombre brut en montant affichable (ex: "12,50€").
// Dans notre cas, nous ne l’utilisons pas car les tarifs sont déjà normalisés et stockés directement dans la base de données.
// On laisse pour montrer qu'on a pensé à ce mode d'affichage pour une optimisation ultérieure.

// Normalise un taux horaire (ex: corrige si en centimes, secondes, ms)
const normalizeHourlyRate = (raw) => {
  const r = Number(raw);
  if (!Number.isFinite(r) || r <= 0) return 0;
  if (r >= 8 && r <= 80) return r;

  // sinon, on teste plusieurs conversions possibles
  const candidates = [r / 100, r * 60, r * 3600, r * 1000, r * 10000];
  const plausible = candidates.find((v) => v >= 8 && v <= 80);
  return plausible ?? r;
};

// Calcule le coût total en fonction du temps écoulé
const computeBilling = (elapsedMs, hourlyRate) => {
  const hoursExact = elapsedMs / 3_600_000;
  const billedHours = hoursExact > 0 ? Math.ceil(hoursExact) : 0;
  const cost = Number((billedHours * (Number(hourlyRate) || 0)).toFixed(2));
  return { hours: hoursExact, billedHours, cost };
};

export default function GardeScreen({ navigation, route }) {
  const { profil } = useUser();
  const infoGarde = route?.params?.infoGarde || null;
  const token = useSelector((state) => state.user.value.token);

  const userColor = profil === "parent" ? "#98C2E6" : "#88E19D";

  // Taux horaire normalisé
  const hourlyRate = normalizeHourlyRate(route?.params?.hourlyRate);

  // Timer gestion début/fin garde
  const [debutGarde, setDebutGarde] = useState(false);
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(0);
  const intervalIdRef = useRef(null);

  // Lance un interval pour incrémenter le timer
  useEffect(() => {
    if (start) {
      intervalIdRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 1000);
    }
    return () => clearInterval(intervalIdRef.current);
  }, [start]);

  // Début de garde : active le chrono
  const debutDeGarde = () => {
    setDebutGarde(true);
    setStart(true);
    startTimeRef.current = Date.now() - time; // permet pause/reprise si besoin
  };

  // Fin de garde : stoppe le chrono, calcule la facturation et redirige vers Notation
  const finDeGarde = () => {
    if (!debutGarde) return;
    const elapsedMs = Date.now() - startTimeRef.current;
    const { billedHours, cost } = computeBilling(elapsedMs, hourlyRate);

    setDebutGarde(false);
    setStart(false);

    navigation.navigate("Notation", {
      elapsedMs,
      billedHours,
      hourlyRate,
      cost,
      from: "Contacts",
      profil,
      infoGarde: infoGarde,
    });
  };

  // Formatage lisible HH:MM:SS du timer
  const formatTime = () => {
    const totalSeconds = Math.floor(time / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  // --------- LOCALISATION
  const routeLocation = route?.params?.location || null;
  const [userLocation, setUserLocation] = useState(null);

  // Récupère sa propre localisation depuis l’API
  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      if (!token) return;
      try {
        const r = await fetch(`${API_URL}users/me/${token}`);
        const j = await r.json();
        const loc = j?.user?.location;
        if (mounted && loc && (loc.lat || loc.lon)) {
          setUserLocation({
            address: loc.address || "",
            lat: loc.lat,
            lon: loc.lon,
          });
        }
      } catch (_) {}
    };
    if (!routeLocation) fetchMe();
    return () => {
      mounted = false;
    };
  }, [token, routeLocation]);

  // Conversion safe en nombre
  const toNum = (v) => {
    if (v === null || v === undefined) return null;
    const n = typeof v === "string" ? parseFloat(v) : v;
    return Number.isFinite(n) ? n : null;
  };

  // Résolution finale de la localisation (route > user > fallback Paris)
  const resolvedLocation = useMemo(() => {
    const src = routeLocation || userLocation;
    const lat = toNum(src?.lat);
    const lon = toNum(src?.lon);
    if (lat !== null && lon !== null)
      return { latitude: lat, longitude: lon, address: src?.address || "" };
    return { latitude: 48.8566, longitude: 2.3522, address: "" }; // fallback Paris
  }, [routeLocation, userLocation]);

  // Région affichée sur la carte
  const [region, setRegion] = useState({
    latitude: resolvedLocation.latitude,
    longitude: resolvedLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Mise à jour de la région quand la loc change
  useEffect(() => {
    setRegion((prev) => ({
      ...prev,
      latitude: resolvedLocation.latitude,
      longitude: resolvedLocation.longitude,
    }));
  }, [resolvedLocation.latitude, resolvedLocation.longitude]);

  const hasValidCoords =
    Number.isFinite(resolvedLocation.latitude) &&
    Number.isFinite(resolvedLocation.longitude);

  // --------- Navigation retour
  const { from } = route?.params || {};
  const returnScreen = () => {
    if (from === "Pay") navigation.navigate("Pay");
    else if (from === "HistoricGardes") navigation.navigate("HistoricGardes");
    else navigation.goBack();
  };

  // --------- Cas : pas d’info garde reçue
  if (!infoGarde) {
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.btnReturnContainer}>
          <ReturnBtn
            style={styles.returnBtn}
            returnScreen={() => navigation.goBack()}
          />
        </SafeAreaView>
        <View style={styles.screenTitleContainer}>
          <Text style={styles.screenTitle}>Aucune info de garde</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------- Rendu principal
  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.btnReturnContainer}>
        <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen} />
      </SafeAreaView>

      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitle}>Garde du jour :</Text>
      </View>

      <View style={styles.mainContent}>
        <TextInfo
          title={"Prénom"}
          textContent={infoGarde.proposition.firstName}
          userStyle={{ color: userColor }}
          width={"43%"}
        />
        <TextInfo
          title={"Nom"}
          textContent={infoGarde.proposition.lastName}
          userStyle={{ color: userColor }}
          width={"43%"}
        />
        <TextInfo
          title={"Jour"}
          textContent={infoGarde.proposition.day}
          userStyle={{ color: userColor }}
          width={"43%"}
        />
        <TextInfo
          title={"Heure"}
          textContent={infoGarde.proposition.propoStart}
          userStyle={{ color: userColor }}
          width={"43%"}
        />
        <TextInfo
          title={"Enfant(s) à garder"}
          textContent={infoGarde.proposition.kids}
          userStyle={{ color: userColor }}
          width={"90%"}
        />

        <TextInfo
          title={"Taux horaire"}
          textContent={infoGarde.idUserBabysitter.babysitterInfos.price}
          userStyle={{ color: userColor }}
          width={"43%"}
        />

        <TextInfo
          title={"Temps écoulé"}
          textContent={formatTime()}
          userStyle={{ color: userColor }}
          width={"43%"}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          mapType="hybrid"
          initialRegion={region}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {hasValidCoords && (
            <Marker
              coordinate={{
                latitude: resolvedLocation.latitude,
                longitude: resolvedLocation.longitude,
              }}
              title={
                resolvedLocation.address || infoGarde.proposition.firstName
              }
              description={
                resolvedLocation.address ? "Adresse de la garde" : undefined
              }
              pinColor={userColor}
            />
          )}
        </MapView>

        <TouchableOpacity
          onPress={() =>
            setRegion((prev) => ({
              ...prev,
              latitude: resolvedLocation.latitude,
              longitude: resolvedLocation.longitude,
            }))
          }
          style={styles.recenterBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.recenterText}>Recentrer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <MainBtn
          disabled={debutGarde}
          clickNav={debutDeGarde}
          btnTitle={debutGarde ? `Garde débutée : ${formatTime()}` : "Début"}
          userStyle={
            debutGarde
              ? { backgroundColor: "#EBE6DA", width: "auto" }
              : { backgroundColor: userColor, width: "43%" }
          }
        />
        <MainBtn
          clickNav={finDeGarde}
          style={styles.btn}
          btnTitle={"Fin"}
          userStyle={
            !debutGarde
              ? { backgroundColor: "#EBE6DA", width: "43%", marginTop: 20 }
              : { backgroundColor: userColor, width: "43%", marginTop: 20 }
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF0",
    position: "relative",
    alignItems: "center",
  },
  btnReturnContainer: {
    position: "absolute",
    zIndex: 10,
    left: 0,
    marginLeft: 20,
  },
  screenTitleContainer: { marginVertical: 50, justifyContent: "center" },
  screenTitle: { fontFamily: "Montserrat", fontSize: 28, fontWeight: "700" },
  buttons: {
    alignItems: "flex-end",
    width: "90%",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  btn: { marginBottom: 20, borderWidth: 1 },
  mainContent: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  map: { flex: 1, borderRadius: 8 },
  mapContainer: { height: 130, width: "90%", marginVertical: 10 },
  recenterBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e3e3",
  },
  recenterText: { fontSize: 12, color: "#333" },
});
