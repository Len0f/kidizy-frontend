import { Button, StyleSheet, Text, View } from 'react-native';

export default function CalendarScreen({ route }) {
    const profil = route.params?.profil || 'babysitter';
    return (
        <View style={styles.container}>
            <Text>Calendar Screen</Text>

            {profil === 'babysitter' && (
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