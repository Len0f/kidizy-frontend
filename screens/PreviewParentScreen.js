import { Button, StyleSheet, Text, View, SafeAreaView,Image, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import ReturnBtn from '../components/returnBtn';
import InfoBtn from '../components/infoBtn';
import MainBtn from '../components/mainBtn';
import TextInfo from '../components/TextInfo';
import Input from '../components/Input';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSelector } from 'react-redux';
import {url} from '../App'; // Import the API URL from App.js
import Conversation from '../components/conversation';


export default function PreviewParentScreen({ navigation, route }) {
    const user=useSelector((state)=>state.user.value)
    const { profil } = useUser();
    
//     useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status === 'granted') {
//         Location.watchPositionAsync({ distanceInterval: 10 },
//           (location) => {
//             console.log(location);
//           });
//       }
//     })();
//   }, []);

useEffect(()=>{
    if(profil==='babysitter'){
        fetch(`${url}proposition/id?token=${user.token}&id=${propoId}`).then(response=>response.json())
        .then(data=>{
            
            setNom(data.propo.firstName)
            setPrenom(data.propo.lastName)
            setDay(data.propo.day)
            setHours(data.propo.propoStart)
            setEnfant(data.propo.kids)
            setComment(data.propo.comment)
        })
    }
},[])
    
    
    const returnScreen = ()=>{
        navigation.navigate('Contacts')
    }
    const goParentProfil = ()=>{
        navigation.navigate('ProfilBook')
    }

    const accept = async()=>{
        const newProp = await fetch (`${url}propositions`,{
             method: 'POST',

             headers: { 'Content-Type': 'application/json' },

             body: JSON.stringify({
                token: user.token,
                firstName:prenom,
                lastName: nom,
                kids:enfant,
                idUserParent: user.id,
                idUserBabysitter: user.selectedBabysitterId,
                day,
                propoStart:hours,
                propoEnd:hours,
                updatedAt: new Date(),
                comment
             })
        })
        const res = await newProp.json()
        if (res.result){
            const newConversation = await fetch(`${url}conversations`,{
                method: 'POST',

             headers: { 'Content-Type': 'application/json' },

             body: JSON.stringify({
                token: user.token,
                idUserParent: user.id,
                idUserBabysitter: user.selectedBabysitterId,
                updatedAt: new Date()
             })
            })
            const resConv = await newConversation.json()
           
            if(resConv.result){
        navigation.navigate('Chat', {conversation:resConv.conversationId._id})
            }
        }
    }

    const refus = ()=>{
        navigation.navigate('Contacts')
    }


    
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [day, setDay] = useState('')
    const [hours, setHours] = useState('')
    const [enfant, setEnfant] = useState('')
    const [comment, setComment] = useState('')
    
    return (
        
        <View style={styles.container} >
            {profil === 'babysitter' ? ( 
                <View>
            <SafeAreaView style={styles.btnReturnContainer}>
                <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
            </SafeAreaView>
            <SafeAreaView style={styles.btnProfilContainer}>
                <InfoBtn style={styles.returnBtn} returnScreen={goParentProfil}/>
            </SafeAreaView>
            <SafeAreaView style={styles.avatarContainer}>
                <Image style={styles.avatar} source={require('../assets/babysitter2.png')}/>
                <Text style={styles.avatarName}>Prenom</Text>
            </SafeAreaView>
            
            <View style={styles.mainContent}>
                <TextInfo title='Prenom'textContent={prenom} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title='Nom'textContent={nom} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title='Jour'textContent={day} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title='Heure'textContent={hours} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title="Nombre d'enfant"textContent={enfant} userStyle={{color:'#88E19D'}} width={'90%'}/>
                <TextInfo title='Commentaire'textContent={comment} userStyle={{color:'#88E19D'}} width={'90%'}/>
            </View>

            <View style={styles.mapContainer}>
            <MapView
                initialRegion={{
                latitude: 44.8643352091005,
                longitude: -0.5760245233606299,
                latitudeDelta:0.0022,
                longitudeDelta:0.0021
                }}
                style={styles.map}
            >
            <Marker coordinate={{ latitude: 44.8643352091005, longitude: -0.5760245233606299 }} title={data.Prenom} />
            </MapView>
            </View>
            <View style={styles.buttons}>
                <MainBtn btnTitle={"Accepter"} userStyle={{width:"43%"}} clickNav={accept}/>
                <MainBtn btnTitle={"Refuser"} userStyle={{backgroundColor:"#EBE6DA", width:"43%"}} clickNav={refus}/>
            </View> 
            </View>
            ):(
            <ScrollView>
            <SafeAreaView style={styles.btnReturnContainer}>
                <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
            </SafeAreaView>
            <SafeAreaView style={styles.btnProfilContainer}>
                <InfoBtn style={styles.returnBtn} returnScreen={goParentProfil}/>
            </SafeAreaView>
            <SafeAreaView style={styles.avatarContainer}>
                <Image style={styles.avatar} source={require('../assets/babysitter2.png')}/>
                <Text style={styles.avatarName}>Prenom</Text>
            </SafeAreaView>
            
            <View style={styles.mainContent}>
                <Input name='Prenom'setText={setNom} text={nom}  width={'43%'}/>
                <Input name='Nom'setText={setPrenom} text={prenom}  width={'43%'}/>
                <Input name='Jour'setText={setDay} text={day} width={'43%'}/>
                <Input name='Heure'setText={setHours} text={hours}  width={'43%'}/>
                <Input name="Nombre d'enfant"setText={setEnfant} text={enfant} width={'90%'}/>
                <Input name='Commenaire'setText={setComment} text={comment}width={'90%'}/>
            </View>

            <View style={styles.mapContainer}>
            <MapView
                initialRegion={{
                latitude: 44.8643352091005,
                longitude: -0.5760245233606299,
                latitudeDelta:0.0022,
                longitudeDelta:0.0021
                }}
                style={styles.map}
            >
            <Marker coordinate={{ latitude: 44.8643352091005, longitude: -0.5760245233606299 }} title={prenom} />
            </MapView>
            </View>
            <View style={styles.buttons}>
                <MainBtn btnTitle={"Envoyer"} userStyle={{backgroundColor:'#98C2E6'}} clickNav={accept}/>
            </View> 
            </ScrollView>
            )}

        </View>
             


    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFBF0',
        position:'relative'

    },
        btnReturnContainer:{
        position:"absolute",
        zIndex:10,
        left:0,
        marginLeft:20
    },
        btnProfilContainer:{
        position:"absolute",
        zIndex:10,
        right:0,
        marginRight:20
    },
    avatarContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    avatar:{
        borderRadius:100,
        width:150,
        height:150,
        objectFit:'contain',
        margin:10
    },
    avatarName:{
        fontFamily:'Montserrat',
        fontSize:30,
        fontWeight:'700'
    }, 
    mainContent:{
        marginTop:10,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'center'
    },
    map: {
        flex:1,
        borderRadius:8,
        width:'90%'
    },
    buttons:{
        marginHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10,
    },
    mapContainer:{
        height:130,
        marginVertical:10,
        alignItems:'center'
    }
})