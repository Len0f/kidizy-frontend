import { Button, StyleSheet, Text, View } from 'react-native';

export default function GardeScreen({ navigation, route }) {

    const { from } = route.params || {};

    const handleBack = () => {
        if (from === 'Pay') {
            navigation.navigate('Pay');
        } else if (from === 'HistoricGardes') {
            navigation.navigate('HistoricGardes');
        } else {
            navigation.goBack(); // Peut être utiliser sans condition mais peut buger si seul.
        }
    };

    return (
        <View style={styles.container}>
            <Text>Garde Screen</Text>
            <Button
                title="Notation"
                onPress={() => navigation.navigate('Notation')}
            />
            <Button
                title="Retour"
                onPress={() => handleBack()}
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