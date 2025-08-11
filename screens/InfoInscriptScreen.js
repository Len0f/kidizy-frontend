import React, { useState } from 'react';
import { Button, StyleSheet, ScrollView, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../contexts/UserContext';
import Input from '../components/Input';
import MainBtn from '../components/mainBtn';
import FranceConnectBtn from '../components/franceConnectBtn';
import ReturnBtn from '../components/returnBtn';
import { useSelector } from 'react-redux';
import { url } from '../App';

export default function InfoInscriptScreen({ navigation }) {
  const { profil } = useUser();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [age, setAge] = useState('');
  const [th, setTH] = useState('');
  const [lastEnfant, setLastEnfant] = useState([{ firstName: '', age: '' }]);


  const [avatarLocal, setAvatarLocal] = useState(null); 
  const [avatarUrl, setAvatarUrl] = useState(null);    


  const [cniUrl, setCniUrl] = useState(null);
  const [casierUrl, setCasierUrl] = useState(null);
  const [cniLocal, setCniLocal] = useState(null);
  const [casierLocal, setCasierLocal] = useState(null);

  const userToken = useSelector((state) => state.user.value.token);

 
  const pickAndUpload = async (type) => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permission requise', 'Accès à la galerie refusé.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.85,
      });
      if (result.canceled) return;

      const asset = result.assets[0];


      if (type === 'AVATAR') setAvatarLocal(asset.uri);
      if (type === 'CNI') setCniLocal(asset.uri);
      if (type === 'CASIER') setCasierLocal(asset.uri);

   
      const form = new FormData();
      form.append('photoFromFront', {
        uri: asset.uri,
        name: 'document.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch(`${url}users/upload`, {
        method: 'POST',
        body: form, 
      });
      const data = await res.json();

      if (!data.result) {
        Alert.alert('Erreur upload', data.error || 'Upload échoué');
        return;
      }

     
      if (type === 'AVATAR') setAvatarUrl(data.url);
      if (type === 'CNI') setCniUrl(data.url);
      if (type === 'CASIER') setCasierUrl(data.url);
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  const handleSubmit = async () => {
    if (!userToken) {
      Alert.alert('Erreur', 'Token manquant');
      return;
    }

    const payload = {
      firstName: prenom,
      lastName: nom,
      phone: telephone,
      token: userToken,
      avatar: avatarUrl || '', 
      babysitterInfos: {
        age: age,
        price: th,
        CNI: cniUrl || '',
        criminalRecord: casierUrl || '',
        bio: Biographie,
        interest: Interest
      },
      parentInfos: {
        kids: lastEnfant,
      },
     
      location: adresse ? { address: adresse } : undefined,
    };
    try {
      const sendinfo = await fetch(`${url}users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await sendinfo.json();
      if (res.result) {
        navigation.navigate('TabNavigator');
      } else {
        Alert.alert('Erreur', res.error || 'Sauvegarde impossible');
      }
    } catch (e) {
      Alert.alert('Erreur réseau', e.message);
    }
  };

  const NAVreturn = () => navigation.navigate('SelectProfil');

  const handleAdd = () => setLastEnfant([...lastEnfant, { firstName: '', age: '' }]);
  const modifAge = (age, i) => setLastEnfant(lastEnfant.map((p, t) => (t === i ? { firstName: p.firstName, age } : p)));
  const modifEnfant = (prenom, i) => setLastEnfant(lastEnfant.map((a, t) => (t === i ? { firstName: prenom, age: a.age } : a)));

  const addEnfant = lastEnfant.map((_, i) => (
    <View key={i} style={styles.containeInput}>
      <Input style={styles.inputEnfant} width="41%" name="Enfant" setText={(prenom) => modifEnfant(prenom, i)} text={lastEnfant[i].firstName} />
      <View style={styles.inputAge}>
        <Input width="100%" name="Age" setText={(age) => modifAge(age, i)} text={lastEnfant[i].age} />
      </View>
    </View>
  ));

  let UserStyle;
  let color;
  if (profil === 'parent') {
    color = { color: '#98C2E6' };
    UserStyle = { backgroundColor: '#98C2E6', width: '92%', marginTop: 20 };
  } else {
    color = { color: '#88E19D' };
    UserStyle = { backgroundColor: '#88E19D', width: '92%', marginTop: 20 };
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView>
      
        <View style={styles.containeImage}>
          <View style={styles.containeLogo}>
            <ReturnBtn returnScreen={NAVreturn} />
            <Image style={styles.logo} source={require('../assets/KidizyLogo.png')} />
          </View>

          
          <TouchableOpacity
            style={[styles.containePhoto, { backgroundColor: profil === 'parent' ? '#9FC6E7' : '#88E19D' }]}
            onPress={() => pickAndUpload('AVATAR')}
            activeOpacity={0.8}
          >
            <Image
              style={styles.photo}
              source={
                avatarLocal
                  ? { uri: avatarLocal }
                  : require('../assets/babysitter2.png') 
              }
            />
          </TouchableOpacity>
          <Text style={styles.changePhotoHint}>Changer la photo</Text>
        </View>

        
        {profil === 'parent' ? (
          <>
            <View style={styles.containeInput}>
              <Input style={styles.inputNom} width="41%" name="Nom" setText={setNom} text={nom} />
              <View style={styles.inputPrenom}>
                <Input width="100%" name="Prénom" setText={setPrenom} text={prenom} />
              </View>
            </View>
            <View style={styles.containeInput}>
              <Input style={styles.inputAdresse} width="90%" name="Adresse" setText={setAdresse} text={adresse} />
            </View>
            <View style={styles.containeInput}>
              <Input style={styles.inputTelephone} width="90%" name="Télephone" setText={setTelephone} text={telephone} />
            </View>

            <View style={styles.containeEnfant}>
              <View style={styles.containeBtnEnfant}>
                <TouchableOpacity style={styles.btnContainer} onPress={handleAdd}>
                  <View style={styles.triangle}></View>
                </TouchableOpacity>
              </View>
              <View style={styles.containeInputEnfant}>{addEnfant}</View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.containeInput}>
              <Input style={styles.inputNom} userStyle={color} width="41%" name="Nom" setText={setNom} text={nom} />
              <View style={styles.inputPrenom}>
                <Input userStyle={color} width="100%" name="Prénom" setText={setPrenom} text={prenom} />
              </View>
            </View>
            <View style={styles.containeInput}>
              <Input style={styles.inputAdresse} userStyle={color} width="90%" name="Adresse" setText={setAdresse} text={adresse} />
            </View>
            <View style={styles.containeInput}>
              <Input style={styles.inputTelephone} userStyle={color} width="90%" name="Télephone" setText={setTelephone} text={telephone} />
            </View>

            
            <View style={styles.containeInput}>
              <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: '#88E19D' }]} onPress={() => pickAndUpload('CNI')}>
                <Text style={styles.uploadText}>{cniUrl ? 'CNI importée' : 'Importer CNI'}</Text>
              </TouchableOpacity>
              <View style={styles.inputAge}>
                <Input width="100%" name="Age" setText={setAge} text={age} />
              </View>
            </View>
            {cniLocal ? (
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Image source={{ uri: cniLocal }} style={{ width: 140, height: 90, borderRadius: 6 }} />
                {cniUrl ? <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>OK • Uploadé</Text> : null}
              </View>
            ) : null}

           
            <View style={styles.containeInput}>
              <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: '#88E19D' }]} onPress={() => pickAndUpload('CASIER')}>
                <Text style={styles.uploadText}>{casierUrl ? 'Casier importé' : 'Importer Casier judiciaire'}</Text>
              </TouchableOpacity>
              <View style={styles.btnFrance}>
                <FranceConnectBtn />
              </View>
            </View>
            {casierLocal ? (
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Image source={{ uri: casierLocal }} style={{ width: 140, height: 90, borderRadius: 6 }} />
                {casierUrl ? <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>OK • Uploadé</Text> : null}
              </View>
            ) : null}

        
            <View style={styles.containeInput}>
              <Input style={styles.inputTH} userStyle={color} width="60%" name="Taux Horaire" setText={setTH} text={th} />
            </View>
          </>
        )}

        <View style={styles.containeBtn}>
          <MainBtn userStyle={UserStyle} btnTitle={'Soumettre'} clickNav={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF0', alignItems: 'center' },

  containeImage: { height: '35%', width: '100%', justifyContent: 'center', alignItems: 'center' },
  containeLogo: { height: '35%', width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 50 },
  logo: { flex: 0.5, width: '40%', objectFit: 'contain', marginLeft: 30 },

  containePhoto: { height: 155, width: 155, justifyContent: 'center', alignItems: 'center', borderRadius: 100, overflow: 'hidden' },
  photo: { height: 155, width: 155, resizeMode: 'cover' },
  changePhotoHint: { marginTop: 8, color: '#6b6b6b', fontSize: 12 },

  containeInput: { width: '100%', height: '10%', marginLeft: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 0.1 },
  inputPrenom: { width: '41%', marginLeft: 20 },
  btnFrance: { marginLeft: 20 },
  inputAge: { marginLeft: 20, width: '20%' },

  btnContainer: {
    backgroundColor: '#98C2E6',
    alignItems: 'center',
    borderRadius: 30,
    padding: 15,
    width: 45,
    height: 45,
    justifyContent: 'center',
    shadowColor: '#263238',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 8.7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#979797',
    borderRightColor: '#979797',
    transform: [{ rotate: '0deg' }],
  },
  containeBtn: { marginLeft: 25, marginBottom: 25 },

  containeEnfant: { width: '100%' },
  containeBtnEnfant: { width: '20%', position: 'absolute', zIndex: 10, right: 0, top: 22 },
  containeInputEnfant: { position: 'relative' },

  uploadBtn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, minWidth: '60%', alignItems: 'center', justifyContent: 'center' },
  uploadText: { color: '#fff', fontWeight: '700' },
});
