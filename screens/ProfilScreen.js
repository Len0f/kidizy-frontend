import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../contexts/UserContext';
import ReturnBtn from '../components/returnBtn'

export default function ProfilScreen({ navigation }) {
    const { profil } = useUser();

    const returnScreen = ()=>{
        navigation.navigate('TabNavigator')
    }

    return (
        <SafeAreaView style={styles.container}>
            <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen}/>
            <Text>Profil {profil === 'parent' ? 'Parent' : 'Babysitter'}</Text>

            

            <Button
                title="Retour"
                onPress={() => navigation.navigate('TabNavigator')}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFBF0',
      
    },

})