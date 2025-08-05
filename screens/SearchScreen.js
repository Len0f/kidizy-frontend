import { Button, StyleSheet, Text, View } from 'react-native';

export default function SearchScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Search Screen</Text>
            <Button
                title="Réserver"
                onPress={() => navigation.navigate('ProfilBook')}
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