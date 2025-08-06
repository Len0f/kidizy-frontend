import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Pusher from 'pusher-js/react-native';
//pusher
const pusher = new Pusher('92055fe186a81018cec0', { cluster: 'eu' });
const BACKEND_ADDRESS = 'http://192.33.0.108:3000';

export default function ChatScreen({ navigation, route }) {
    const { profil } = useUser();
    const isParent = profil === 'parent';
    const { from } = route.params || {};

    const [deadlineMessage, setDeadlineMessage] = useState('');

    const user=useSelector((state)=>state.user.value)

    //pusher
     const [messages, setMessages] = useState([]);
     const [messageText, setMessageText] = useState('');
    //connexion pusher
     useEffect(() => {
    (() => {
      fetch(`${BACKEND_ADDRESS}/messages/${user.firstName}`, { method: 'PUT' });

      const subscription = pusher.subscribe('chat');
      subscription.bind('pusher:subscription_succeeded', () => {
        subscription.bind('message', handleReceiveMessage);
      });
    })();

    return () => fetch(`${BACKEND_ADDRESS}/messages/${user.firstName}`, { method: 'DELETE' });
  }, [user.firstName]);

  const handleReceiveMessage = (data) => {
    setMessages(messages => [...messages, data]);
  };

    //pusher send message
    const handleSendMessage = () => {
    if (!messageText) {
      return;
    }

    const payload = {
      token: user.token,
      message: messageText,
      username: user.firstName,
      createdAt: new Date(),
      updatedAt: new Date(),
      
    };

    fetch(`${BACKEND_ADDRESS}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

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

    // Ajouter condition pour screen Baby.


    return (
        <View style={styles.container}>
            <Text>Chat Screen</Text>

            {/* Partie babysitter */}
            {!isParent && (
                <>
                    <Text>Envoyer une modification de garde</Text>
                    <TextInput
                        placeholder='Texte'
                        onChangeText={setDeadlineMessage}
                        value={deadlineMessage}
                    />
                    <Button
                        title="Envoyer la demande"
                        onPress={() => {
                            console.log('Demande envoyée', deadlineMessage);
                        }}
                    />

                </>
            )}

            {/* Partie Parent */}
            {isParent && (
                <>
                <Text>Validation de la garde</Text>
                <Button
                    title="Valider"
                    onPress={() => navigation.navigate('Pay')}
                />
                <Button
                        title="Refuser"
                />
                </>
            )}
            <Button
                title="Retour"
                onPress={() => handleBack()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        alignItems: 'center',
        justifyContent: 'center',
    }
})