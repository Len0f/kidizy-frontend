import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { useState, useEffect, useCallback, useRef } from "react";
import ReturnBtn from "../components/returnBtn";
import MainBtn from "../components/mainBtn";
import Input from "../components/Input";
import InputLarge from "../components/InputLarge";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FranceConnectBtn from "../components/franceConnectBtn";
import { useSelector } from "react-redux";
import { url } from "../App";
import * as ImagePicker from "expo-image-picker";

export default function ProfilScreen({ navigation }) {
  const { profil } = useUser();
  const [personalStar, setPersonalStar] = useState(3); // Note personnelle affichée en étoiles (par défaut 3)

  // ---- Données profil communes
  const [adresse, setAdresse] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [name, setName] = useState("");
  const [garde, setGarde] = useState(0);
  const [telephone, setTelephone] = useState("");
  const [lastEnfant, setLastEnfant] = useState([{ firstName: "", age: "" }]);

  // ---- Données babysitter
  const [age, setAge] = useState("");
  const [Biographie, setBiographie] = useState("");
  const [Interest, setInterest] = useState("");
  const [th, setTH] = useState(0);

  // ---- Uploads
  const [avatarLocal, setAvatarLocal] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [cniUrl, setCniUrl] = useState(null);
  const [casierUrl, setCasierUrl] = useState(null);
  const [cniLocal, setCniLocal] = useState(null);
  const [casierLocal, setCasierLocal] = useState(null);

  // ---- Autocomplétion adresse (design préservé)
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null); // Gestion du délai entre deux recherches

  const userToken = useSelector((state) => state.user.value.token);

  // ---- useEffect : chargement du profil utilisateur depuis l’API backend
  useEffect(() => {
    if (!userToken) return;
    fetch(`${url}users/me/${userToken}`)
      .then((response) => response.json())
      .then((data) => {
        const u = data?.user;
        if (!u) return;

        // Récupération des infos communes
        setName(u.firstName || "");
        setPersonalStar(u.rating || 0);
        setTelephone(u.phone || "");
        setGarde(u.count || 0);

        // Location
        const loc = u.location || {};
        setAdresse(loc.address || "");
        setLat(loc.lat ? String(loc.lat) : "");
        setLon(loc.lon ? String(loc.lon) : "");

        // Avatar
        setAvatarUrl(u.avatar || null);

        // Si babysitter -> on remplit ses infos spécifiques
        if (u.babysitterInfos) {
          setAge(u.babysitterInfos.age || "");
          setBiographie(u.babysitterInfos.bio || "");
          setInterest(u.babysitterInfos.interest || "");
          setTH(u.babysitterInfos.price ?? 0);
        }

        // Si parent -> on remplit la liste des enfants
        if (u.parentInfos?.kids) {
          setLastEnfant(u.parentInfos.kids);
        }
      })
      .catch(() => {});
  }, [userToken]);

  // -------- Autocomplétion adresse (API adresse.gouv)
  const searchAddressApi = useCallback(async (query) => {
    try {
      // Appel à l'API publique d'adresses pour obtenir 5 suggestions max
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();

      // Mise en forme minimaliste des suggestions (id/label/context/coords)
      const suggestions = (data.features || []).map((feature, index) => ({
        id: String(index),
        label: feature?.properties?.label,
        context: feature?.properties?.context,
        coordinates: feature?.geometry?.coordinates, // [lon, lat]
      }));
      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (_) {
      // En cas d’erreur : on masque proprement la liste
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const searchAddress = useCallback(
    (query) => {
      // Debounce simple : on ne recherche pas si < 3 caractères
      if (!query || query.trim().length < 3) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Anti spam : on annule la recherche précédente si l’utilisateur retape
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(
        () => searchAddressApi(query.trim()),
        300
      );
    },
    [searchAddressApi]
  );

  const onChangeAdresse = useCallback(
    (txt) => {
      // À chaque saisie : on réinitialise lat/lon tant qu’une suggestion n’est pas validée
      setAdresse(txt);
      setLat("");
      setLon("");
      searchAddress(txt);
    },
    [searchAddress]
  );

  const selectAddress = useCallback((item) => {
    // Lors d’un clic sur une suggestion : on fixe l’adresse et on extrait les coords
    setAdresse(item.label);
    const [iLon, iLat] = item.coordinates || [null, null];
    setLat(iLat ? String(iLat) : "");
    setLon(iLon ? String(iLon) : "");
    setShowSuggestions(false);
    setAddressSuggestions([]);
  }, []);

  // Rendu de chaque ligne de suggestion
  const renderAddressSuggestion = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => selectAddress(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.suggestionLabel}>{item.label}</Text>
        {item.context ? (
          <Text style={styles.suggestionContext}>{item.context}</Text>
        ) : null}
      </TouchableOpacity>
    ),
    [selectAddress]
  );

  // -------- Upload fichiers (avatar, CNI, casier)
  const pickAndUpload = async (type) => {
    try {
      // Demande de permission d’accès à la galerie
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission requise", "Accès à la galerie refusé.");
        return;
      }

      // Sélecteur d’image : recadrage autorisé, qualité 0.85
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.85,
      });
      if (result.canceled) return;

      const asset = result.assets[0];

      // Stocke l’URI locale pour l’aperçu
      if (type === "AVATAR") setAvatarLocal(asset.uri);
      if (type === "CNI") setCniLocal(asset.uri);
      if (type === "CASIER") setCasierLocal(asset.uri);

      // Prépare le FormData pour l’upload back
      const form = new FormData();
      form.append("photoFromFront", {
        uri: asset.uri,
        name: "document.jpg",
        type: "image/jpeg",
      });

      // Envoi vers l’endpoint d’upload (backend -> Cloudinary)
      const res = await fetch(`${url}users/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!data.result) {
        Alert.alert("Erreur upload", data.error || "Upload échoué");
        return;
      }

      // Persiste l’URL retournée (affichée et envoyée ensuite dans le PUT /users)
      if (type === "AVATAR") setAvatarUrl(data.url);
      if (type === "CNI") setCniUrl(data.url);
      if (type === "CASIER") setCasierUrl(data.url);
    } catch (e) {
      Alert.alert("Erreur", e.message);
    }
  };

  // -------- Soumission (enregistrement du profil)
  const handleSubmit = async () => {
    if (!userToken) {
      Alert.alert("Erreur", "Token manquant");
      return;
    }

    // Préparation du payload unique pour parent et babysitter
    const payload = {
      phone: telephone,
      token: userToken,
      avatar: avatarUrl || "",
      babysitterInfos: {
        age: age,
        price: th,
        CNI: cniUrl || "",
        criminalRecord: casierUrl || "",
        bio: Biographie,
        interest: Interest,
      },
      parentInfos: {
        kids: lastEnfant,
      },
      // Location envoyée avec address + lat/lon (si sélection via suggestions)
      location: adresse
        ? { address: adresse, lat: lat || "", lon: lon || "" }
        : undefined,
    };

    try {
      const sendinfo = await fetch(`${url}users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const res = await sendinfo.json();

      // Redirection si ok, sinon feedback d’erreur
      if (res.result) {
        navigation.navigate("Dashboard");
      } else {
        Alert.alert("Erreur", res.error || "Sauvegarde impossible");
      }
    } catch (e) {
      Alert.alert("Erreur réseau", e.message);
    }
  };

  let color;
  if (profil === "parent") color = "#98C2E6";
  else color = "#88E19D";

  const returnScreen = () => navigation.navigate("Dashboard");

  // Gestion enfants (ajout et édition)

  // Les fonctions handleAdd et la constante addEnfant ont été définies mais ne sont finalement pas utilisées.
  // La logique pour ajouter un enfant (setLastEnfant([...lastEnfant, { firstName: '', age: '' }]))
  // est déjà directement intégrée dans le onPress du bouton, ce qui rend handleAdd redondant.
  // De la même manière, l’affichage des enfants est géré directement dans le return avec un lastEnfant.map(...),
  // donc la constante addEnfant, qui reproduit la même logique de rendu, n’est jamais appelée.
  // Ces deux codes sont laissés pour montrer notre première logique.

  // const handleAdd = () =>
  //   setLastEnfant([...lastEnfant, { firstName: "", age: "" }]);
  // const modifAge = (v, i) =>
  //   setLastEnfant(
  //     lastEnfant.map((p, t) =>
  //       t === i ? { firstName: p.firstName, age: v } : p
  //     )
  //   );
  // const modifEnfant = (v, i) =>
  //   setLastEnfant(
  //     lastEnfant.map((a, t) => (t === i ? { firstName: v, age: a.age } : a))
  //   );

  // const addEnfant = lastEnfant.map((_, i) => (
  //   <View key={i} style={styles.containeInput}>
  //     <Input
  //       style={styles.inputEnfant}
  //       width="41%"
  //       placeholder={lastEnfant[i].firstName}
  //       name="Enfant"
  //       setText={(prenom) => modifEnfant(prenom, i)}
  //       text={lastEnfant[i].firstName}
  //     />
  //     <View style={styles.inputAge}>
  //       <Input
  //         width="100%"
  //         placeholder={lastEnfant[i].age}
  //         name="Age"
  //         setText={(val) => modifAge(val, i)}
  //         text={lastEnfant[i].age}
  //       />
  //     </View>
  //   </View>
  // ));

  // Affichage des étoiles (lecture seule)
  const stars = [];
  for (let i = 1; i < 6; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name="star"
        size={18}
        color={i <= personalStar ? color : "#323232"}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {profil === "babysitter" ? (
        // --------- Profil Babysitter
        <>
          <SafeAreaView style={styles.btnReturnContainer}>
            <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen} />
          </SafeAreaView>

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                style={[styles.avatar, { backgroundColor: color }]}
                onPress={() => pickAndUpload("AVATAR")}
                activeOpacity={0.8}
              >
                <Image
                  style={styles.photo}
                  source={
                    avatarLocal
                      ? { uri: avatarLocal }
                      : avatarUrl
                      ? { uri: avatarUrl }
                      : require("../assets/babysitter2.png")
                  }
                />
              </TouchableOpacity>
              <View style={styles.userInfos}>
                <View style={styles.userNameOld}>
                  <Text style={styles.firstName}>{name}</Text>
                </View>
                <View style={styles.userPriceDistance}>
                  <View style={styles.locationPrice}>
                    <FontAwesome name="money" size={20} color={"#FFFBF0"} />
                    <Text style={styles.avatarText}> {th}€/h</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.userReview}>
              <View style={styles.userRating}>
                <View style={styles.stars}>{stars}</View>
                <Text style={styles.ratingText}>(11)</Text>
              </View>
              <Text style={styles.ratingText}>Gardes demandées : {garde}</Text>
            </View>

            <View style={styles.mainContent}>
              {/* Adresse (Input conservé) + suggestions overlay */}
              <View style={styles.addressWrapper}>
                <Input
                  style={styles.inputAdresse}
                  placeholder={adresse}
                  userStyle={{ color: color }}
                  width="90%"
                  name="Adresse"
                  setText={onChangeAdresse}
                  text={adresse}
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                      data={addressSuggestions}
                      renderItem={renderAddressSuggestion}
                      keyExtractor={(item) => item.id}
                      style={styles.suggestionsList}
                      scrollEnabled={false}
                      keyboardShouldPersistTaps="always"
                    />
                  </View>
                )}
              </View>

              <View style={styles.containeInput}>
                <Input
                  style={styles.inputTelephone}
                  placeholder={telephone}
                  userStyle={{ color: color }}
                  width="90%"
                  name="Télephone"
                  setText={setTelephone}
                  text={telephone}
                />
              </View>

              <View style={styles.containeInput}>
                <TouchableOpacity
                  style={[styles.uploadBtn, { backgroundColor: color }]}
                  onPress={() => pickAndUpload("CNI")}
                >
                  <Text style={styles.uploadText}>
                    {cniUrl ? "CNI importée" : "Importer CNI"}
                  </Text>
                </TouchableOpacity>
                <View style={styles.inputAge}>
                  <Input
                    userStyle={{ color: color }}
                    placeholder={age}
                    width="100%"
                    name="Age"
                    setText={setAge}
                    text={age}
                  />
                </View>
              </View>
              {cniLocal ? (
                <View style={{ alignItems: "center", marginBottom: 10 }}>
                  <Image
                    source={{ uri: cniLocal }}
                    style={{ width: 140, height: 90, borderRadius: 6 }}
                  />
                  {cniUrl ? (
                    <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      OK • Uploadé
                    </Text>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.containeInput}>
                <TouchableOpacity
                  style={[styles.uploadBtn, { backgroundColor: color }]}
                  onPress={() => pickAndUpload("CASIER")}
                >
                  <Text style={styles.uploadText}>
                    {casierUrl
                      ? "Casier importé"
                      : "Importer Casier judiciaire"}
                  </Text>
                </TouchableOpacity>
                <View style={styles.btnFrance}>
                  <FranceConnectBtn />
                </View>
              </View>
              {casierLocal ? (
                <View style={{ alignItems: "center", marginBottom: 10 }}>
                  <Image
                    source={{ uri: casierLocal }}
                    style={{ width: 140, height: 90, borderRadius: 6 }}
                  />
                  {casierUrl ? (
                    <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      OK • Uploadé
                    </Text>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.containeInput}>
                <Input
                  style={styles.inputTH}
                  userStyle={{ color: color }}
                  placeholder={String(th)}
                  width="60%"
                  name="Taux horaire"
                  setText={setTH}
                  text={String(th)}
                />
              </View>
              <View style={styles.containeInput}>
                <InputLarge
                  style={styles.inputLarge}
                  placeholder={Biographie}
                  height="60"
                  userStyle={{ color: color }}
                  width="90%"
                  name="Biographie"
                  setText={setBiographie}
                  text={Biographie}
                />
              </View>
              <View style={styles.containeInput}>
                <InputLarge
                  style={styles.inputLarge}
                  placeholder={Interest}
                  height="60"
                  userStyle={{ color: color }}
                  width="90%"
                  name="Centre d'intérêts"
                  setText={setInterest}
                  text={Interest}
                />
              </View>
            </View>

            <SafeAreaView style={styles.containeBtn}>
              <MainBtn
                clickNav={handleSubmit}
                style={styles.contactBtn}
                btnTitle="Enregistrer"
                userStyle={{ backgroundColor: color }}
              />
            </SafeAreaView>
          </ScrollView>
        </>
      ) : (
        // --------- Profil Parent
        <>
          <SafeAreaView style={styles.btnReturnContainer}>
            <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen} />
          </SafeAreaView>

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                style={[styles.avatar, { backgroundColor: color }]}
                onPress={() => pickAndUpload("AVATAR")}
                activeOpacity={0.8}
              >
                <Image
                  style={styles.photo}
                  source={
                    avatarLocal
                      ? { uri: avatarLocal }
                      : avatarUrl
                      ? { uri: avatarUrl }
                      : require("../assets/babysitter2.png")
                  }
                />
              </TouchableOpacity>
              <View style={styles.userInfos}>
                <View style={styles.userNameOld}>
                  <Text style={styles.firstName}>{name}</Text>
                </View>
              </View>
            </View>

            <View style={styles.userReview}>
              <View style={styles.userRating}>
                <View className="stars" style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={18}
                      color={i <= personalStar ? color : "#323232"}
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>(11)</Text>
              </View>
              <Text style={styles.ratingText}>Gardes demandées : {garde}</Text>
            </View>

            <View style={styles.mainContent}>
              {/* Adresse (Input conservé) + suggestions */}
              <View style={styles.addressWrapper}>
                <Input
                  style={styles.inputAdresse}
                  placeholder={adresse}
                  userStyle={{ color: color }}
                  width="90%"
                  name="Adresse"
                  setText={onChangeAdresse}
                  text={adresse}
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                      data={addressSuggestions}
                      renderItem={renderAddressSuggestion}
                      keyExtractor={(item) => item.id}
                      style={styles.suggestionsList}
                      scrollEnabled={false}
                      keyboardShouldPersistTaps="always"
                    />
                  </View>
                )}
              </View>

              <View style={styles.containeInput}>
                <Input
                  style={styles.inputTelephone}
                  placeholder={telephone}
                  userStyle={{ color: color }}
                  width="90%"
                  name="Télephone"
                  setText={setTelephone}
                  text={telephone}
                />
              </View>

              <View style={styles.containeEnfant}>
                <View style={styles.containeBtnEnfant}>
                  <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={() =>
                      setLastEnfant([...lastEnfant, { firstName: "", age: "" }])
                    }
                  >
                    <View style={styles.triangle}></View>
                  </TouchableOpacity>
                </View>
                <View style={styles.containeInputEnfant}>
                  {lastEnfant.map((_, i) => (
                    <View key={i} style={styles.containeInput}>
                      <Input
                        style={styles.inputEnfant}
                        width="41%"
                        placeholder={lastEnfant[i].firstName}
                        name="Enfant"
                        setText={(prenom) =>
                          setLastEnfant((prev) =>
                            prev.map((e, t) =>
                              t === i ? { firstName: prenom, age: e.age } : e
                            )
                          )
                        }
                        text={lastEnfant[i].firstName}
                      />
                      <View style={styles.inputAge}>
                        <Input
                          width="100%"
                          placeholder={lastEnfant[i].age}
                          name="Age"
                          setText={(val) =>
                            setLastEnfant((prev) =>
                              prev.map((e, t) =>
                                t === i
                                  ? { firstName: e.firstName, age: val }
                                  : e
                              )
                            )
                          }
                          text={lastEnfant[i].age}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <SafeAreaView style={styles.containeBtn}>
              <MainBtn
                clickNav={handleSubmit}
                style={styles.contactBtn}
                btnTitle="Enregistrer"
                userStyle={{ backgroundColor: color }}
              />
            </SafeAreaView>
          </ScrollView>
        </>
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
  avatarContainer: {
    position: "relative",
    width: "100%",
    height: 350,
  },
  avatar: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    objectFit: "fill",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  containePhoto: {
    height: 155,
    width: 155,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    overflow: "hidden",
  },
  photo: { height: "100%", width: "100%", resizeMode: "cover" },
  containeBtn: {
    marginLeft: 20,
    marginBottom: 25,
    marginTop: 25,
    width: "90%",
  },
  userInfos: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userNameOld: {
    margin: 20,
    height: "80%",
    justifyContent: "space-evenly",
  },
  locationPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  userPriceDistance: {
    margin: 20,
    paddingTop: 8,
    height: "80%",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
  },
  firstName: {
    fontFamily: "Montserrat",
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFBF0",
    textShadowColor: "#323232",
    textShadowRadius: 6,
    textShadowOffset: { width: -1, height: 1 },
  },
  avatarText: {
    color: "#FFFBF0",
    fontFamily: "Montserrat",
    fontSize: 24,
    textShadowColor: "#323232",
    textShadowRadius: 4,
    textShadowOffset: { width: -1, height: 1 },
  },
  userReview: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: { flexDirection: "row" },
  ratingText: { fontFamily: "Montserrat", fontSize: 18 },

  mainContent: {
    borderTopWidth: 1,
    borderTopColor: "#323232",
    paddingTop: 10,
  },

  containeInput: {
    width: "100%",
    height: "10%",
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 0.1,
  },
  inputPrenom: { width: "41%", marginLeft: 20 },
  btnFrance: { marginLeft: 20 },
  inputAge: { marginLeft: 20, width: "20%" },
  uploadBtn: {
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: { color: "#263238", fontWeight: "700" },
  containeEnfant: { width: "100%" },
  containeBtnEnfant: {
    width: "20%",
    position: "absolute",
    zIndex: 10,
    right: 0,
    top: 22,
  },
  containeInputEnfant: { position: "relative" },
  btnContainer: {
    backgroundColor: "#98C2E6",
    alignItems: "center",
    borderRadius: 30,
    padding: 15,
    width: 45,
    height: 45,
    justifyContent: "center",
    shadowColor: "#263238",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 8.7,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#979797",
    borderRightColor: "#979797",
    transform: [{ rotate: "0deg" }],
  },

  // ---- Adresse suggestions overlay (design Input conservé)
  addressWrapper: {
    width: "100%",
    marginLeft: 20,
    marginBottom: 10,
    zIndex: 1000,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 65, // aligné avec ta hauteur d'Input
    left: 0,
    right: 35,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 220,
    zIndex: 1001,
  },
  suggestionsList: { maxHeight: 220 },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  suggestionContext: { fontSize: 12, color: "#666" },

  inputAdresse: {},
  inputTelephone: {},
  inputLarge: {},
  inputTH: {},
  inputEnfant: {},
});
