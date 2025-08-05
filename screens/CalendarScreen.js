import { StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';

export default function CalendarScreen({ route }) {
    const {profil} = useUser();
    const isBabysitter = profil === 'babysitter';

    return (
        <View style={styles.container}>
            <Text>Calendar Screen</Text>

            {isBabysitter && (
                <View>
                    <Text>Zone de scroll pour Babysitter</Text>
                </View>
                
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