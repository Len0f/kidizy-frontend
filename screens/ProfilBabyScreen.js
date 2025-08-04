import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfilBabyScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Profil Baby Screen</Text>
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