import { Button, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function ProfilScreen({ navigation }) {
    const { profil } = useUser();
    return (
        <View style={styles.container}>
            <Text>Profil {profil === 'parent' ? 'Parent' : 'Babysitter'}</Text>
            <Button
                title="Retour"
                onPress={() => navigation.navigate('TabNavigator')}
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