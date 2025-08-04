import { Button, StyleSheet, Text, View } from 'react-native';

export default function ContactsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Contacts Screen</Text>
            {/* <Button
                title="Soumettre"
                onPress={() => navigation.navigate('DashboardBaby')}
            /> */}
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