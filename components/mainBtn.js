import {Text, TouchableOpacity, StyleSheet} from 'react-native';


export default function MainBtn(props){

  

    return (
            
          <TouchableOpacity style={[styles.btnContainer, props.userStyle ]}>
            <Text style={styles.text}>{props.btnTitle}</Text>
          </TouchableOpacity>
        
     );

     

}

const styles = StyleSheet.create({
  btnContainer:{
    backgroundColor:'#88E19D', //couleur à passer en #98C2E6 si c'est un parent ou #EBE6DA
    alignItems: 'center',
    borderRadius: 8,
    padding:15,
    width:'100%'
  },
  text: {
    fontSize: 22,
    color: '#263238',
    fontWeight:'800',
    fontFamily:'Montserrat'
  },
})