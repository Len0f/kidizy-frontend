import { Button, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function ProfilBookScreen({ navigation }) {
    const { profil } = useUser();

    return (
        <View style={styles.container}>
            <Text>Profil {profil === 'parent' ? 'Babysitter' : 'Parent'} Book Screen</Text>
            
            {profil === 'babysitter' ? (
                <>
                    <Text>Profil du Parent</Text>

                    <Button
                        title="Contacter"
                        onPress={() => navigation.navigate('Chat')}
                    />
                    <Button
                        title="Retour"
                        onPress={() => navigation.navigate('PreviewParent')}
                    />
                </>
            ) : (
                <>
                    <Text>Profil du Babysitter</Text>

                    <Button
                        title="Contacter"
                        onPress={() => navigation.navigate('Chat')}
                    />
                    <Button
                        title="Retour"
                        onPress={() => navigation.navigate('Search')}
                    />
                </>
            )}
            
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