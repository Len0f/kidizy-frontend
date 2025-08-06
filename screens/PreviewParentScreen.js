import { Button, StyleSheet, Text, View, SafeAreaView,Image, Dimensions } from 'react-native';
import ReturnBtn from '../components/returnBtn';
import InfoBtn from '../components/infoBtn';
import MainBtn from '../components/mainBtn';
import TextInfo from '../components/TextInfo';
import MapView from 'react-native-maps';

export default function PreviewParentScreen({ navigation }) {

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
    
    return (
        <View style={styles.container}>
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

            <View>
                 <MapView
                initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
                style={styles.map}
            >
            </MapView>
            </View>
            <View style={styles.buttons}>
                <MainBtn btnTitle={"Accepter"} userStyle={{width:"43%"}} clickNav={accept}/>
                <MainBtn btnTitle={"Refuser"} userStyle={{backgroundColor:"#EBE6DA", width:"43%"}} clickNav={refus}/>
            </View>          
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
        flex:0.1,

    },
    buttons:{
        flexDirection:'row',
        justifyContent:'space-evenly'
    }
})