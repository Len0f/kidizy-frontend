import { Button, StyleSheet, Text, View } from 'react-native';

export default function InfoPersoBabyScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Info Personnelles Baby Screen</Text>
            <Button
                title="Soumettre"
                onPress={() => navigation.navigate('DashboardBaby')}
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