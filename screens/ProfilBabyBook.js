import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfilBabyBookScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Profil Baby Book Screen</Text>
            <Button
                title="Contacter"
                onPress={() => navigation.navigate('Chat')}
            />
            <Button
                title="Retour"
                onPress={() => navigation.navigate('Search')}
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