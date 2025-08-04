import { Button, StyleSheet, Text, View } from 'react-native';

export default function PreviewParentScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Preview Parent Screen</Text>
            <Button
                title="Accepter"
                onPress={() => navigation.navigate('Chat', {profil: 'babysitter'})}
            />
            <Button
                title="Refuser"
            />
            <Button
                title="Retour"
                onPress={() => navigation.navigate('Contacts', {profil: 'babysitter'})}
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