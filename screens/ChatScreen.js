import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Button,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSelector } from 'react-redux';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn';
import Pusher from 'pusher-js/react-native';
import Message from '../components/Message';
import {url} from '../App'; // Import the API URL from App.js
//pusher
 const pusher = new Pusher('92055fe186a81018cec0', { cluster: 'eu' });
 const BACKEND_ADDRESS = url;

export default function ChatScreen({ navigation, route }) {
    const { profil } = useUser();
    const isParent = profil === 'parent';
    const { from } = route.params || {};
    const {conversation}=route.params

    const [deadlineMessage, setDeadlineMessage] = useState('');
    const [isAccepted,setIsAccepted] = useState(false)

    const user=useSelector((state)=>state.user.value);

    let color;
    if (profil === 'parent') {
        color = "#98C2E6"     
    } else {
        color = "#88E19D"
    };


     
    
//     //pusher
     const [messages, setMessages] = useState([]);
     const [messageText, setMessageText] = useState('');
    //connexion pusher
     useEffect(() => {
    (() => {
      fetch(`${BACKEND_ADDRESS}messages/${user.token}`, { method: 'PUT' });

      const subscription = pusher.subscribe('chat');
      subscription.bind('pusher:subscription_succeeded', () => {
        subscription.bind('message', handleReceiveMessage);
        
      });
    })();
    return () => fetch(`${url}messages/${user.token}`, { method: 'DELETE' });
  }, [user.token]);  

  //recupérations des anciens message
  // useEffect(()=>{
  //   fetch(`${url}messages?token=${user.token}&conversation=${conversation}`).then(response=>response.json())
  //   .then(data=>{
  //       setMessages(messages=>[...messages,data.messagesUser])
        
  //   })
  // },[user.firstName])

  const handleReceiveMessage = (data) => {
    setMessages(messages => [...messages, data]);
  };

//     //pusher send message
    const handleSendMessage = () => {
    if (!messageText) {
      return;
    }

    const payload = {
      idUser: user.id,
      message: messageText,
      createdAt: new Date(),
      conversationId: conversation
      
      
    };

    
console.log('messages',messages)
console.log('conversation',conversation)

    fetch(`${BACKEND_ADDRESS}messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setMessageText('');
    
  };

    const handleBack = () => {
        if (from === 'Contacts') {
            navigation.navigate('Contacts');
        } else if (from === 'ProfilBabyBook') {
            navigation.navigate('ProfilBabyBook');
        } else {
            navigation.goBack(); // Peut être utiliser sans condition mais peut buger si seul.
        }
    };

    const handleNav = () => {
      navigation.navigate('Garde', {from: 'Contacts', profil})
    }

    const handleAccept = () => {
      setIsAccepted(true)
    }

    // Ajouter condition pour screen Baby.

//console.log('message',messages)
    return (
        
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.banner}>
        <ReturnBtn returnScreen={handleBack} />
        <Image style={styles.image} source={require('../assets/babysitter2.png')} />
        <Text style={styles.greetingText}>Prénom Nom</Text>
      </View>

      <View style={[styles.inset, {borderTopColor: color}, {borderLeftColor: color}, {borderRightColor: color}]}>
        <ScrollView style={styles.scroller}>  
          {
            messages.map((message, i) => (
            <Message createdAt={message.createdAt} key={i} text={message.message} id={message.idUser} colorBG={color}/>
            ))
          }
        </ScrollView>

        <View style={styles.inputContainer}>
            {profil === 'parent' ? (
              <>
                <View style={[styles.inputGardes, {backgroundColor: color}]} >
                <MainBtn 
                  userStyle={{
                    backgroundColor: color,
                    borderRadius: 30,
                    width: "50%",
                  }} 
                  clickNav={handleNav}
                  btnTitle="Garde" 
                />
                </View>
              </>
             ) : (
              <>
                <View style={[styles.inputGardes, {backgroundColor: color}]} >
                <TouchableOpacity onPress={() => handleAccept()} style={[styles.validButton, {backgroundColor: color}]} >
                  <FontAwesome name="check" color="#15ff00ff" size={26} />
                </TouchableOpacity>
                <MainBtn 
                  userStyle={{
                    backgroundColor: color,
                    borderRadius: 30,
                    width: "50%",
                  }} 
                  clickNav={handleNav}
                  btnTitle="Garde" 
                />
                <TouchableOpacity onPress={() => handleSendMessage()} style={[styles.validButton, {backgroundColor: color}]} >
                  <Entypo name="cross" color="#ff0000ff" size={28} />
                </TouchableOpacity>
                </View>
              </>
            )}
          <View style={styles.inputBtn} >
            <TextInput onChangeText={(value) => setMessageText(value)} value={messageText} style={styles.input} autoFocus />
            <TouchableOpacity onPress={() => handleSendMessage()} style={[styles.sendButton, {backgroundColor: color}]} >
              <FontAwesome name="send" color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
        
        // <TextInput onChangeText={(value)=>setMessageText(value)}value={messageText} placeholder='Message'/>
        //    <Button
        //                 title="send"
        //                 onPress={() => {
        //                     handleSendMessage()
        //                 }}
        //             /> 
        //     {/* Partie babysitter */}
        //     {profil === 'parent' ? (
        //         <>
        //             <Text>Envoyer une modification de garde</Text>
        //             <TextInput
        //                 placeholder='Texte'
        //                 onChangeText={setDeadlineMessage}
        //                 value={deadlineMessage}
        //             />
        //             <Button
        //                 title="Envoyer la demande"
        //                 onPress={() => {
        //                     console.log('Demande envoyée', deadlineMessage);
        //                 }}
        //             />

        //         </>
        //     ) : 

        //     {/* Partie Parent */}
        //     (
        //         <>
        //         <Text>Validation de la garde</Text>
        //         <Button
        //             title="Valider"
        //             onPress={() => navigation.navigate('Pay')}
        //         />
        //         <Button
        //                 title="Refuser"
        //         />
        //         </>
        //     )}
        //     <Button
        //         title="Retour"
        //         onPress={() => handleBack()}
        //     />
        // </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inset: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#FFFBF0',
    width: '100%',
    paddingTop: 20,
    position: 'relative',
    borderTopColor: '#ffe099',
    borderLeftColor: '#ffe099',
    borderRightColor: '#ffe099',
    borderTopWidth: 4,
    borderRightWidth: 0.1,
    borderLeftWidth: 0.1,
  },
  banner: {
    width: '100%',
    height: '15%',
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  greetingText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
    fontFamily:'Montserrat',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    justifySelf: 'flex-end',
    alignContent: 'flex-start',
    marginBottom: 30,
    marginTop: 'auto',
    background: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    backgroundColor: '#EBE6DA',
    width: '60%',
    padding: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  sendButton: {
    borderRadius: 50,
    padding: 16,
    backgroundColor: '#ffe099',
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  scroller: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  image: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginTop: 5,
    marginRight: 5,
    marginLeft: 15,
  },
  inputGardes: {
    flexDirection: "row",
    width: "100%",
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  inputBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    justifySelf: 'flex-end',
    alignContent: 'flex-start',
    marginBottom: 30,
    marginTop: 'auto',
    background: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
  },
  validButton: {
    borderRadius: 50,
    padding: 16,
    backgroundColor: '#ffe099',
    marginLeft: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 6.41,
  },
})