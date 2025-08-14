import {Text, StyleSheet, View, Image} from 'react-native';
import MainBtn from './mainBtn';


export default function UserCard(props){

    return (
            
          <View style={styles.userContainer}>

            <View style={styles.userHeader}>
                <Image style={styles.avatar} source={{uri:props.avatar}}/>

                <View style={styles.infoContainer}>
                    <Text style={styles.userName} >{props.name}</Text>
                    <Text style={styles.userDetails}>
                    {props.age} ans - {props.guards} gardes
                    </Text>
                </View>
            </View>

            <View style={styles.userFooter}>
                <MainBtn
                  style={styles.button}
                  btnTitle={props.btnTitle}
                  userStyle={{
                    backgroundColor:props.userColor,
                    paddingVertical:6,
                    paddingHorizontal: 12,
                    width:'auto'
                    }}
                   clickNav={props.onPress}
                  />
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12    
  },

  userHeader:{
    flexDirection:'row',
  },

  avatar:{
    width:50,
    height:50,
    borderRadius:50
  },

  infoContainer: {
    flex: 1,
    marginHorizontal: 10
  },

  userName:{
    fontFamily:'Montserrat',
    fontSize: 18,
    fontWeight:'bold'
  },

  userDetails: {
    fontFamily:'Montserrat',
    fontSize:14,
    fontWeight:'400',
  },

  userFooter:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginTop: 10
  },

  button:{
    height:40
  }
})