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

export default function PreviewParentScreen({ navigation }) {
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

    const returnScreen = ()=>{
        navigation.navigate('Contacts')
    }
    const goParentProfil = ()=>{
        navigation.navigate('ProfilBook')
    }

    const accept = ()=>{
        navigation.navigate('Chat')
    }

    const refus = ()=>{
        navigation.navigate('Contacts')
    }

    const data = {Prenom:"Josiane",Nom:"Pichet",Jour:"09/08",Horaires:"19H00-23H00",Enfant:"Gregory",Commentaires:"Ne sait pas nager"}
    const keys = Object.keys(data)
    const infos = Object.entries(data)
    console.log(infos)
    console.log(keys)
    
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
                <TextInfo title={keys[0]}textContent={data.Prenom} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title={keys[1]}textContent={data.Nom} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title={keys[2]}textContent={data.Jour} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title={keys[3]}textContent={data.Horaires} userStyle={{color:'#88E19D'}} width={'43%'}/>
                <TextInfo title={keys[4]+'(s) à garder'}textContent={data.Enfant} userStyle={{color:'#88E19D'}} width={'90%'}/>
                <TextInfo title={keys[5]}textContent={data.Commentaires} userStyle={{color:'#88E19D'}} width={'90%'}/>
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
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                <Input name={`${keys[0]}`}setText={setNom} text={nom}  width={'43%'}/>
                <Input name={keys[1]}setText={setPrenom} text={prenom}  width={'43%'}/>
                <Input name={keys[2]}setText={setDay} text={day}  width={'43%'}/>
                <Input name={keys[3]}setText={setHours} text={hours}  width={'43%'}/>
                <Input name={keys[4]+'(s) à garder'}setText={setEnfant} text={enfant}  width={'90%'}/>
                <Input name={keys[5]}setText={setComment} text={comment}  width={'90%'}/>
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
                <MainBtn btnTitle={"Accepter"} userStyle={{backgroundColor:'#98C2E6'}} clickNav={accept}/>
            </View> 
            </KeyboardAvoidingView>
            )}

        </View>
             


    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFBF0',
        position:'relative',
        alignItems:'center'
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
        borderRadius:'100%',
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
        borderRadius:8
    },
    buttons:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'90%',
        marginVertical:10
    },
    mapContainer:{
        height:130,
        width:'90%',
        marginVertical:10
    }
})