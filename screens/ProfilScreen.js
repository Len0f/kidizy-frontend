import { Button, SafeAreaView, StyleSheet, Text, Image, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import React, { useState, useEffect } from 'react';
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn';
import TextInfo from '../components/TextInfo';
import Input from '../components/Input';
import InputLarge from '../components/InputLarge';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FranceConnectBtn from '../components/franceConnectBtn';
import { useSelector } from 'react-redux';
import { url } from '../App';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilScreen({ navigation }) {
    const { profil } = useUser();
    const [personalStar, setPersonalStar] = useState(3);
    const [adresse, setAdresse] = useState('');
    const [telephone, setTelephone] = useState('');
    const [age, setAge] = useState('');
    const [Biographie, setBiographie] = useState('');
    const [Interest, setInterest] = useState('');
    const [lastEnfant, setLastEnfant] = useState([{ firstName: '', age: '' }]);
    const [th, setTH] = useState(0);

    const [avatarLocal, setAvatarLocal] = useState(null); 
    const [avatarUrl, setAvatarUrl] = useState(null);    


    const [cniUrl, setCniUrl] = useState(null);
    const [casierUrl, setCasierUrl] = useState(null);
    const [cniLocal, setCniLocal] = useState(null);
    const [casierLocal, setCasierLocal] = useState(null);

    const userToken = useSelector((state) => state.user.value.token);

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
    };

    const dataParents = {  firstName:"tocar",
    _id: "6891dc1d47776bb23dba4f25",
    lastName:"coco",
    phone:"066652587894",
    location:{"address":"3 rue plus pres","lat":"2","lon":"3"},
    token:"ewNGgpQEyINlPcpwszeb_aX6_NICb9G8",
    parentInfosSchema:{
        kids:[{firstName:"relou1",age:"5"},{firstName:"relou2",age:"2"}],
        subscription:"true"
                }
    };

    useEffect(() => {        
          fetch(`${url}users/me/${userToken}`)
            .then(response => response.json())
            .then(data => {console.log(data.user)
                setPersonalStar(data.user.rating)
                setAdresse(data.user.location.adress)
                setTelephone(data.user.phone)
                setAge(data.user.babysitterInfos.age)
                setBiographie(data.user.babysitterInfos.bio)
                setInterest(data.user.babysitterInfos.interest)
                setLastEnfant(data.user.parentInfos.kids)
                setTH(data.user.babysitterInfos.price)
                setAvatarUrl(data.user.avatar)
            })
      }, []);

    const pickAndUpload = async (type) => {
        try {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (perm.status !== 'granted') {
            Alert.alert('Permission requise', 'Accès à la galerie refusé.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 0.85,
        });
        if (result.canceled) return;

        const asset = result.assets[0];


        if (type === 'AVATAR') setAvatarLocal(asset.uri);
        if (type === 'CNI') setCniLocal(asset.uri);
        if (type === 'CASIER') setCasierLocal(asset.uri);

    
        const form = new FormData();
        form.append('photoFromFront', {
            uri: asset.uri,
            name: 'document.jpg',
            type: 'image/jpeg',
        });

        const res = await fetch(`${url}users/upload`, {
            method: 'POST',
            body: form, 
        });
        const data = await res.json();

        if (!data.result) {
            Alert.alert('Erreur upload', data.error || 'Upload échoué');
            return;
        }

        
        if (type === 'AVATAR') setAvatarUrl(data.url);
        if (type === 'CNI') setCniUrl(data.url);
        if (type === 'CASIER') setCasierUrl(data.url);
        } catch (e) {
        Alert.alert('Erreur', e.message);
        }
    };

    const handleSubmit = async () => {
        if (!userToken) {
        Alert.alert('Erreur', 'Token manquant');
        return;
        }

        const payload = {
        phone: telephone,
        token: userToken,
        avatar: avatarUrl || '', 
        babysitterInfos: {
            age: age,
            price: th,
            CNI: cniUrl || '',
            criminalRecord: casierUrl || '',
            bio: Biographie,
            interest: Interest
        },
        parentInfos: {
            kids: lastEnfant,
        },
        
        location: adresse ? { address: adresse } : undefined,
        };
        try {
        const sendinfo = await fetch(`${url}users`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const res = await sendinfo.json();
        if (res.result) {
            navigation.navigate('TabNavigator');
        } else {
            Alert.alert('Erreur', res.error || 'Sauvegarde impossible');
        }
        } catch (e) {
        Alert.alert('Erreur réseau', e.message);
        }
    };


    let color;
    if (profil === 'parent') {
        color = "#98C2E6"     
    } else {
        color = "#88E19D"
    };

    const returnScreen = ()=>{
        navigation.navigate('TabNavigator')
    };

    const handleAdd = () => setLastEnfant([...lastEnfant, { firstName: '', age: '' }]);
    const modifAge = (age, i) => setLastEnfant(lastEnfant.map((p, t) => (t === i ? { firstName: p.firstName, age } : p)));
    const modifEnfant = (prenom, i) => setLastEnfant(lastEnfant.map((a, t) => (t === i ? { firstName: prenom, age: a.age } : a)));

    const addEnfant = lastEnfant.map((_, i) => (
        
        <View key={i} style={styles.containeInput}>
          <Input style={styles.inputEnfant} width="41%" placeholder={lastEnfant[i].firstName} name="Enfant" setText={(prenom) => modifEnfant(prenom, i)} text={lastEnfant[i].firstName} />
          <View style={styles.inputAge}>
            <Input width="100%" placeholder={lastEnfant[i].age} name="Age" setText={(age) => modifAge(age, i)} text={lastEnfant[i].age} />
          </View>
        </View>
      ));

    const stars = [];
          for (let i = 1; i < 6; i++) {
            stars.push(<FontAwesome 
                key={i}
                name="star" 
                size={18} 
                color={i <= personalStar ? color : '#323232'}
                />);
          };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            {profil === 'babysitter' ? (
                //ecran profil modif babysitter
                <>
                <SafeAreaView style={styles.btnReturnContainer}>
                    <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
                </SafeAreaView>

                <ScrollView>
                    <View style={styles.avatarContainer}>    
                        <TouchableOpacity
                            style={[styles.avatar, { backgroundColor: color}]}
                            onPress={() => pickAndUpload('AVATAR')}
                            activeOpacity={0.8}
                        >
                        <Image
                            style={styles.photo}
                            source={
                                avatarLocal
                                ? { uri: avatarLocal }
                                : {uri: avatarUrl}
                                }
                        />
                        </TouchableOpacity>
                        <View style={styles.userInfos}>
                            <View style={styles.userNameOld}>
                                    <Text style={styles.firstName}>{data.firstName}</Text>
                            </View>
                            <View style={styles.userPriceDistance}>
                                <View style={styles.locationPrice}>
                                    <FontAwesome name="money" size={20} color={'#FFFBF0'} />
                                    <Text style={styles.avatarText}>   {th}€/h</Text>
                                </View>     
                            </View>
                        </View>
                    </View>
                                    
                    <View style={styles.userReview}>
                        <View style={styles.userRating}>
                            <View style={styles.stars}>
                                {stars}
                            </View>
                            <Text style={styles.ratingText}>(11)</Text>
                        </View>
                        <Text style={styles.ratingText}>Gardes demandées : 11</Text>
                    </View>
                                    
                
                    <View style={styles.mainContent}>
                        <View style={styles.containeInput}>
                                      <Input style={styles.inputAdresse} placeholder={adresse} userStyle={{color: color}} width="90%" name="Adresse" setText={setAdresse} text={adresse} />
                                    </View>
                                    <View style={styles.containeInput}>
                                      <Input style={styles.inputTelephone} placeholder={telephone} userStyle={{color: color}} width="90%" name="Télephone" setText={setTelephone} text={telephone} />
                                    </View>
                        
                                    
                                    <View style={styles.containeInput}>
                                      <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: color }]} onPress={() => pickAndUpload('CNI')}>
                                        <Text style={styles.uploadText}>{cniUrl ? 'CNI importée' : 'Importer CNI'}</Text>
                                      </TouchableOpacity>
                                      <View style={styles.inputAge}>
                                        <Input  userStyle={{color: color}} placeholder={age} width="100%" name="Age" setText={setAge} text={age} />
                                      </View>
                                    </View>
                                    {cniLocal ? (
                                      <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                        <Image source={{ uri: cniLocal }} style={{ width: 140, height: 90, borderRadius: 6 }} />
                                        {cniUrl ? <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>OK • Uploadé</Text> : null}
                                      </View>
                                    ) : null}
                        
                                   
                                    <View style={styles.containeInput}>
                                      <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: color }]} onPress={() => pickAndUpload('CASIER')}>
                                        <Text style={styles.uploadText}>{casierUrl ? 'Casier importé' : 'Importer Casier judiciaire'}</Text>
                                      </TouchableOpacity>
                                      <View style={styles.btnFrance}>
                                        <FranceConnectBtn />
                                      </View>
                                    </View>
                                    {casierLocal ? (
                                      <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                        <Image source={{ uri: casierLocal }} style={{ width: 140, height: 90, borderRadius: 6 }} />
                                        {casierUrl ? <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>OK • Uploadé</Text> : null}
                                      </View>
                                    ) : null}
                        
                                
                                    <View style={styles.containeInput}>
                                      <Input style={styles.inputTH} userStyle={{color: color}} placeholder={th.toString()} width="60%" name="Taux horaire" setText={setTH} text={th} />
                                    </View>
                                    <View style={styles.containeInput}>
                                      <InputLarge style={styles.inputLarge} placeholder={Biographie} height="60" userStyle={{color: color}} width="90%" name="Biographie" setText={setBiographie} text={Biographie} />
                                    </View>
                                    <View style={styles.containeInput}>
                                      <InputLarge style={styles.inputLarge} placeholder={Interest} height="60" userStyle={{color: color}} width="90%" name="Centre d'intérêts" setText={setInterest} text={Interest} />
                                    </View>
                    </View>
                    <SafeAreaView style={styles.containeBtn}>
                        <MainBtn clickNav={handleSubmit}style={styles.contactBtn} btnTitle='Enregistrer' userStyle={{backgroundColor : color}}/>
                    </SafeAreaView>
                </ScrollView>  
                
                </>
            ):(
            //ecran profil modif parent
            
            <>
                <SafeAreaView style={styles.btnReturnContainer}>
                    <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
                </SafeAreaView>

                <ScrollView>
                    <View style={styles.avatarContainer}>    
                        <TouchableOpacity
                            style={[styles.avatar, { backgroundColor: color}]}
                            onPress={() => pickAndUpload('AVATAR')}
                            activeOpacity={0.8}
                        >
                        <Image
                            style={styles.photo}
                            source={
                                avatarLocal
                                ? { uri: avatarLocal }
                                : {uri: avatarUrl} 
                                }
                        />
                        </TouchableOpacity>
                        <View style={styles.userInfos}>
                            <View style={styles.userNameOld}>
                                    <Text style={styles.firstName}>{data.firstName}</Text>
                            </View>
                        </View>
                    </View>
                                    
                    <View style={styles.userReview}>
                        <View style={styles.userRating}>
                            <View style={styles.stars}>
                                {stars}
                            </View>
                            <Text style={styles.ratingText}>(11)</Text>
                        </View>
                        <Text style={styles.ratingText}>Gardes demandées : 11</Text>
                    </View>
                                    
                
                    <View style={styles.mainContent}>
                        <View style={styles.containeInput}>
                                      <Input style={styles.inputAdresse} placeholder={dataParents.location.address} userStyle={{color: color}} width="90%" name="Adresse" setText={setAdresse} text={adresse} />
                                    </View>
                                    <View style={styles.containeInput}>
                                      <Input style={styles.inputTelephone} placeholder={dataParents.phone} userStyle={{color: color}} width="90%" name="Télephone" setText={setTelephone} text={telephone} />
                                    </View>
                                
                                    <View style={styles.containeEnfant}>
                                        <View style={styles.containeBtnEnfant}>
                                            <TouchableOpacity style={styles.btnContainer} onPress={handleAdd}>
                                                <View style={styles.triangle}></View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.containeInputEnfant}>{addEnfant}</View>
                                    </View>
                    </View>
                    <SafeAreaView style={styles.containeBtn}>
                        <MainBtn clickNav={handleSubmit}style={styles.contactBtn} btnTitle='Enregistrer' userStyle={{backgroundColor : color}}/>
                    </SafeAreaView>
                </ScrollView>  
                
                </>
            )}
            {/* <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
            <Text>Profil {profil === 'parent' ? 'Parent' : 'Babysitter'}</Text>

            

            <Button
                title="Retour"
                onPress={() => navigation.navigate('TabNavigator')}
            /> */}
        </KeyboardAvoidingView>
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
        width:'45%',
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
        height:'100%',
        overflow: 'hidden'
    },
    containePhoto: { height: 155, width: 155, justifyContent: 'center', alignItems: 'center', borderRadius: 100, overflow: 'hidden' },
    photo: { height: '100%', width: '100%', resizeMode: 'cover' },
    containeBtn: { marginLeft: 20, marginBottom: 25, marginTop: 25, width: '90%' },
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
    },
    containeInput: { width: '100%', height: '10%', marginLeft: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 0.1 },
    inputPrenom: { width: '41%', marginLeft: 20 },
    btnFrance: { marginLeft: 20 },
    inputAge: { marginLeft: 20, width: '20%' },
    uploadBtn: { height: 50, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, minWidth: '60%', alignItems: 'center', justifyContent: 'center' },
    uploadText: { color: '#263238', fontWeight: '700' },
    containeEnfant: { width: '100%' },
    containeBtnEnfant: { width: '20%', position: 'absolute', zIndex: 10, right: 0, top: 22 },
    containeInputEnfant: { position: 'relative' },
    btnContainer: {
    backgroundColor: '#98C2E6',
    alignItems: 'center',
    borderRadius: 30,
    padding: 15,
    width: 45,
    height: 45,
    justifyContent: 'center',
    shadowColor: '#263238',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 8.7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#979797',
    borderRightColor: '#979797',
    transform: [{ rotate: '0deg' }],
  },
})