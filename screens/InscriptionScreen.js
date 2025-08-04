import { Button, StyleSheet, Text, View } from 'react-native';

export default function InscriptionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Inscription Screen</Text>
            <Button
                title="Inscription"
                onPress={() => navigation.navigate('SelectProfil')}
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