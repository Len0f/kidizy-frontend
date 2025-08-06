import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { useUser } from '../contexts/UserContext';
import MainBtn from '../components/mainBtn';
import ReturnBtn from '../components/returnBtn';


export default function SelectProfilScreen({ navigation }) {
    const { setProfil } = useUser();

    const NAVreturn = () => {
        navigation.navigate('Inscription');
    };

    const NAVbabysitter = () => {
        setProfil('babysitter');
        navigation.navigate('InfoInscript');
    };

    const NAVparent = () => {
        setProfil('parent');
        navigation.navigate('InfoInscript');
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerReturnBtn} >
                <ReturnBtn 
                    returnSreen={NAVreturn}
                />
            </View>
            <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
            <View style={styles.containerBtn} >
                <Text style={[styles.text, styles.textChoix]}>Êtes-vous ?</Text>
                <View style={[styles.containerBtn, styles.containerBtnBabysitter]} >
                    <MainBtn 
                        btnTitle={"Babysitter"} 
                        clickNav={NAVbabysitter}
                    />
                </View>
                <Text style={[styles.text, styles.textOu]}>ou</Text>
                <View style={[styles.containerBtn, styles.containerBtnParents]} >
                    <MainBtn 
                        userStyle ={{backgroundColor: '#98C2E6'}}
                        btnTitle={"Parents"} 
                        clickNav={NAVparent}
                    />
                </View>
            </View>
            {/* <Button
                title="Inscription Parent"
                onPress={() => {
                    setProfil('parent');
                    navigation.navigate('InfoInscript');
                }}
            />
            <Button
                title="Inscription Babysitter"
                onPress={() => {
                    setProfil('babysitter');
                    navigation.navigate('InfoInscript');
                }}
            />
            <Button
                title="Retour"
                onPress={() => navigation.navigate('Inscription')}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems:'center',
        paddingTop: 50,
    },
    containerReturnBtn: {
        width: '100%',
        justifyContent:'flex-start',
        marginLeft: 50,
    },
    logo:{
        height: 115,
        marginTop: 80,
        marginBottom: 25,
        width:'80%',
        objectFit:'contain',
    },
    text:{
        fontSize:20,
        fontFamily:'Montserrat',
        fontWeight: 'bold',
    },
    containerBtn: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 25,
    },
    containerBtnBabysitter: {
        width: '80%',
    },
    containerBtnParents: {
        width: '80%',
    },
})