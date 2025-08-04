import { Button, StyleSheet, Text, View } from 'react-native';

export default function ConnectionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Connection Screen</Text>
            <Button
                title="Connection Parent"
                onPress={() => navigation.navigate('TabNavigatorParent')} //Direct Dashboard Parent
            />
            <Button
                title="Connection Babysitter"
                onPress={() => navigation.navigate('TabNavigatorBaby')} //Direct Dashboard Babysitter
            />
            <Button
                title="Pas encore inscrit ?"
                onPress={() => navigation.navigate('Inscription')}
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