import { 
    FlatList,
    Image, 
    StyleSheet, 
    SafeAreaView,
    Text,
    View 
} from 'react-native';
import UserCard from '../components/userCard';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import { useSelector } from 'react-redux';

const user = useSelector((state)=>state.user.value)
const gardParentFake = [
    {
        avatar: require('../assets/babysitter1.jpg'),
        firstName: 'Jane',
        lastName: 'Lepen',
        age: 33,
        guards: 45
    },
        {
        avatar: require('../assets/babysitter3.jpg'),
        firstName: 'Francis',
        lastName: 'Fillon',
        age: 18,
        guards: 23
    },
        {
        avatar: require('../assets/babysitter2.png'),
        firstName: 'Benois',
        lastName: 'Melenchon',
        age: 22,
        guards: 12
    },
]

const gardBabyFake = [
    {
        avatar: require('../assets/babysitter1.jpg'),
        firstName: 'Robert',
        lastName: 'Sarkozy',
        age: 45,
        guards: 5
    },
        {
        avatar: require('../assets/babysitter3.jpg'),
        firstName: 'Françoise',
        lastName: 'Dupont',
        age: 37,
        guards: 3
    },
        {
        avatar: require('../assets/babysitter2.png'),
        firstName: 'Suze',
        lastName: 'Pastis',
        age: 39,
        guards: 1
    },
]


export default function HistoricGardesScreen(navigate) {
    const navigation = useNavigation();

    


    // Data et Couleur change selon le type de profil
    const { profil } = useUser();
    const datatoDisplay = profil === 'parent' ? gardParentFake : gardBabyFake;
    const buttonColor = profil === 'parent' ? '#98C2E6' : '#88E19D';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image 
                    style={styles.logo}
                    source={require('../assets/KidizyLogo.png')}
                />
                <Text style={styles.screenTitle}>Gardes</Text>
            </View>

            <FlatList
                data={datatoDisplay}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <UserCard
                        avatar={item.avatar}
                        name={`${item.firstName} ${item.lastName}`}
                        age={item.age}
                        guards={item.guards}
                        btnTitle="Voir"
                        userColor={buttonColor}
                        onPress = {() =>
                            navigation.navigate('Gardes')
                        }
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFBF0',
    },

    header: {
        alignItems: "center",
        marginBottom:16,
    },

    logo: {
        marginTop: 50,
        height: 50,
        resizeMode: "contain"
    },

    screenTitle:{
        fontFamily:'Montserrat',
        fontSize:25,
        fontWeight:'700',
        marginTop: 30,
    },
})