import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';

export default function ChatScreen({ navigation, route }) {

    const { from, profil } = route.params || {};
    const isParent = profil === 'parent';

    const [deadlineMessage, setDeadlineMessage] = useState('');

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