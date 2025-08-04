import { Button, StyleSheet, Text, View } from 'react-native';

export default function InfoInscriptParentScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Info Inscription Parent Screen</Text>
            <Button
                title="Soumettre"
                onPress={() => navigation.navigate('TabNavigatorParent')}
            />
            <Button
                title="Retour"
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