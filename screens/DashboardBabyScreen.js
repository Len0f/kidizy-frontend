import { Button, StyleSheet, Text, View } from 'react-native';

export default function DashboardBabyScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Dashboard Baby Screen</Text>
            {/* <Button
                title="Soumettre"
                onPress={() => navigation.navigate('DashboardParent')}
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