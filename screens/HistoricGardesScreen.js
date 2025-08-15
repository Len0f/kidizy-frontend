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
import { useEffect, useState } from 'react';
import {url} from '../App';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {url} from '../App';
import { useSelector } from 'react-redux';

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
    const user = useSelector((state) => state.user.value);

const [Gardes, setGardes] = useState([])

// Data et Couleur change selon le type de profil
const { profil } = useUser();
const datatoDisplay = profil === 'parent' ? gardParentFake : gardBabyFake;
const buttonColor = profil === 'parent' ? '#98C2E6' : '#88E19D';

useEffect(()=>{
    fetch(`${url}gardes/new/id?token=${user.token}&id=${user.id}`)
    .then(response=>response.json())
    .then(data=>{

        const garde = data.garde.map((g, i)=>{
            if(profil === 'parent'){
                    return <UserCard
                    key={i}
                    avatar={g.idUserBabysitter.avatar}
                    name={`${g.idUserBabysitter.firstName} ${g.idUserBabysitter.lastName}`}
                    age={g.idUserBabysitter.babysitterInfos.age}
                    guards={'0'}
                    btnTitle="Voir"
                    userColor={buttonColor}
                    onPress = {() =>
                        navigation.navigate('Garde', {from: 'Contacts', profil, infoGarde: g})
                    }
                    />
                } else {
                    return <UserCard
                    key={i}
                    avatar={g.idUserParent.avatar}
                    name={`${g.idUserParent.firstName} ${g.idUserParent.lastName}`}
                    guards={'0'}
                    btnTitle="Voir"
                    userColor={buttonColor}
                    onPress = {() =>
                        navigation.navigate('Garde', {from: 'Contacts', profil, infoGarde: g})
                    }
                    />
                }
                })
                setGardes(garde)
            })
},[])

return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Image 
                style={styles.logo}
                source={require('../assets/KidizyLogo.png')}
            />
            <Text style={styles.screenTitle}>Gardes</Text>
        </View>

    <View>
        {Gardes}
    </View>
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