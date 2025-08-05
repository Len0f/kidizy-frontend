import { Button, StyleSheet, Text, View } from 'react-native';

export default function PreviewParentScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Preview Parent Screen</Text>

            <Button
                title="Profil ParentBook"
                onPress={() => navigation.navigate('ProfilBook')}
            />

            <Button
                title="Accepter"
                onPress={() => navigation.navigate('Chat')}
            />
            <Button
                title="Refuser"
            />
            <Button
                title="Retour"
                onPress={() => navigation.navigate('Contacts')}
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