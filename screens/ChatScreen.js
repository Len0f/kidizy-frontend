import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useSelector } from 'react-redux';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn';
import Pusher from 'pusher-js/react-native';
import Message from '../components/Message';
import { url as BACKEND_ADDRESS } from '../App';

// ⚡ Config Pusher
const pusher = new Pusher('92055fe186a81018cec0', { cluster: 'eu' });

export default function ChatScreen({ navigation, route }) {
  const { profil } = useUser();
  const isParent = profil === 'parent';
  const {from, conversation} = route.params || {};
  const user = useSelector((state) => state.user.value);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const scrollViewRef = useRef(null);

  // 🎯 Couleur selon profil
  const color = profil === 'parent' ? "#98C2E6" : "#88E19D";

  
  
  // 📡 Abonnement Pusher
  useEffect(() => {
    
    const channelName = `chat.${conversation}`;
    const channel = pusher.subscribe(channelName);

    // Écoute des nouveaux messages
    channel.bind('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Récupérer les anciens messages
    fetch(`${BACKEND_ADDRESS}messages?token=${user.token}&conversationId=${conversation}`)
      .then(res => res.json())
      .then(data => {
        console.log('data',data)
        setMessages([...messages,...data.messagesUser])
      })
      .catch(err => console.error("Erreur récupération messages:", err));

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [conversation, user.token]);

  // 📨 Envoi d'un message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const payload = {
      idUser: user.id,
      message: messageText,
      createdAt: new Date(),
      conversationId: conversation,
      conversation: conversation
    };

    fetch(`${BACKEND_ADDRESS}messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(err => console.error("Erreur envoi message:", err));

    setMessageText('');
  };

  // 🔙 Retour
  const handleBack = () => {
    navigation.navigate('Contacts');
  };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      {/* 🔹 Header */}
      <View style={styles.banner}>
        <ReturnBtn returnScreen={handleBack} />
        <Image style={styles.image} source={require('../assets/babysitter2.png')} />
        <Text style={styles.greetingText}>Prénom Nom</Text>
      </View>

      {/* 🔹 Zone messages */}
      <View style={[styles.inset, { borderTopColor: color, borderLeftColor: color, borderRightColor: color }]}>
        <ScrollView
          style={styles.scroller}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <Message
              key={i}
              createdAt={msg.createdAt}
              text={msg.message}
              id={msg.idUser}
              colorBG={color}
            />
          ))}
        </ScrollView>

        {/* 🔹 Zone input */}
        <View style={styles.inputBtn}>
          <TextInput
            onChangeText={setMessageText}
            value={messageText}
            style={styles.input}
            placeholder="Votre message..."
          />
          <TouchableOpacity onPress={handleSendMessage} style={[styles.sendButton, { backgroundColor: color }]}>
            <FontAwesome name="send" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF0' },
  inset: {
    flex: 1, borderTopLeftRadius: 50, borderTopRightRadius: 50,
    backgroundColor: '#FFFBF0', width: '100%', paddingTop: 20,
    borderTopWidth: 4, borderRightWidth: 0.1, borderLeftWidth: 0.1,
  },
  banner: {
    width: '100%', height: '15%', paddingTop: 20, paddingLeft: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  greetingText: { color: 'black', fontWeight: 'bold', fontSize: 18, marginLeft: 15 },
  scroller: { paddingHorizontal: 20 },
  image: { height: 35, width: 35, borderRadius: 50, marginLeft: 15 },
  inputBtn: {
    flexDirection: 'row', padding: 20, alignItems: 'center'
  },
  input: {
    backgroundColor: '#EBE6DA', flex: 1, padding: 14, borderRadius: 30
  },
  sendButton: {
    borderRadius: 50, padding: 16, marginLeft: 12, alignItems: 'center', justifyContent: 'center'
  }
});
