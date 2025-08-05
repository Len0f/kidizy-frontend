import { Button, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function ConnectionScreen({ navigation }) {
    const { setProfil } = useUser();
    return (
        <View style={styles.container}>
            <Text>Kidizy connection</Text>
            <Text>Input Email</Text>
            <Text>Input mdp</Text>
            <Button
                title="Connection Parent"
                onPress={() => {
                    setProfil('parent');
                    navigation.navigate('TabNavigator');
                }} //Direct Dashboard Parent
            />
            <Button
                title="Connection Babysitter"
                onPress={() => {
                    setProfil('babysitter');
                    navigation.navigate('TabNavigator');
                }} //Direct Dashboard Babysitter
            />

            <Text>Bouton Google</Text>
            <Text>Bouton LinkedIn</Text>

            <Button
                title="Pas encore inscrit ?"
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