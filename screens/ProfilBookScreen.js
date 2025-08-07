import { Button, SafeAreaView, StyleSheet, Text, Image, View, ScrollView } from 'react-native';
import { useUser } from '../contexts/UserContext';
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn'
import TextInfo from '../components/TextInfo'
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ProfilBookScreen({ navigation }) {

    const data = {  firstName:"polo",
    _id: "6891dc1d47776bb23dba4f25",
    lastName:"coco",
    phone:"066652587894",
    location:{"address":"3 rue plus loin","lat":"2","lon":"3"},
    token:"ewNGgpQEyINlPcpwszeb_aX6_NICb9G8",
   babysitterInfos:{
    age: "25",
    price: "15",
    bio: "Etudiant en licence 3 pallette en bois",
    availability: [{
        day:"06/08/2025",
        startHour: "16h",
        endHour: "23h"
    }],
    interest:"barbecue, satan et les petits chat",
    isDocOk:true,
    situation: "etudiant",
    jackpot:"45"}
 }


 const dataParents = {  firstName:"tocar",
    _id: "6891dc1d47776bb23dba4f25",
    lastName:"coco",
    phone:"066652587894",
    location:{"address":"3 rue plus loin","lat":"2","lon":"3"},
    token:"ewNGgpQEyINlPcpwszeb_aX6_NICb9G8",
    parentInfosSchema:{
        kids:[{"firstName":"relou1","age":"5"},{"firstName":"relou2","age":"2"}],
        subscription:"true"
                }
 }



    const { profil } = useUser();

    const returnScreen = ()=>{
        navigation.navigate('TabNavigator')
    }
        const returnbabyScreen = ()=>{
        navigation.navigate('PreviewParent')
    }

        const goChat = ()=>{
        navigation.navigate('PreviewParent')
    }

    let avis = <><View style={styles.avis}>
                    <View style={styles.avisHeader}>
                        <View style={styles.avisEditor}>
                            <Image style={styles.avisAvatar} source={require('../assets/babysitter1.jpg')} width={30} height={30} borderRadius={50}/>
                            <Text style={styles.avisName}>Josiane Pichet</Text>
                        </View>
                        
                        <View style={styles.avisRating}>
                            <View style={styles.avisStars}>
                                <FontAwesome name="star" size={12} color={'#323232'}/>
                                <FontAwesome name="star" size={12} color={'#323232'}/>
                                <FontAwesome name="star" size={12} color={'#323232'}/>
                            </View>
                            <Text style={styles.avisDate}> - il y a longtemps</Text>
                        </View>
                    </View>
                    <Text style={styles.avisContent}>
                        Tout est super génial ! cnzjbcmzcnomcbnmolblECOkeneznezvnezvnezovnzeovnzeùokvnezk
                    </Text>
               </View>
               </>


    const enfants = dataParents.parentInfosSchema.kids
    console.log(enfants)
    const infoenfant = enfants.map((data,i)=>{
        return `${data.firstName}, ${data.age} ans\n`
    })


    return (
        <SafeAreaView style={styles.container}>
            
            

            
            {/* <Text>Profil {profil === 'parent' ? 'Babysitter' : 'Parent'} Book Screen</Text> */}
            
            {profil === 'babysitter' ? (

                //ecran profil parent vu par un babysitter
                <>
                <SafeAreaView style={styles.btnReturnContainer}>
                    <ReturnBtn style={styles.returnBtn} returnScreen={returnbabyScreen}/>
                </SafeAreaView>

                    <ScrollView>
                        <View style={styles.avatarContainer}>    
                            <Image style={styles.avatar} source={require('../assets/babysitter2.png')}/>
                            <View style={styles.userInfos}>
                                <View style={styles.userNameOld}>
                                    <Text style={styles.firstName}>{data.firstName}</Text>
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
                                <Text style={styles.ratingText}>(11)</Text>
                            </View>
                            <Text style={styles.ratingText}>Gardes demandées : 11</Text>
                        </View>
                    

                        <View style={styles.mainContent}>
                            <TextInfo style={styles.textInfo} userStyle={{color:'#88E19D'}} title={"Enfant(s) à garder"} textContent={infoenfant} />
                            <TextInfo style={styles.textInfo} userStyle={{color:'#88E19D'}} title={"Informations complémentaires"} textContent={""}/>
                            <TextInfo style={styles.textInfo} userStyle={{color:'#88E19D'}} title={"Avis"} textContent={avis}/>
                        </View>
                    </ScrollView>  

                    <SafeAreaView style={styles.btnContactContainer}>
                        <MainBtn clickNav={goChat}style={styles.contactBtn} btnTitle='Contacter' userStyle={{backgroundColor : '#88E19D'}}/>
                    </SafeAreaView>
                </>
            ) : ( //ecran profil baysitter vu par un parent
                <>  
                    <SafeAreaView style={styles.btnReturnContainer}>
                                <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
                            </SafeAreaView>

                    <ScrollView>
                        <View style={styles.avatarContainer}>    
                            <Image style={styles.avatar} source={require('../assets/babysitter2.png')}/>
                            <View style={styles.userInfos}>
                                <View style={styles.userNameOld}>
                                    <Text style={styles.firstName}>{data.firstName}</Text>
                                 <Text style={styles.avatarText}>{data.babysitterInfos.age} ans</Text>
                                </View>
                                <View style={styles.userPriceDistance}>
                                    <View style={styles.locationPrice}>
                                        <FontAwesome name="money" size={20} color={'#FFFBF0'} />
                                        <Text style={styles.avatarText}>   {data.babysitterInfos.price}€/h</Text>
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
                                    <FontAwesome name="star" size={18} color={'#323232'}/>
                                    <FontAwesome name="star" size={18} color={'#323232'}/>
                                    <FontAwesome name="star" size={18} color={'#323232'}/>
                                </View>
                                <Text style={styles.ratingText}>(11)</Text>
                            </View>
                            <Text style={styles.ratingText}>Gardes effectuées : 11</Text>
                        </View>
                    

                        <View style={styles.mainContent}>
                            <TextInfo style={styles.textInfo} title={"Biographie"} textContent={data.babysitterInfos.bio}/>
                            <TextInfo style={styles.textInfo} title={"Centre d'intérêts"} textContent={data.babysitterInfos.interest}/>
                            <TextInfo style={styles.textInfo} title={"Avis"} textContent={avis}/>
                        </View>
                    </ScrollView>  

                    <SafeAreaView style={styles.btnContactContainer}>
                        <MainBtn clickNav={goChat}style={styles.contactBtn} btnTitle='Contacter' userStyle={{backgroundColor : '#98C2E6'}}/>
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