import { Button, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn'
import TextInfo from '../components/TextInfo'
import MapView, {Marker} from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';

export default function GardeScreen({ navigation, route }) {
    const { profil } = useUser();

    let userColor;
    if(profil==='parent'){
        userColor='#98C2E6'
    }else{
        userColor='#88E19D'
    }

    

    const [debutGarde, setDebutGarde] = useState(false)
    const debutDeGarde = ()=>{
        setDebutGarde(true)
        setStart(true)
        startTimeRef.current = Date.now() - time
    }
      const finDeGarde = ()=>{
        navigation.navigate('Notation')
        setDebutGarde(false)
        setStart(false)
    }

    const data = {Prenom:"Josiane",Nom:"Pichet",Jour:"09/08",Horaires:"19H00-23H00",Enfant:"Gregory",Commentaires:"Ne sait pas nager"}
    const keys = Object.keys(data)
    const infos = Object.entries(data)

    const { from } = route.params || {};

    const returnScreen = ()=>{
        handleBack()
    }

    const handleBack = () => {
        if (from === 'Pay') {
            navigation.navigate('Pay');
        } else if (from === 'HistoricGardes') {
            navigation.navigate('HistoricGardes');
        } else {
            navigation.goBack(); // Peut être utiliser sans condition mais peut buger si seul.
        }
    };

    //gestion du timer
    const [start, setStart] = useState(false)
    const [time, setTime] = useState(0)
    const startTimeRef = useRef(0)
    const intervalIdRef = useRef(null)
    
    useEffect(()=> {
        start && (intervalIdRef.current = setInterval(() => {
            setTime(Date.now() - startTimeRef.current)
        }, 1000)) 
        return () => {
            clearInterval(intervalIdRef.current)
        }
    },[start])
    function formatTime(){
        const totalSeconds = Math.floor(time / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(seconds).padStart(2, "0");

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    return (
        <SafeAreaView style={styles.container}>
            
           
            <SafeAreaView style={styles.btnReturnContainer}>
                <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
            </SafeAreaView>

            <View style={styles.screenTitleContainer}>
                 <Text style={styles.screenTitle}>Garde du jour :</Text>
            </View>
            <View style={styles.mainContent}>
                <TextInfo title={keys[0]}textContent={data.Prenom} userStyle={{color:userColor}} width={'43%'}/>
                <TextInfo title={keys[1]}textContent={data.Nom} userStyle={{color:userColor}} width={'43%'}/>
                <TextInfo title={keys[2]}textContent={data.Jour} userStyle={{color:userColor}} width={'43%'}/>
                <TextInfo title={keys[3]}textContent={data.Horaires} userStyle={{color:userColor}} width={'43%'}/>
                <TextInfo title={keys[4]+'(s) à garder'}textContent={data.Enfant} userStyle={{color:userColor}} width={'90%'}/>
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
                <MainBtn disabled={debutGarde}clickNav={debutDeGarde} btnTitle={(debutGarde ? `Garde debutée : ${formatTime()}` : "Debut")} userStyle={debutGarde ? {backgroundColor:"#EBE6DA", width:"auto"}:{backgroundColor:userColor,width:'43%'}} />
                <MainBtn clickNav={finDeGarde}style={styles.btn} btnTitle={"Fin"} userStyle={!debutGarde ? {backgroundColor:"#EBE6DA", width:"43%", marginTop:20}: {backgroundColor:userColor, width:"43%", marginTop:20}}/>   
            </View> 
          
        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        position:'relative',
        alignItems: 'center',
    },
    btnReturnContainer:{
        position:"absolute",
        zIndex:10,
        left:0,
        marginLeft:20
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
    buttons:{
        alignItems:'flex-end',
        width:'90%',
        marginVertical:10,
        justifyContent:'space-between'
    },
    btn:{
        marginBottom:20,
        borderWidth:1
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
    mapContainer:{
        height:130,
        width:'90%',
        marginVertical:10
    }
})