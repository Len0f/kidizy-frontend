import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignBtn(){

    return (
            
          <TouchableOpacity style={styles.btnContainer}>
            <LinearGradient
            // Button Linear Gradient
            colors={['#88E19D','#98C2E6']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0.8 }}>
            <Text style={styles.text}>Sign Up/In Button</Text>
            </LinearGradient>
          </TouchableOpacity>
        
     );

     

}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer:{
    width:'80%'
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 22,
    color: '#263238',
    fontWeight:'800',
    fontFamily:'Montserrat'
  },
})