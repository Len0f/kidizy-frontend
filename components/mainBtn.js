import {Text, TouchableOpacity, StyleSheet} from 'react-native';


export default function MainBtn(props){

const handleClick = () => {
  // Condition pour gérer les icons dans le bouton, sinon ça plante (icon dans un text ?).
  if (props.disabled) return;
  if (typeof props.clickNav === 'function') props.clickNav();
};

const content = typeof props.btnTitle === 'string' ?
  <Text style={[styles.text, props.textStyle]}>{props.btnTitle}</Text>
  : props.btnTitle    // pour faire <view>FontAwersome.../></view>
  
    return (
      <TouchableOpacity
        disabled={props.disabled}
        style={[styles.btnContainer, props.userStyle ]}
        onPress={()=>handleClick()}
        accessibilityRole='button'
      >
        {content}
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
});