import { Button, StyleSheet, ScrollView, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Platform  } from 'react-native';
import { useUser } from '../contexts/UserContext';
import Input from '../components/Input';
import MainBtn from '../components/mainBtn';
import FranceConnectBtn from '../components/franceConnectBtn';
import ReturnBtn from '../components/returnBtn';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {url} from '../App'; // Import the API URL from App.js

export default function InfoInscriptScreen({ navigation }) {
    const { profil } = useUser();
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [adresse, setAdresse] = useState('');
    const [telephone, setTelephone] = useState('');
    const [enfant, setEnfant] = useState('');
    const [age, setAge] = useState('');
    const [ci, setCI] = useState('');
    const [cj, setCJ] = useState('');
    const [th, setTH] = useState('');
    const [lastEnfant, setLastEnfant] = useState([]);

    const userToken=useSelector((state)=>state.user.value.token)



    const handleSubmit = async ()=> {
        const sendinfo = await fetch(`${url}users`,{
             method: 'PUT',

             headers: { 'Content-Type': 'application/json' },

             body: JSON.stringify({
                    firstName:prenom,
                    lastName:nom,
                    phone:telephone,
                    token:userToken,
                    babysitterInfos:{
                        age: age,
                        price: th,
                        criminalRecord: cj,
                        },
                    parentInfos:{
                        kids: lastEnfant
                    }
                    })
        })
        const res = await sendinfo.json()
        if (res.result){

        navigation.navigate('TabNavigator')
        };
    }

    const NAVreturn = () => {
        navigation.navigate('SelectProfil')
    }

    const handleAdd = () => {
        setLastEnfant([...lastEnfant, {firstName:'',age:''}])
    };

    const modifAge = (age,i) => {
        setLastEnfant(lastEnfant.map((prenom,t) => {
      if (t === i) {
        return {firstName:prenom.firstName,age:age};
      } else {
        return prenom;
      }
    }));
    };

    const modifEnfant = (prenom,i) => {
        setLastEnfant(lastEnfant.map((Ages,t) => {
      if (t === i) {
        return {firstName:prenom,age:Ages.age};
      } else {
        return Ages;
      }
    }));
    };
    
    const addEnfant = lastEnfant.map((data,i) => {console.log(lastEnfant)
        return <View style={styles.containeInput}>
                    <Input style={styles.inputEnfant} width="41%" name="Enfant" setText={(prenom)=>{modifEnfant(prenom,i)}} text={lastEnfant[i].enfants} />
                    <View style={styles.inputAge}>
                        <Input  width="100%" name="Age" setText={(age)=>{modifAge(age,i)}} text={lastEnfant[i].ages} />
                    </View>
                </View>
    })
     

    let UserStyle;
    let color;
    if (profil === 'parent') {
        color = {color: "#98C2E6"}
        UserStyle = {backgroundColor: '#98C2E6', width : "92%", marginTop: 20}
    } else {
        color = {color: "#88E19D"}
        UserStyle = {backgroundColor: '#88E19D', width : "92%", marginTop: 20}
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>    
            {profil === 'parent' ? (
                <>
                
                <View style={styles.containeImage}>
                    <View style={styles.containeLogo}>
                        <ReturnBtn returnScreen={NAVreturn}/>
                        <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
                    </View>
                    <View style={styles.containePhoto}>
                        <Image style={styles.photo} source={require('../assets/babysitter2.png')} />
                    </View>
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputNom} width="41%" name="Nom" setText={setNom} text={nom} />
                    <View style={styles.inputPrenom}>
                        <Input  width="100%" name="Prénom" setText={setPrenom} text={prenom} />
                    </View>
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputAdresse} width="90%" name="Adresse" setText={setAdresse} text={adresse} />
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputTelephone} width="90%" name="Télephone" setText={setTelephone} text={telephone} />
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputEnfant} width="41%" name="Enfant" setText={setEnfant} text={enfant} />
                    <View style={styles.inputAge}>
                        <Input  width="100%" name="Age" setText={setAge} text={age} />
                    </View>
                    <View style={styles.inputAge}>
                        <TouchableOpacity style={styles.btnContainer} userStyle={{color:"#98C2E6"}} onPress={()=>handleAdd()}>
                            <View style={styles.triangle}></View>
                        </TouchableOpacity>
                    </View>
                </View>
                {addEnfant}
                    {/* <Text>Photo</Text>
                    <Text>Nom</Text>
                    <Text>Prénom</Text>
                    <Text>Adresse</Text>
                    <Text>Téléphone</Text>
                    <Text>Enfants</Text> */}
                </>
            ) : (
                <>
                    <View style={styles.containeImage}>
                    <View style={styles.containeLogo}>
                        <ReturnBtn returnScreen={NAVreturn}/>
                        <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} onPress={()=>addPhoto()} />
                    </View>
                    <View style={[styles.containePhoto, {backgroundColor: "#88E19D"}]}>
                        <Image style={styles.photo} source={require('../assets/babysitter2.png')} />
                    </View>
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputNom} userStyle={color} width="41%" name="Nom" setText={setNom} text={nom} />
                    <View style={styles.inputPrenom}>
                        <Input userStyle={color} width="100%" name="Prénom" setText={setPrenom} text={prenom} />
                    </View>
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputAdresse} userStyle={color} width="90%" name="Adresse" setText={setAdresse} text={adresse} />
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputTelephone} userStyle={color} width="90%" name="Télephone" setText={setTelephone} text={telephone} />
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputEnfant} width="41%" name="Carte d'identité" setText={setCI} text={ci} />
                    <View style={styles.inputAge}>
                        <Input  width="100%" name="Age" setText={setAge} text={age} />
                    </View>
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputCJ} userStyle={color} width="60%" name="Casier Judiciare" setText={setCJ} text={cj} />
                    <View style={styles.btnFrance}>
                        <FranceConnectBtn />
                    </View>
                </View>
                <View style={styles.containeInput}>
                    <Input style={styles.inputTH} userStyle={color} width="60%" name="Taux Horaire" setText={setTH} text={th} />
                </View>
                    {/* <Text>Photo</Text>
                    <Text>Nom</Text>
                    <Text>Prénom</Text>
                    <Text>Adresse</Text>
                    <Text>Téléphone</Text>
                    <Text>Pièce d'identité</Text>
                    <Text>Casier judicière</Text>
                    <Text>Taux horaires</Text> */}
                
                </>
            )}
            <View style={styles.containeBtn}>
            <MainBtn 
                userStyle ={UserStyle}
                btnTitle={"Soumettre"} 
                clickNav={handleSubmit}
                                />
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems:'center'
    },
    containeImage: {
        margin: 0,
        padding: 0,
        height: "35%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    containeLogo: {
        margin: 0,
        marginLeft: 50,
        padding: 0,
        height: "35%",
        width: "100%",
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
    },
    logo:{
        flex:0.5,
        width:'40%',
        objectFit:'contain',
        marginLeft: 30,
    },
    containePhoto: {
        height: 155,
        width: 155,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#9FC6E7",
    },
    photo: {
        padding: 0,
        margin: 0,
        height: 150,
        width: 150,
    },
    containeInput: {
        width: "100%",
        height: "10%",
        margin: 0,
        marginLeft: 20,
        flexDirection :"row",
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 0.1,
    },
    inputPrenom: {
        width: "41%",
        marginLeft: 20,
    },
    btnFrance: {
        marginLeft: 20,
    },
    inputAge: {
        marginLeft: 20,
        width: "20%"
    },
    btnContainer:{
    backgroundColor:'#98C2E6',
    alignItems: 'center',
    borderRadius: 30,
    padding:15,
    width:45,
    height:45,
    justifyContent:'center',
    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  triangle: {
   width: 0,
   height: 0,
   borderTopWidth : 5,
   borderBottomWidth : 5,
   borderLeftWidth:0,
   borderRightWidth: 8.7,
   borderTopColor: 'transparent',
   borderBottomColor:'transparent',
   borderLeftColor:'#979797',
   borderRightColor:'#979797',
   transform: [{rotate: '0deg'}]
},
containeBtn:{
    marginLeft: 25,
    marginBottom: 25,
},
})