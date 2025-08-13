import { Button, SafeAreaView, StyleSheet, Text, Image, View, ScrollView } from 'react-native';
import { useUser } from '../contexts/UserContext';
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn'
import TextInfo from '../components/TextInfo'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {url} from '../App';

export default function ProfilBookScreen({ navigation }) {
    
    const [userInfo, setUserInfo] = useState(null)
    const user = useSelector((state)=>state.user.value)
   const { profil } = useUser();

    let userColor;
    if(profil==='parent'){
        userColor='#98C2E6'
        useEffect(()=>{
        fetch(`${url}users/id/${user.selectedBabysitterId}`)
        .then(response=>response.json())
        .then(data=>{ 
            setUserInfo(data)                
        })
    },[])
    }else{
        userColor='#88E19D'
    }
 
    //gestion des boutons de navigation
    const returnScreen = ()=>{
        navigation.navigate('TabNavigator')
    }
        const returnbabyScreen = ()=>{
        navigation.navigate('Contacts')
    }

        const goChat = ()=>{
        navigation.navigate('PreviewParent')
    }

    // let avis = <><View style={styles.avis}>
    //                 <View style={styles.avisHeader}>
    //                     <View style={styles.avisEditor}>
    //                         <Image style={styles.avisAvatar} source={require('../assets/babysitter1.jpg')} width={30} height={30} borderRadius={50}/>
    //                         <Text style={styles.avisName}>Josiane Pichet</Text>
    //                     </View>
                        
    //                     <View style={styles.avisRating}>
    //                         <View style={styles.avisStars}>
    //                             <FontAwesome name="star" size={12} color={'#323232'}/>
    //                             <FontAwesome name="star" size={12} color={'#323232'}/>
    //                             <FontAwesome name="star" size={12} color={'#323232'}/>
    //                         </View>
    //                         <Text style={styles.avisDate}> - il y a longtemps</Text>
    //                     </View>
    //                 </View>
    //                 <Text style={styles.avisContent}>
    //                     Tout est super génial ! cnzjbcmzcnomcbnmolblECOkeneznezvnezvnezovnzeovnzeùokvnezk
    //                 </Text>
    //            </View>
    //            </>

    
   
    if(!userInfo){
         return <Text>Recuperation des données...</Text>
    }
    // affichage du nombre d'étoiles en fonction du rating
    let stars = []
    for(let i=0;i<userInfo.user.rating;i++){
        stars.push(<FontAwesome key={i} name="star" size={18} color={'#323232'}/>)
    }


        return (
        <SafeAreaView style={styles.container}>
            
            {profil === 'babysitter' ? (
                //ecran profil parent vu par un babysitter
                <>
                <SafeAreaView style={styles.btnReturnContainer}>
                    <ReturnBtn style={styles.returnBtn} returnScreen={returnbabyScreen}/>
                </SafeAreaView>

                    <ScrollView>
                        <View style={styles.avatarContainer}>    
                            <Image style={styles.avatar}/>
                            <View style={styles.userInfos}>
                                <View style={styles.userNameOld}>
                                    <Text style={styles.firstName}>cqqs</Text>
                                </View>
                                <View style={styles.userPriceDistance}>
                                    <View style={styles.locationPrice}>
                                        <FontAwesome name="location-arrow" size={20} color={'#FFFBF0'}/>
                                        <Text style={styles.avatarText}>   3 km</Text>
                                    </View>     
                                </View>
                            </View>
                        </View>
                    
                        <View style={styles.userReview}>
                            <View style={styles.userRating}>
                                <View style={styles.stars}>
                                    <FontAwesome name="star" size={18} color={'#323232'}/>
                                    <FontAwesome name="star" size={18} color={'#323232'}/>
                                    <FontAwesome name="star" size={18} color={'#323232'}/>
                                </View>
                                <Text style={styles.ratingText}></Text>
                            </View>
                            <Text style={styles.ratingText}>Gardes demandées : </Text>
                        </View>
                    

                        <View style={styles.mainContent}>
                            {/* <TextInfo style={styles.textInfo} userStyle={{color:userColor}} title={"Enfant(s) à garder"} textContent={infoenfant} />
                            <TextInfo style={styles.textInfo} userStyle={{color:userColor}} title={"Informations complémentaires"} textContent={""}/>
                            <TextInfo style={styles.textInfo} userStyle={{color:userColor}} title={"Avis"} textContent={avis}/> */}
                        </View>
                    </ScrollView>  

                    <SafeAreaView style={styles.btnContactContainer}>
                        <MainBtn clickNav={goChat}style={styles.contactBtn} btnTitle='Contacter' userStyle={{backgroundColor : userColor}}/>
                    </SafeAreaView>
                </>
            ) : ( //ecran profil baysitter vu par un parent
                <>  
                    <SafeAreaView style={styles.btnReturnContainer}>
                                <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
                            </SafeAreaView>

                    <ScrollView>
                        <View style={styles.avatarContainer}>    
                            <Image style={styles.avatar} source={{uri:userInfo.user.avatar}}/>
                            <View style={styles.userInfos}>
                                <View style={styles.userNameOld}>
                                    <Text style={styles.firstName}>{userInfo.user.firstName}</Text>
                                 <Text style={styles.avatarText}>{userInfo.user.babysitterInfos.age} ans</Text>
                                </View>
                                <View style={styles.userPriceDistance}>
                                    <View style={styles.locationPrice}>
                                        <FontAwesome name="money" size={20} color={'#FFFBF0'} />
                                        <Text style={styles.avatarText}>  {userInfo.user.babysitterInfos.price} €/h</Text>
                                    </View>
                                    <View style={styles.locationPrice}>
                                        <FontAwesome name="location-arrow" size={20} color={'#FFFBF0'}/>
                                        <Text style={styles.avatarText}>   3 km</Text>
                                    </View>     
                                </View>
                            </View>
                        </View>
                    
                        <View style={styles.userReview}>
                            <View style={styles.userRating}>
                                <View style={styles.stars}>
                                    {stars}
                                </View>
                                <Text style={styles.ratingText}></Text>
                            </View>
                            <Text style={styles.ratingText}>Gardes effectuées : 11</Text>
                        </View>
                    

                        <View style={styles.mainContent}>
                            <TextInfo style={styles.textInfo} title={"Biographie"} textContent={userInfo.user.bio}/>
                            <TextInfo style={styles.textInfo} title={"Centre d'intérêts"} textContent={userInfo.user.interest}/>
                            <TextInfo style={styles.textInfo} title={"Avis"} />
                        </View>
                    </ScrollView>  

                    <SafeAreaView style={styles.btnContactContainer}>
                        <MainBtn clickNav={goChat}style={styles.contactBtn} btnTitle='Contacter' userStyle={{backgroundColor : userColor}}/>
                    </SafeAreaView>
                </>
            )}
            
        </SafeAreaView>
    );

    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        position:"relative"
    },
    btnReturnContainer:{
        position:"absolute",
        zIndex:10,
        left:0,
        marginLeft:20
    },
    btnContactContainer:{
        position:'absolute',
        zIndex:10,
        bottom:0,
        right:0,
        width:'40%',
        marginRight:20
    },
    avatarContainer:{
        position:'relative',
        width:'100%',
        height:350
    },
    avatar:{
        borderTopRightRadius:8,
        borderTopLeftRadius:8,
        objectFit:'fill',
        width:'100%',
        height:'100%'
    },
    userInfos:{
        width:'100%',
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    userNameOld:{
        margin:20,
        height:'80%',
        justifyContent:'space-evenly'
    },
    locationPrice:{
        flexDirection:'row',
        alignItems:'center'
    },
    userPriceDistance:{
        margin:20,
        paddingTop:8,
        height:'80%',
        justifyContent:'space-evenly',
        alignItems:'flex-end'
    },
    firstName :{
        fontFamily:'Montserrat',
        fontSize:36,
        fontWeight:'700',
        color:'#FFFBF0',
        textShadowColor:'#323232',
        textShadowRadius:6,
        textShadowOffset:{width: -1, height: 1}

    },
    avatarText:{
        color:'#FFFBF0',
        fontFamily:'Montserrat',
        fontSize: 24,
        textShadowColor:'#323232',
        textShadowRadius:4,
        textShadowOffset:{width: -1, height: 1}
    },
    userReview:{
        justifyContent:'space-between',
        flexDirection:'row',
        paddingHorizontal:20,
        paddingVertical:10
    },
    userRating:{
        flexDirection:'row',
        alignItems:'center'
    },
    stars:{
        flexDirection:'row'
    },
    ratingText:{
        fontFamily:'Montserrat',
        fontSize:18
    },
    textInfo:{
        fontFamily:'Montserrat'
    },
    textInfoNone:{
        display:'none'
    },  
    mainContent:{
        borderTopWidth:1,
        borderTopColor:'#323232',
        paddingTop:10
    },
    avisEditor:{
        flexDirection:'row'
    },
    avisName:{
        fontFamily:'Montserrat',
        fontSize:18,
        marginLeft:8
    }, 
    avisRating:{
        flexDirection:'row',
        alignItems:'center'
    },
    avisStars:{
        flexDirection:'row'
    }, 
    avisDate:{
        fontFamily:'Montserrat'
    },
    avisContent:{
        fontFamily:'Montserrat',
        marginVertical:5,
        color:'#656565ff'
    },
    avis:{
        paddingVertical:5,
        borderBottomWidth:1
    }
})