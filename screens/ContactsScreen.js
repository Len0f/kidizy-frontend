import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Conversation from "../components/conversation";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { url } from "../App";


export default function ContactsScreen({ navigation }) {
    // PAS TOUCHER
    const { profil } = useUser();
    const [convs, setConvs] = useState([]);
    const [propos, setPropos] = useState([]);
    const [isVisible, setIsVisible] = useState(false); // Contrôle l'affichage du bloc "demandes de chat"
  
    // AJOUT
    const [refreshing, setRefreshing] = useState(false); // permettra de refresh en tirant l'écran vers le bas, car l'auto était trop lent.
  
    // PAS TOUCHE
    const user = useSelector((state) => state.user.value);
    
    // PAS TOUCHE JUSTE REMONTE
    const userColor = profil === "parent" ? "#98C2E6" : "#88E19D";

    // AMELIORATION
    // Navigation : ouvre l'écran de chat.
    const goChat = (extra = {}) => {
      // extra permet de passer des info' complémentaires : (id de conversation, etc.)
      navigation.navigate("Chat", { from: "Contacts", profil, ...extra });
    };


    // AJOUT
    // Navigation : ouvre ProfilBook du contact sélectionné.
    const goProfil = (target) => {
      // target : objet user complet ou juste un id, augmente la posibilité de trouver les profils.
      const userObj = target && typeof target === "object" ? target : undefined; // Si target est un objet ou non.
      const userId =
        userObj?._id ||
        userObj?.id ||
        (typeof target === "string" ? target : undefined); // sinon on cherche l'id.
  
      navigation.navigate("ProfilBook", {
        from: "Contacts",
        profil,
        user: userObj, // si on a l’objet complet
        userId, // fallback si on n’a qu’un id
      });
    };

    //AJOUT
    // NAVIGATION : ouvre l'aperçu d'une proposition (par id)
    const goPreviewPropo = (propositionId) => {
      navigation.navigate("Proposition", {
        from: "Contacts",
        profil,
        proposition: propositionId,
        viewOnly: false,
      });
    };

  // Effet principal : on charge les conversations ouvertes et les propositions pour les profils bb.
  const loadData = useCallback(() => {     // MODIFICATION : callback = useEffect mais permet de gérer le loading, LA LOGIQUE EST PAREIL !!!!!!
    if (!user?.token || !user?.id) return; // si pas d'authentification valide, ça bloque (utile ? C'est un reflexe de le mettre au cas où).
    setRefreshing(true);

    if (profil === "parent") {
      // ----- PARENT : chats ouverts (contacts = babysitters)
      fetch(`${url}conversations?token=${user.token}&id=${user.id}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
          }
        )
        .then((data) => {
          const conversations = (data?.myConversations ?? []).map((conv, i) => {
            // ?? [] : sécurise pour éviter les erreurs si undefined

            // MODIF : Juste fait des variables réutilisable !
            const convId = conv?._id || conv?.id || i; // key unique : priorité à _id, sinon index(i)
            const baby = conv?.idUserBabysitter ?? {}; // CONTACT = babysitter

            return (
                // MODIF : Uniquement sur les click
              <Conversation
                key={convId}
                firstName={baby?.firstName}
                lastName={baby?.lastName}
                urlImage={baby?.avatar}
                click={() => goProfil(baby)} // avatar -> Profil du contact (babysitter)
                clickNav={() => goChat({ conversation: convId })} // mainBtn -> Chat
                userColor={userColor}
                btnTitle={
                  <View style={styles.message}>
                    <FontAwesome
                      style={styles.icon}
                      name="paper-plane"
                      size={12}
                      color={"#323232"}
                    />
                  </View>
                }
              />
            );
          });
          setConvs(conversations); // enregistrement du JRX dans l'état (pour réutiliser plus tard)
          setPropos([]); // parent : pas de proposition.
          setIsVisible(false);
        })
        // AJOUT : Permet le rafraichissement.
        .finally(() => setRefreshing(false));
    } else {
        // ----- BABYSITTER : chats ouverts (contacts = parents) + propositions (contacts = parents)
        Promise.all([
          // Permet de faire 2 fetchs en parallèle.
            fetch(`${url}conversations?token=${user.token}&id=${user.id}`).then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            }),
            fetch(`${url}propositions?token=${user.token}&id=${user.id}`).then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
        ])
        .then(([conversationsData, propositionsData]) => {
          // Chats ouverts (contacts = parents)
          const conversations = (conversationsData?.myConversations ?? []).map(
            (conv, i) => {
              const convId = conv?._id || conv?.id || i;
              const otherUser = conv?.idUserParent ?? {}; // CONTACT = parent

              return (
                <Conversation
                  key={convId}
                  firstName={otherUser?.firstName}
                  lastName={otherUser?.lastName}
                  urlImage={otherUser?.avatar}
                  // avatar -> Profil du contact (parent)
                  click={() => goProfil(otherUser)}
                  // mainBtn -> Chat
                  clickNav={() => goChat({ conversation: convId })}
                  userColor={userColor}
                  btnTitle={
                    <View style={styles.message}>
                      <FontAwesome
                        style={styles.icon}
                        name="paper-plane"
                        size={12}
                        color={"#323232"}
                      />
                    </View>
                  }
                />
              );
            }
          );

          // Propositions PENDING ou en attente (contacts = parents)
          const pending = (propositionsData?.filteredPropositions ?? []).filter(
            // on filtre en liste les proposition (isAccepted === "PENDING")
            (propo) => propo?.isAccepted === "PENDING"
          );

          const propositions = pending.map((propo, i) => {
            const otherUser = propo?.idUserParent ?? {}; // CONTACT = parent
            const key = propo?._id || i;

            return (
              <Conversation
                key={key}
                firstName={otherUser?.firstName}
                lastName={otherUser?.lastName}
                urlImage={otherUser?.avatar}
                // avatar -> Profil du contact (parent)
                click={() => goProfil(otherUser)}
                // mainBtn -> Proposition
                clickNav={() => goPreviewPropo(propo?._id)}
                userColor={userColor}
                btnTitle={
                  <View style={styles.message}>
                    <FontAwesome
                      style={styles.icon}
                      name="paper-plane"
                      size={12}
                      color={"#323232"}
                    />
                  </View>
                }
              />
            );
          });

          setConvs(conversations); // petit enregistrement JRX
          setPropos(propositions);
          setIsVisible(pending.length > 0); // Et on contrôle l'affichage du bloc "Demande de chat", si =0, il apparait pas.
        })
        .finally(() => setRefreshing(false));
    }
  }, [profil, user?.id, user?.token]);

  // AJOUT
  // Déclenchement initial (et quand profil/token changent)
  // Sans ça, l’écran reste vide jusqu’au premier refresh manuel (j'ai fais pareil dans searchScreen).
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/KidizyLogo.png")} />

        {/* AJOUT : scroll */}
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        {profil === "babysitter" ? (
          <>
            {isVisible && (
              <View style={styles.newConvContainer}>
                <View style={styles.screenTitleContainer}>
                  <Text style={styles.screenTitle}>Demande de chat :</Text>
                </View>
                {propos}
              </View>
            )}

            <View style={styles.previousConvContainer}>
              {convs}
            </View>
          </>
        ) : (
          <View style={styles.previousConvContainer}>{convs}</View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF0",
    alignItems: "center",
  },
  logo: {
    marginTop: 40,
    height: "10%",
    width: "80%",
    objectFit: "contain",
  },
  screenTitleContainer: {
    marginVertical: 30,
    justifyContent: "center",
  },
  screenTitle: {
    fontFamily: "Montserrat",
    fontSize: 20,
    fontWeight: "700",
  },
  newConvContainer: {
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  previousConvContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  message: {
    padding: 5,
  },
  icon: {
    fontSize: 20,
  },
});
