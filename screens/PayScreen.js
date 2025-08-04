import { Button, StyleSheet, Text, View } from 'react-native';

export default function PayScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Chat Screen</Text>

            <Text>Choisissez un mode de paiement :</Text>
            <Button
                title="Paypal"
                onPress={() => navigation.navigate('Garde')}
            />
            <Button
                title="GPay"
                onPress={() => navigation.navigate('Garde')}
            />
            <Button
                title="ApplePay"
                onPress={() => navigation.navigate('Garde')}
            />
            <Button
                title="Payer par carte"
                onPress={() => navigation.navigate('Garde')}
            />
            <Button
                title="Retour"
                onPress={() => navigation.navigate('Chat')}
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