import { Button, StyleSheet, Text, View } from 'react-native';

export default function SelectProfilScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Selection de profil Screen</Text>
            <Button
                title="Inscription Parent"
                onPress={() => navigation.navigate('InfoInscriptParent')}
            />
            <Button
                title="Inscription Babysitter"
                onPress={() => navigation.navigate('InfoInscriptBaby')}
            />
            <Button
                title="Retour"
                onPress={() => navigation.navigate('Inscription')}
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