import { StyleSheet, ScrollView, SafeAreaView, Text, View, Image, KeyboardAvoidingView, Platform  } from 'react-native';
import { useUser } from '../contexts/UserContext';

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Input from "../components/InputLarge";
import MainBtn from '../components/mainBtn';
import { useSelector } from 'react-redux';
import { url } from '../App';
import { useEffect, useState } from 'react';

export default function NotationScreen({ navigation }) {
    const { profil } = useUser();
    const [personalStar, setPersonalStar] = useState(0);
    const [ text, setText] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom]= useState('');
    const [avatar, setAvatar] = useState('');

    const user=useSelector((state)=>state.user.value)

    
    const handleSubmit = () => {
        navigation.navigate('TabNavigator');
    }

    let color;
    if (profil === 'parent') {
        color = "#98C2E6"     
    } else {
        color = "#88E19D"
    };

    const stars = [];
      for (let i = 1; i < 6; i++) {
        stars.push(<FontAwesome 
            key={i}
            name="star" 
            size={60} 
            color={i <= personalStar ? color : '#323232'} 
            onPress={()=> setPersonalStar(i)}
            />);
      };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <SafeAreaView style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={require('../assets/babysitter2.png')}/>
                    <Text style={styles.avatarName}>Prenom</Text>
                </SafeAreaView>
                <View style={styles.containeText}>
                    <Text style={styles.text}>Comment s'est déroulé votre expérience ?</Text>
                </View>
                <View style={styles.etoiles}>
                    {stars}
                </View>
                <View style={styles.containeIB}>
                    <View style={styles.containeInput}>
                        <Input name="Avis" setText={setText} text={text} userStyle={{color: color}} />
                    </View>
                    <View style={styles.containeBtn}>
                        <MainBtn 
                            userStyle ={{backgroundColor: color}}
                            btnTitle={"Soumettre"} 
                            clickNav={handleSubmit}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        // <View style={styles.container}>
        //     <Text>Notation Screen</Text>
        //     <Button
        //         title="Retour"
        //         onPress={() => navigation.navigate('Garde')}
        //     />
        // </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    avatar:{
        borderRadius: 100,
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
    containeText: {
        marginVertical: 25,
    },
    text:{
        fontFamily:'Montserrat',
        fontSize:15,
        fontWeight:'700',
    }, 
    etoiles: {
        flexDirection: "row",
        justifyContent:'center',
        alignItems:'center',
        marginBottom: 25,
    },
    containeIB: {
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
    },
    containeInput: {
        width: "90%",
        maxWidth: "90%",
    },
    containeBtn: {
        width: "90%",
        marginTop: 25,
    },
})