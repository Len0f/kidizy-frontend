import {Text, StyleSheet, View, Image} from 'react-native';
import MainBtn from './mainBtn';


export default function UserCard(props){

    return (
            
          <View style={styles.userContainer}>
            <View style={styles.userHeader}>
                <Image style={styles.avatar} source={require('../assets/pepefroggie.jpg')}/>
                <View style={styles.name}>
                    <Text style={styles.userName} >Pere Castor</Text>
                    <Text style={styles.userGuards}>XXX gardes</Text>
                </View>
            </View>
            <View style={styles.userFooter}>
                <MainBtn style={styles.button} btnTitle={props.btnTitle} userStyle={{backgroundColor:props.userColor, paddingVertical:8, width:'auto'}}/>
            </View>
          </View>
        
     );

     

}

const styles = StyleSheet.create({
  userContainer:{
    width:'100%',
    backgroundColor:'#FFFBF0',
    padding: 15,
    borderRadius: 8,

    //generation des ombres
    shadowColor: "#263238",
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  userHeader:{
    display:'flex',
    flexDirection:'row',
  },
  avatar:{
    width:50,
    height:50,
    borderRadius:50
  },
  name:{
    marginHorizontal:10
  },
  userName:{
    fontFamily:'Montserrat',
    fontSize:20,
    fontWeight:'600'
  },
    userGuards:{
    fontFamily:'Montserrat',
    fontSize:14,
    fontWeight:'400',
    color:'#979797'
  },
  userFooter:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  button:{
    height:50
  }
})