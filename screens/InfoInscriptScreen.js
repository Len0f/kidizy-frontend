import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { useUser } from '../contexts/UserContext';
import Input from '../components/Input';
import { useState } from 'react';

export default function InfoInscriptScreen({ navigation }) {
    const { profil } = useUser();

    const handleSubmit = () => {
        navigation.navigate('TabNavigator');
    }

    return (
        <View style={styles.container}>
            <Text>Info Inscription {profil === 'parent' ? 'Parent' : 'Babysitter'}</Text>
            
            {profil === 'parent' ? (
                <>
                <View>
                    <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
                    <Image style={styles.photo}source={require('../assets/babysitter2.png')} />
                </View>
                    <Text>Photo</Text>
                    <Text>Nom</Text>
                    <Text>Prénom</Text>
                    <Text>Adresse</Text>
                    <Text>Téléphone</Text>
                    <Text>Enfants</Text>
                </>
            ) : (
                <>
                    <Text>Photo</Text>
                    <Text>Nom</Text>
                    <Text>Prénom</Text>
                    <Text>Adresse</Text>
                    <Text>Téléphone</Text>
                    <Text>Pièce d'identité</Text>
                    <Text>Casier judicière</Text>
                    <Text>Taux horaires</Text>
                </>
            )}
            
            
            
            
            <Button
                title="Soumettre"
                onPress={() => handleSubmit()}
            />
            <Button
                title="Retour"
                onPress={() => navigation.navigate('SelectProfil')}
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