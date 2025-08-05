import { Button, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function ContactsScreen({ navigation, route }) {
    const {profil} = useUser();

    return (
        <View style={styles.container}>
            <Text>Contacts Screen</Text>

            {/* Partie uniquement visible par les babysitter */}
            {profil === 'babysitter' && (
                <>
                    <Text>Nouvelles demandes</Text>
                    <Button
                        title="Voir le profil"
                        onPress={() => navigation.navigate('PreviewParent', {from: 'Contacts', profil})}
                    />
                    <Text>En cours</Text>
                </>
            )}

            <Button
                title="Voir le chat"
                onPress={() => navigation.navigate('Chat', {from: 'Contacts', profil})}
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