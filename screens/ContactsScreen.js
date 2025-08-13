import { StyleSheet, Text, View, Image } from 'react-native';
import { useUser } from '../contexts/UserContext';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Conversation from '../components/conversation';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import {url} from '../App';

export default function ContactsScreen({ navigation, route }) {
    const {profil} = useUser();
    const [convs, setConvs] = useState([])
    const [propos, setPropos] = useState([])
    const [isVisible, setIsVisible] = useState (false)
    const user = useSelector((state) => state.user.value);

    const userColor = profil === 'parent' ? '#98C2E6' : '#88E19D';

    const goChat = (extra = {}) => {  // pour prendre en compte les params
        navigation.navigate('Chat', { from: 'Contacts', profil, ...extra})
    };

    const goProfil = () => {
        navigation.navigate('ProfilBook', { from: 'Contacts', profil
        });
    }

    // Ouvrir le prewiew du parent en cliquant sur la photo
    const goProposition = (parentObj) => { // parent Obj provient de conv.idUserParent
        navigation.navigate('Proposition', {
            from: 'Contacts',
            profil,
            viewOnly: true,       // Cache Accepter/refuser
            parent: parentObj     // On passe l'objet parent pour remplir l'écran.
        });
    };

    // Ouvrir le preview de la proposition depuis le mainBtn
    const goPreviewPropo = (propoId) => {
        navigation.navigate('Proposition', {
            from: 'Contacts',
            profil,
            propoId,
            viewOnly: false
        });
    };

// ---------------- AFFICHAGE DES CONTACTS
    useEffect(()=>{
        if(profil === 'parent'){
            fetch(`${url}conversations?token=${user.token}&id=${user.id}`)
            .then(response=>response.json())
            .then(data=>{
                const conversations = data.myConversations.map((conv, i)=>{
                    return (
                        <Conversation
                            key={i}
                            firstName={conv.idUserBabysitter.firstName}
                            lastName={conv.idUserBabysitter.lastName}
                            urlImage={conv.idUserBabysitter.avatar}
                            click={() => goProfil()}                                                // click photo = profil parent.
                            clickNav={() => goChat({conversation: conv?._id || conv?.id})}       // clicl mainBtn = chat
                            userColor={userColor}
                            btnTitle={
                                <View style={styles.message}>
                                    <FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/>
                                </View>}
                        />
                    )
                })
                setConvs(conversations)
            })
        } else {
            Promise.all([
                fetch(`${url}conversations?token=${user.token}&id=${user.id}`),
                fetch(`${url}propositions?token=${user.token}&id=${user.id}`)
            ])
            .then((responses) => 
                // Vérifier que toutes les réponses sont OK
                Promise.all(
                    responses.map((response) => {
                        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
                        return response.json();
                    })
                )
            )
            .then(([conversationsData, propositionsData]) => {
                // Traitement des conversations
                // Chat ouvert des babysitters.
                const conversations = conversationsData.myConversations.map((conv, i) => (
                    <Conversation
                        key={i}
                        firstName={conv.idUserParent.firstName}
                        lastName={conv.idUserParent.lastName}
                        urlImage={conv.idUserParent.avatar}
                        click={() => goProfil()}
                        clickNav={() => goChat({ conversation: conv?._id || conv?.id })}
                        userColor={userColor} 
                        btnTitle={
                            <View style={styles.message}>
                                <FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/>
                                </View>
                            }
                    />
                ));
                setConvs(conversations);

                
                // Demandes (propositions)
                const filter = propositionsData.filteredPropositions.filter(
                    (proposition) => proposition.isAccepted === 'PENDING'
                );
                
                const propositions = filter.map((propo, i) => (
                    <Conversation
                        key={i}
                        firstName={propo.idUserParent.firstName}
                        lastName={propo.idUserParent.lastName}
                        urlImage={propo.idUserParent.avatar}
                        click={() => goProfil()}
                        clickNav={() => goPreviewPropo(propo._id)}
                        userColor={userColor} 
                        btnTitle={
                            <View style={styles.message}>
                                <FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/>
                            </View>}
                    />
                ));
                setPropos(propositions);
                // Gestion de la visibilité basée sur les propositions filtrées
                if (filter.length > 0) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            })
        }               
    }, [profil, user.id, user.token])
    
    return (
        <View style={styles.container}>
            <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />

            {/* Partie uniquement visible par les babysitter */}
            {profil === 'babysitter' ? (
                <>  
                    {isVisible && <View style={styles.newConvContainer}>
                        <View style={styles.screenTitleContainer}>
                            <Text style={styles.screenTitle}>Demande de chat :</Text>
                        </View>
                        {propos}
                    </View>}

                    <View style={styles.previousConvContainer}>
                        {convs}
                    </View>     
                </>
            ) : (
                    <View style={styles.previousConvContainer}>
                        {convs}
                    </View>
            )}       
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
        paddingTop: 0
    },
    message:{
        padding:5,
    },
    icon:{
        fontSize:20,
    }
})