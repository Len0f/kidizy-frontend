import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function Message(props) {
   const user=useSelector((state)=>state.user.value)
  
  
    return (
    <View style={[styles.messageWrapper, { ...(props.id ===user.id ? styles.messageSent : styles.messageRecieved) }]}>
        {/* <Image style={(props.username != props.params.username ? styles.image : styles.imageNone)} source={{uri:props.urlImage}} } /> */}
        <View style={[styles.message, { ...(props.username === user.firstName ? {backgroundColor: props.colorBG} : {backgroundColor: '#EBE6DA'}) }]}>
            <Text style={styles.messageText}>{props.text}</Text>
        </View>
        <Text style={styles.timeText}>{new Date(props.createdAt).getHours()}:{String(new Date(props.createdAt).getMinutes()).padStart(2, '0')}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    alignItems: "flex-start",
    justifyContent: 'center',
    position: "relative",
  },
  image: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginTop: 5,
    marginRight: 5,
  },
  imageNone: {
    display: 'none',
  },
   message: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
    maxWidth: '65%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  messageWrapper: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  messageSent: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  messageRecieved: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start'
  },
  messageText: {
    color: '#506568',
    fontWeight: '400',
  },
  timeText: {
    color: '#506568',
    opacity: 0.5,
    fontSize: 10,
    marginTop: 2,
  },
});

