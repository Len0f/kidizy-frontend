import { Button, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function DashboardScreen({ navigation }) {
    const { profil } = useUser();
    return (
        <View style={styles.container}>
            <Text>Dashboard {profil === 'parent' ? 'Parent' : 'Babysitter'}</Text>
            
            {profil === 'parent' ? (
                <>
                    <Button
                        title="Gardes"
                        onPress={() => navigation.navigate('HistoricGardes')}
                    />
                    <Button
                        title="Messages non lus"
                        onPress={() => navigation.navigate('Contacts', {profil: 'parent'})}
                    />
                    <Button
                        title="ProfilParent"
                        onPress={() => navigation.navigate('ProfilUser')}
                    />
                </>
            ) : (
                <>
                    <Button
                        title="Gardes"
                        onPress={() => navigation.navigate('HistoricGardes')}
                    />
                    <Button
                        title="Messages non lus"
                        onPress={() => navigation.navigate('Contacts', {profil: 'babysitter'})}
                    />
                    <Text>Prochaine garde</Text>
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