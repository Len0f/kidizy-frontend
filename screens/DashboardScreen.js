import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../contexts/UserContext';
import NextGuardComponent from '../components/nextGuardComponent'
import GuardComponent from '../components/guardComponent';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useCallback, useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import {url} from '../App';

export default function DashboardScreen({ navigation, route }) {
    const user = useSelector((state) => state.user.value);
    const [avatar, setAvatar] = useState('')
    const [nextGarde, setNextGarde] = useState(null)
    const [noReadMessage, setNoReadMessage] = useState([])
    const { profil } = useUser();
    

    let userColor;
    if(profil==='parent'){
        userColor='#98C2E6'
    }else{
        userColor='#88E19D'
    }


    const clickGuard = ()=>{
        navigation.navigate('HistoricGardes')
    }
     const clickMessages = ()=>{
        navigation.navigate('Contacts', {profil: 'parent'})
    }
    const clickNextGuard = ()=>{
        navigation.navigate('Garde')
    }
    const clickHours = ()=>{
        navigation.navigate('Calendar')
    }

        //recuperation de ses propres données grace au token présent dans le reducer
        useFocusEffect(useCallback(()=>{
            fetch(`${url}users/me/${user.token}`)
            .then(response=>response.json())
            .then(data=>{
                setAvatar(data.user.avatar)
            })
            if(profil === 'babysitter'){
                fetch(`${url}propositions?token=${user.token}&id=${user.id}`)
            .then(response=>response.json())
            .then(data=>{
                const filter = data.filteredPropositions.filter(proposition => 
                    ["PENDING"].includes(proposition.isAccepted)
                );
                setNoReadMessage([...noReadMessage,...filter])
            })
            }
            
        },[]))

    return (
        <View style={styles.container}>
            <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
            <View style={styles.screenTitleContainer}>
                <Text style={styles.screenTitle}>Votre tableau de bord :</Text>
            </View>
            <View style={styles.content}>
                    <GuardComponent click={clickGuard}title={'Gardes'} colorCount={userColor}guardStyle={{width:'43%', borderColor:userColor}} count={0}/>
                    <GuardComponent click={clickMessages} title={'Messages'} colorCount={userColor} guardStyle={{width:'43%', borderColor:userColor}} count={noReadMessage.length}/>
                    <NextGuardComponent click={clickNextGuard}title={'Prochaine garde'} content={'DD/MM/YYYY à XXhXX'}guardStyle={{width:'91%', borderColor:userColor}} dateStyle={{backgroundColor:userColor}}/>
                </View>


            {profil === 'parent' ? (
                <>
                <View>
                    <TouchableOpacity style={styles.avatarContainer} onPress={()=>navigation.navigate('ProfilUser')}>
                        <Image style={styles.avatar} source={{uri:avatar}}/>
                        <FontAwesome style={styles.update}name="gear" size={12} color={'#323232'}/>
                    </TouchableOpacity>     
                </View>  
                </>
            ) : (
                <>
                <View style={styles.content}>        
                    <NextGuardComponent click={clickHours}title={'XXhXX'} content={'travaillées cette semaine'} guardStyle={{width:'91%', borderColor:userColor}} dateStyle={{backgroundColor:'transparent'}}/>
                </View>     
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
    content:{
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'center'
    },
    avatar:{
        borderWidth:5,
        width:150,
        height:150,
        borderRadius:100,
        borderColor:'#98C2E6'
  },
  
  avatarContainer:{
    width:150,
    height:150,
    borderRadius:100,
    position:'relative',
    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  update:{
    position:'absolute',
    right:'47%',
    bottom:'3%',
    color: '#FFFBF0'
  }
})