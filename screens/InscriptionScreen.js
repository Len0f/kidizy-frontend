import { Button, StyleSheet, Text, View } from 'react-native';

export default function InscriptionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Inscription Screen</Text>
            <Button
                title="Inscription"
                onPress={() => navigation.navigate('SelectProfil')}
            />
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