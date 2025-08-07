import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

export default function InscriptionScreen({ navigation }) {

    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [samePassword, setSamePassword] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');

    // const handleInscription = async () => {
    //     setErrorMessage(''); // pour réinitialiser les erreurs à chaque tentatives.
        
    //     if (password !== samePassword) {
    //         setErrorMessage("Les mots de passe ne correspondent pas");
    //         return;
    //     }

    //     fetch('http://192.33.0.34:3000/users/signup', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type' : 'application/json'
    //         },
    //         body: JSON.stringify({
    //             email,
    //             password,
    //         }),
    //     })
    //     .then ((response) => response.json())
    //     .then ((dataUser) => {
    //         if(dataUser.result) {
    //             navigation.navigate('SelectProfil');
    //         } else {
    //             setErrorMessage(dataUser.error || `Erreur inconnue lors de l'inscription`);
    //         }
    //     })
    // };

    return (
        <View style={styles.container}>
            <Text>Kidizy Inscription</Text>
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
            />

            {errorMessage ? <Text>{errorMessage}</Text> : null} */}

            <Button
                title="Inscription"
                onPress={() => navigation.navigate('SelectProfil')}
                //onPress={() => handleInscription()}
            />

            <Text>Bouton Google</Text>
            <Text>Bouton LinkedIn</Text>
            
            <Button
                title="Déjà inscrit inscrit ?"
                onPress={() => navigation.navigate('Connexion')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems: 'center',
        justifyContent: 'center',
    }
})