import { Button, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function SelectProfilScreen({ navigation }) {
    const { setProfil } = useUser();

    return (
        <View style={styles.container}>
            <Text>Kidizy Selection de profil</Text> 
            <Text>Êtes-vous ?</Text>
            <Button
                title="Inscription Parent"
                onPress={() => {
                    setProfil('parent');
                    navigation.navigate('InfoInscript');
                }}
            />
            <Text>ou</Text>
            <Button
                title="Inscription Babysitter"
                onPress={() => {
                    setProfil('babysitter');
                    navigation.navigate('InfoInscript');
                }}
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