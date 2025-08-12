import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { useUser } from '../contexts/UserContext';
import UserCard from '../components/userCard';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Conversation from '../components/conversation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {url} from '../App';

export default function ContactsScreen({ navigation, route }) {
    const {profil} = useUser();
    const [convs, setConvs] = useState([])
    const [propos, setPropos] = useState([])
    const [isVisible, setIsVisible] = useState (false)
    const user = useSelector((state) => state.user.value);

    useEffect(()=>{
        if(profil === 'PARENT'){
            fetch(`${url}conversations?token=${user.token}&id=${user.id}`)
            .then(response=>response.json())
            .then(data=>{
                const conversations = data.myConversations.map((conv, i)=>{
                    return <Conversation key={i}firstName={conv.idUserBabysitter.firstName} lastName={conv.idUserBabysitter.lastName} urlImage={conv.idUserBabysitter.avatar}click={goProfil} clickNav={chat(conv._id)}userColor={userColor} btnTitle={<View style={styles.message}><FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/></View>} />
                })
                setConvs(conversations)
            })
        }else{
            Promise.all([
                fetch(`${url}conversations?token=${user.token}&id=${user.id}`),
                fetch(`${url}propositions?token=${user.token}&id=${user.id}`)
            ])
            .then(responses => {
            // Vérifier que toutes les réponses sont OK
            return Promise.all(responses.map(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                return response.json();
            }));
            })
            .then(([conversationsData, propositionsData]) => {
            // Traitement des conversations
            
            const conversations = conversationsData.myConversations.map((conv, i) => {
                console.log('conv',conv)
               
            return (
                <Conversation key={i}firstName={conv.idUserParent.firstName} convId={conv._id} lastName={conv.idUserParent.lastName} urlImage={conv.idUserParent.avatar}click={goProfil} clickNav={(id) => chat(id)} userColor={userColor} 
                          btnTitle={<View style={styles.message}><FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/></View>} />
            );
        });
        setConvs(conversations);

    // Traitement des propositions
    const filter = propositionsData.filteredPropositions.filter(proposition =>
        ["PENDING"].includes(proposition.isAccepted)
    );
    
    const propositions = filter.map((propo, i) => {
       
        return <Conversation key={i}firstName={propo.idUserParent.firstName} lastName={propo.idUserParent.lastName} urlImage={propo.idUserParent.avatar}click={goProfil} clickNav={goPreviewParent(propo._id)}userColor={userColor} 
                              btnTitle={<View style={styles.message}><FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/></View>}/>;
    });
    setPropos(propositions);
    // Gestion de la visibilité basée sur les propositions filtrées
    if (filter.length > 0) {
        setIsVisible(true);
    } else {
        setIsVisible(false);
        
    }
})
            // fetch(`${url}conversations?token=${user.token}&id=${user.id}`)
            // .then(response=>response.json())
            // .then(data=>{
            //     const conversations = data.myConversations.map((conv, i)=>{
            //         return <Conversation key={i}firstName={conv.idUserParent.firstName} lastName={conv.idUserParent.lastName} urlImage={conv.idUserParent.avatar}click={goProfil} clickNav={chat}userColor={userColor} btnTitle={<View style={styles.message}><FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/></View>} />
            //     })
            //     setConvs(conversations)
            // })
            // fetch(`${url}propositions?token=${user.token}&id=${user.id}`)
            // .then(response=>response.json())
            // .then(data=>{           
            //      const filter = data.filteredPropositions.filter(proposition => 
            //         ["PENDING"].includes(proposition.isAccepted)
            //     );
            //     const propositions = filter.map((propo, i)=>{
            //         return <Conversation key={i}firstName={propo.idUserParent.firstName} lastName={propo.idUserParent.lastName} urlImage={propo.idUserParent.avatar}click={goProfil} clickNav={chat}userColor={userColor} btnTitle={<View style={styles.message}><FontAwesome style={styles.icon}name="paper-plane" size={12} color={'#323232'}/></View>} />
            //     })
            //     setPropos(propositions)
            //     if (propos.length) {
            //         setIsVisible(true)
            //     } else {
            //         setIsVisible(false)
            //     }
            // })
        }               
    },[])
    

    let userColor;
    if(profil==='parent'){
        userColor='#98C2E6'
    }else{
        userColor='#88E19D'
    }
    const goProfil = ()=>{
        navigation.navigate('ProfilBook', {from:'Contacts', profil,})
    }
    
     const goPreviewParent = (propo)=>{
        navigation.navigate('PreviewParent', {from:'Contacts', profil,propoId:propo})
    }
    const chat = (conv) =>{
        navigation.navigate('Chat', {from: 'Contacts', profil,conversation: conv})
    }

   

    

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
            ):(<>

                    <View style={styles.previousConvContainer}>
                        {convs}
                    </View>
                    {/* <Text>Nouvelles demandes</Text>
                    <Button
                        title="Voir le profil"
                        onPress={() => navigation.navigate('PreviewParent', {from: 'Contacts', profil})}
                    />
                    <Text>En cours</Text> */}
                </>
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
        marginVertical:50,
        justifyContent:'center'
    },
    screenTitle:{
        fontFamily:'Montserrat',
        fontSize:28,
        fontWeight:'700'
    },
    newConvContainer:{
        alignItems:'center',
        paddingBottom:15,
        borderBottomWidth:1
    },
    previousConvContainer:{
        paddingTop:27
    },
    message:{
        padding:5,
    },
    icon:{
        fontSize:20,
    }
})