import {Text, TouchableOpacity, StyleSheet,View} from 'react-native';



export default function ReturnBtn(props){

  

    return (
            
          <TouchableOpacity style={styles.btnContainer}>
            <View style={styles.triangle}></View>
          </TouchableOpacity>
        
     );

     

}

const styles = StyleSheet.create({
  btnContainer:{
    backgroundColor:'#EBE6DA', //couleur à passer en #98C2E6 si c'est un parent ou #EBE6DA
    alignItems: 'center',
    borderRadius: 30,
    padding:15,
    width:55,
    height:55,
    justifyContent:'center'
  },
  triangle: {
   width: 0,
   height: 0,
   borderTopWidth : 5,
   borderBottomWidth : 5,
   borderLeftWidth:0,
   borderRightWidth: 8.7,
   borderTopColor: 'transparent',
   borderBottomColor:'transparent',
   borderLeftColor:'#979797',
   borderRightColor:'#979797',
   transform: [{rotate: '0deg'}]
}
})