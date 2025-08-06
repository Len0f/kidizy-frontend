import { Button, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '../contexts/UserContext';
import Input from '../components/Input';
import SignBtn from '../components/signBtn';

export default function ConnectionScreen({ navigation }) {
    const { setProfil } = useUser();

    const connection = () =>{
        fetch('http://192.33.0.108:3000/users/signin',{
             method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({email, password:mdp})
    }).then(response=>response.json()).then(data=>{
        if(data.data==="BABYSITTER"){
            setProfil('babysitter')
            navigation.navigate('TabNavigator')
        } else if(data.data==="PARENT"){
            setProfil('parent')
            navigation.navigate('TabNavigator')
        } else {
            setError('Mot de passe ou Email incorrect')
        }
    })
    }

    return (
     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>  

            <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
            <View style={styles.inputContainer}>
                <Input name="E.mail" />
            </View>
            
            <View style={styles.inputContainer}>
                <Input name ="Mot de passe" userStyle={{color:'#88E19D' }} type={true}/>
            </View>
            <View style={styles.btnContainer}>
                <SignBtn connection={connection} />
            </View>
            
            {/* <Button
                title="Connection Parent"
                onPress={() => {
                    setProfil('parent');
                    navigation.navigate('TabNavigator');
                }} //Direct Dashboard Parent
            />
            <Button
                title="Connection Babysitter"
                onPress={() => {
                    setProfil('babysitter');
                    navigation.navigate('TabNavigator');
                }} //Direct Dashboard Babysitter
            /> */}
            <View style={styles.links}>
                <Text style={styles.connectionLink}>G</Text>
                <Text style={styles.connectionLink}>LI</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.text}>Pas de compte ?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Inscription')}><Text style={styles.signUpLink}> Inscrivez-vous</Text></TouchableOpacity>
            </View>
            

        </KeyboardAvoidingView> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems:'center'
    },
    logo:{
        flex:0.8,
        width:'80%',
        objectFit:'contain'
    },
    inputContainer:{
        width:'80%',
        margin:5
    },
        btnContainer:{
        width:'80%',
        marginTop:20
    },
    footer:{
        flexDirection:'row',
        width:'80%',
        alignItems:'center',
        justifyContent:'center',
        padding:30,
        borderTopWidth:1,
        
    },
    links:{
        width:'80%',
        flexDirection:'row',
        justifyContent:'space-around',
        padding:30
    },
    connectionLink:{
        textAlign:'center',
        width:60,
        height:60,
        fontSize:50,
        fontWeight:'bold',
        borderWidth:1,
        borderRadius:50,
        
    },
    text:{
        fontSize:20,
        fontFamily:'Montserrat'
    },
    signUpLink:{
        fontWeight:'bold',
        fontSize:20,
        fontFamily:'Montserrat'
    }
})