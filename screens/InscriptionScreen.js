import { Button, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import Input from '../components/Input';
import SignBtn from '../components/signBtn';
import { updateInfo } from '../reducers/user';
import { useDispatch } from 'react-redux';
import {url} from '../App'; // Import the API URL from App.js

// Écran d'inscription
export default function InscriptionScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [samePassword, setSamePassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch= useDispatch()

    const handleInscription = async () => {
        setErrorMessage(''); // pour réinitialiser les erreurs à chaque tentatives.

        if (password !== samePassword) {
            setErrorMessage("Les mots de passe ne correspondent pas");
            return;
        }

        fetch(`${url}users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
        .then ((response) => response.json())
        .then ((dataUser) => {
            if(dataUser.result) {
                dispatch(updateInfo({
                    token:dataUser.token,
                    id: dataUser._id
                }))
                navigation.navigate('SelectProfil');
            } else {
                setErrorMessage(dataUser.error || `Erreur inconnue lors de l'inscription`);
            }
        })
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
            <View style={styles.inputContainer}>
                <Input name="E.mail" setText={setEmail} text={email} />
            </View>
                        
            <View style={styles.inputContainer}>
                <Input name ="Mot de passe" setText={setPassword} text={password} userStyle={{color:'#88E19D' }} type={true}/>
            </View>
            <View style={styles.inputContainer}>
                <Input name ="Confirmer le mot de passe" setText={setSamePassword} text={samePassword} userStyle={{color:'#88E19D' }} type={true}/>
            </View>
            {errorMessage ? <Text>{errorMessage}</Text> : null}
            <View style={styles.btnContainer}>
                <SignBtn connection={handleInscription} />
            </View>
            {/* <TextInput
                placeholder='Entrez votre Email'
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                placeholder='Mot de Passe'
                onChangeText={setPassword}
                value={password}
            />
            <TextInput
                placeholder='Confirmez votre Mot de Passe'
                onChangeText={setSamePassword}
                value={samePassword}
            /> */}

            {/* <Button
                title="Inscription"
                onPress={() => handleInscription()}
            /> */}

            <View style={styles.links}>
                <Text style={styles.connectionLink}>G</Text>
                <Text style={styles.connectionLink}>LI</Text>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.text}>Déjà inscrit ?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Connexion')}><Text style={styles.signUpLink}> Connexion</Text></TouchableOpacity>
            </View>
            {/* <Button
                title="Déjà inscrit ?"
                onPress={() => navigation.navigate('Connexion')}
            /> */}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems:'center'
    },
    logo:{
        flex:0.8,
        width:'80%',
        objectFit:'contain'
    },
    inputContainer:{
        width:'80%',
        margin:5
    },
        btnContainer:{
        width:'80%',
        marginTop:20
    },
    footer:{
        flexDirection:'row',
        width:'80%',
        alignItems:'center',
        justifyContent:'center',
        padding:30,
        borderTopWidth:1,
        
    },
    links:{
        width:'80%',
        flexDirection:'row',
        justifyContent:'space-around',
        padding:30
    },
    connectionLink:{
        textAlign:'center',
        width:60,
        height:60,
        fontSize:50,
        fontWeight:'bold',
        borderWidth:1,
        borderRadius:50,
        
    },
    text:{
        fontSize:20,
        fontFamily:'Montserrat'
    },
    signUpLink:{
        fontWeight:'bold',
        fontSize:20,
        fontFamily:'Montserrat'
    }
})