import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useUser } from '../contexts/UserContext';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Conversation from '../components/conversation';
import { useSelector } from 'react-redux';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { url } from '../App';

export default function ContactsScreen({ navigation }) {
  const { profil } = useUser();
  const [convs, setConvs] = useState([]);
  const [propos, setPropos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh visuel

  const user = useSelector((state) => state.user.value);

  const userColor = profil === 'parent' ? '#98C2E6' : '#88E19D';

  const goChat = (extra = {}) => {
    navigation.navigate('Chat', { from: 'Contacts', profil, ...extra });
  };

  // Ouvre ProfilBook avec la fiche du contact (objet OU id string)
  const goProfil = (target) => {
    const userObj = target && typeof target === 'object' ? target : undefined;
    const userId  = userObj?._id || userObj?.id || (typeof target === 'string' ? target : undefined);

    navigation.navigate('ProfilBook', {
      from: 'Contacts',
      profil,
      user: userObj,     // si on a l’objet complet
      userId,            // fallback si on n’a qu’un id
    });
  };

  const goPreviewPropo = (propositionId) => {
    navigation.navigate('Proposition', {
      from: 'Contacts',
      profil,
      proposition: propositionId,
      viewOnly: false,
    });
  };

  useEffect(() => {
    if (!user?.token || !user?.id) return;

    if (profil === 'parent') {
      // ----- Parent : chats ouverts (contacts = babysitters)
      fetch(`${url}conversations?token=${user.token}&id=${user.id}`)
        .then((reponse) => reponse.json())
        .then((data) => {
          const conversations = (data?.myConversations ?? []).map((conv, i) => {
            const convId = conv?._id || conv?.id || i;
            const otherUser = conv?.idUserBabysitter ?? {}; // CONTACT = babysitter

            return (
              <Conversation
                key={convId}
                firstName={otherUser?.firstName}
                lastName={otherUser?.lastName}
                urlImage={otherUser?.avatar}
                // avatar -> Profil du contact (babysitter)
                click={() => goProfil(otherUser)}
                // mainBtn -> Chat
                clickNav={() => goChat({ conversation: convId })}
                userColor={userColor}
                btnTitle={
                  <View style={styles.message}>
                    <FontAwesome style={styles.icon} name="paper-plane" size={12} color={'#323232'} />
                  </View>
                }
              />
            );
          });
          setConvs(conversations);
        })
        .catch(console.warn);
    } else {
      // ----- Babysitter : chats ouverts (contacts = parents) + propositions (contacts = parents)
      Promise.all([
        fetch(`${url}conversations?token=${user.token}&id=${user.id}`),
        fetch(`${url}propositions?token=${user.token}&id=${user.id}`),
      ])
        .then((responses) =>
          Promise.all(
            responses.map((response) => {
              if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
              return response.json();
            })
          )
        )
        .then(([conversationsData, propositionsData]) => {
          // Chats ouverts (contacts = parents)
          const conversations = (conversationsData?.myConversations ?? []).map((conv, i) => {
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
                    <FontAwesome style={styles.icon} name="paper-plane" size={12} color={'#323232'} />
                  </View>
                }
              />
            );
          });
          setConvs(conversations);

          // Propositions PENDING (contacts = parents)
          const pending = (propositionsData?.filteredPropositions ?? []).filter(
            (p) => p?.isAccepted === 'PENDING'
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
                    <FontAwesome style={styles.icon} name="paper-plane" size={12} color={'#323232'} />
                  </View>
                }
              />
            );
          });

          setPropos(propositions);
          setIsVisible(pending.length > 0);
        })
        .catch(console.warn);
    }
  }, [profil, user?.id, user?.token]);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/KidizyLogo.png')} />
    
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
      {profil === 'babysitter' ? (
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
            <View style={styles.screenTitleContainer}>
              <Text style={styles.screenTitle}>Chats ouverts :</Text>
            </View>
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
        backgroundColor: '#FFFBF0',
        alignItems: 'center',
    },
    logo:{
        marginTop:40,
        height:'10%',
        width:'80%',
        objectFit:'contain'
    },
    screenTitleContainer:{
        marginVertical:30,
        justifyContent:'center'
    },
    screenTitle:{
        fontFamily:'Montserrat',
        fontSize:20,
        fontWeight:'700'
    },
    newConvContainer:{
        alignItems:'center',
        paddingBottom:10,
        borderBottomWidth:1
    },
    previousConvContainer:{
        alignItems: 'center',
        paddingTop: 20
    },
    message:{
        padding:5,
    },
    icon:{
        fontSize:20,
    }
})