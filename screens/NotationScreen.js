import { Button, StyleSheet, Text, View } from 'react-native';

export default function NotationScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Notation Screen</Text>
            <Button
                title="Retour"
                onPress={() => navigation.navigate('Garde')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems: 'center',
        justifyContent: 'center',
    }
})