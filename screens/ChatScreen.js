import { Button, StyleSheet, Text, View } from 'react-native';

export default function ChatScreen({ navigation, route }) {

    const { from } = route.params || {};

    const handleBack = () => {
        if (from === 'Contacts') {
            navigation.navigate('Contacts');
        } else if (from === 'ProfilBabyBook') {
            navigation.navigate('ProfilBabyBook');
        } else {
            navigation.goBack(); // Peut être utiliser sans condition mais peut buger si seul.
        }
    };

    // Ajouter condition pour screen Baby.


    return (
        <View style={styles.container}>
            <Text>Chat Screen</Text>
            <Text>Validation de la garde</Text>
            <Button
                title="Valider"
                onPress={() => navigation.navigate('Pay')}
            />
            <Button
                title="Refuser"
            />
            <Button
                title="Retour"
                onPress={() => handleBack()}
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