import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function TextInfo(props) {
  
  
    return (
    <View style={styles.container} width={props.width}>
        <View style={styles.containLabel}>
            <Text style={[styles.label, props.userStyle]} >{props.title}</Text>
        </View>
        <View style={styles.containerText}>
            <Text style={styles.text}>{props.textContent}</Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 0,
    alignItems: "flex-start",
    justifyContent: 'center',
    position: "relative",
  },
  text: {
  },
  label: {
    height:20,
    width: "100%",
    textAlign: "left",
    margin: 5,
    marginHorizontal: 10,
    zIndex: 1,
    fontWeight: "bold",
    color: "#9FC6E7"
  },
  containLabel: {
    padding:0,
    margin:0,
    backgroundColor: "#FFFBF0",
    borderRadius: 50,
    position: "absolute",
    top: -15,
    left: 15,
    zIndex: 1,

  },
  containerText: {
    padding: 10,
    alignItems: 'felx-start',
    justifyContent: 'center',
    height: 'auto',
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#EBE6DA",
  },
});

