import { Button, StyleSheet, Text, View } from 'react-native';

export default function InscriptionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Kidizy Inscription</Text>
            <Text>Input email</Text>
            <Text>Input mdp</Text>
            <Text>Input confirmation mdp</Text>
            <Button
                title="Inscription"
                onPress={() => navigation.navigate('SelectProfil')}
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