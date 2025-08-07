import { Button, SafeAreaView, StyleSheet, Text, Image, View } from 'react-native';
import { useUser } from '../contexts/UserContext';
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn'
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ProfilBookScreen({ navigation }) {
    const { profil } = useUser();

    const returnScreen = ()=>{
        navigation.navigate('TabNavigator')
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <Text>Profil {profil === 'parent' ? 'Babysitter' : 'Parent'} Book Screen</Text> */}
            
            {profil === 'babysitter' ? (
                <>
                    <Text>Profil du Parent</Text>

                    <Button
                        title="Contacter"
                        onPress={() => navigation.navigate('Chat')}
                    />
                    <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
                    <Button
                        title="Retour"
                        onPress={() => navigation.navigate('PreviewParent')}
                    />
                </>
            ) : (
                <>  
                    <SafeAreaView style={styles.btnReturnContainer}>
                        <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
                    </SafeAreaView>

                    <View style={styles.avatarContainer}>   
                        <Image style={styles.avatar} source={require('../assets/babysitter1.jpg')}/>
                        <View style={styles.userInfos}>
                            <View style={styles.userNameOld}>
                                <Text style={styles.firstName}>Prenom</Text>
                                <Text style={styles.avatarText}>Age</Text>
                            </View>
                            <View style={styles.userPriceDistance}>
                                <View style={styles.locationPrice}>
                                    <FontAwesome name="money" size={20} color={'#FFFBF0'} />
                                    <Text style={styles.avatarText}>   12€</Text>
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

                    </View>
                    

                    <SafeAreaView style={styles.btnContactContainer}>
                        <MainBtn style={styles.contactBtn} btnTitle='Contacter' userStyle={{backgroundColor : '#98C2E6'}}/>
                    </SafeAreaView>
                    
                    <Button
                        title="Contacter"
                        onPress={() => navigation.navigate('Chat')}
                    />
                    
                    <Button
                        title="Retour"
                        onPress={() => navigation.navigate('Search')}
                    />
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
        position:'relative'
    },
    avatar:{
        borderTopRightRadius:8,
        borderTopLeftRadius:8,
        width:'100%'
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
    }
})