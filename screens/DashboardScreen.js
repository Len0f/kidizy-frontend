import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../contexts/UserContext';
import NextGuardComponent from '../components/nextGuardComponent'
import GuardComponent from '../components/guardComponent';


export default function DashboardScreen({ navigation }) {
    const { profil } = useUser();

    const clickGuard = ()=>{
        navigation.navigate('HistoricGardes')
    }
     const clickMessages = ()=>{
        navigation.navigate('Contacts', {profil: 'parent'})
    }
    const clickNextGuard = ()=>{
        navigation.navigate('Garde')
    }

    return (
        <View style={styles.container}>
            <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
            <View style={styles.screenTitleContainer}>
                <Text style={styles.screenTitle}>Votre tableau de bord :</Text>
            </View>
            {profil === 'parent' ? (
                <>
                <View style={styles.content}>
                    <GuardComponent click={clickGuard}title={'Gardes'} colorCount={'#98C2E6'}guardStyle={{width:'43%'}} count={0}/>
                    <GuardComponent click={clickMessages} title={'Messages'} colorCount={'#98C2E6'} guardStyle={{width:'43%'}} count={1}/>
                    <NextGuardComponent click={clickNextGuard}guardStyle={{width:'90%'}}/>
                </View>

                 <TouchableOpacity onPress={()=>navigation.navigate('ProfilUser')}><Image style={styles.avatar} source={require('../assets/babysitter1.jpg')}/></TouchableOpacity>
                </>
            ) : (
                <>
                    <Button
                        title="Gardes"
                        onPress={() => navigation.navigate('HistoricGardes')}
                    />
                    <Button
                        title="Messages non lus"
                        onPress={() => navigation.navigate('Contacts', {profil: 'babysitter'})}
                    />
                    <Text>Prochaine garde</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems: 'center',
    },
    logo:{
        marginTop:40,
        height:'10%',
        width:'80%',
        objectFit:'contain'
    },
    screenTitleContainer:{
        marginVertical:50,
        justifyContent:'center'
    },
    screenTitle:{
        fontFamily:'Montserrat',
        fontSize:28,
        fontWeight:'700'
    },
    content:{
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'center'
    },
    avatar:{
        margin:20,
        borderWidth:2,
    width:150,
    height:150,
    borderRadius:100
  },
})