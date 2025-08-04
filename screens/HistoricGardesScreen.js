import { Button, StyleSheet, Text, View } from 'react-native';

export default function HistoricGardesScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Historic Gardes Screen</Text>
            <Button
                title="Voir Garde"
                onPress={() => navigation.navigate('Garde')}
            />
            <Button
                title="Voir Garde"
                onPress={() => navigation.navigate('Garde')}
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