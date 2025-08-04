import { Button, StyleSheet, Text, View } from 'react-native';

export default function DashboardParentScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Dashboard Parent Screen</Text>
            <Button
                title="Gardes"
                onPress={() => navigation.navigate('Gardes')}
            />
             <Button
                title="Messages non lus"
                onPress={() => navigation.navigate('Messages')}
            />
             <Button
                title="ProfilParent"
                onPress={() => navigation.navigate('ProfilParent')}
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