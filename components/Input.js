import * as React from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';
import { useState } from 'react';

export default function Input(props) {
  
  const [actif, setActif] = useState(false);
  const [text, setText] = useState('');

  const handleClick= ()=> {
    if (text != '') {
      return
    }
    setActif(!actif)
  }

    return (
      <View style={styles.container} width={props.width}>
        {actif && <View style={styles.containLabel}>
        <Text style={[styles.label, props.userStyle]} >{props.name}</Text>
      </View>}
        <TextInput style={styles.textInput}
          secureTextEntry={props.type}
          onFocus={()=>handleClick()}
          onBlur={()=>handleClick()}
          maxLength={280}
          placeholder={props.name}
          placeholderTextColor={"#979797"}
          onChangeText={(value) => setText(value)}
          value={text}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: 15,
    alignItems: "flex-start",
    justifyContent: 'center',
    position: "relative",
    
  },
  textInput: {
    height: 60,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#EBE6DA",
    fontFamily:'Montserrat',
    paddingLeft:18,
    fontSize:18
  },
  label: {
    height:20,
    width: "100%",
    textAlign: "left",
    margin: 5,
    zIndex: 1,
    fontWeight: "bold",
    color: "#9FC6E7",
    fontFamily:'Montserrat',
  },
  containLabel: {
    padding:0,
    margin:0,
    backgroundColor: "#FFFBF0",
    borderRadius: 50,
    position: "absolute",
    top: 0,
    left: 15,
    zIndex: 1,

  },
});

