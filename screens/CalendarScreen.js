import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, KeyboardAvoidingView, Alert, Image } from 'react-native';

const daysOfWeek = [
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
];

// Valeurs par défaut pour les horaires
const defaultStart = '00h';
const defaultEnd = '00h';

export default function CalendarScreen() {
  // Structure : [{day: string, checked: bool, startHour: string, endHour: string}]
  const [days, setDays] = useState(
    daysOfWeek.map(day => ({
      day,
      checked: false,
      startHour: defaultStart,
      endHour: defaultEnd,
    }))
  );

  // Handler pour cocher/décocher
  const handleCheck = idx => {
    setDays(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Handler pour modifier l'heure
  const handleHourChange = (idx, type, value) => {
    setDays(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [type]: value } : item
      )
    );
  };

  const handleSubmit = () => {
    // Ne garder que les jours cochés
    const dispo = days
      .filter(d => d.checked)
      .map(d => ({
        day: d.day,
        startHour: d.startHour,
        endHour: d.endHour,
      }));

   
    if (dispo.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un jour");
      return;
    }
   
    console.log("Disponibilités sélectionnées :", dispo);
    Alert.alert("Bravo", "Disponibilités enregistrées !");
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.logo}source={require('../assets/KidizyLogo.png')} />
        <Text style={styles.title}>Saisie tes disponibilités de la semaine</Text>
        <View style={styles.form}>
          {days.map((item, idx) => (
            <View key={item.day} style={styles.row}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleCheck(idx)}
              >
                <View style={item.checked ? styles.checkedBox : styles.uncheckedBox}>
                  {item.checked && <View style={styles.innerCheck} />}
                </View>
                <Text style={[styles.day, item.checked && styles.checkedDay]}>{item.day}</Text>
              </TouchableOpacity>
              <View style={styles.hourBlock}>
                <Text style={styles.hourLabel}>De</Text>
                <TextInput
                  style={styles.hourInput}
                  value={item.startHour}
                  editable={item.checked}
                  onChangeText={val => handleHourChange(idx, "startHour", val)}
                />
                <Text style={styles.hourLabel}>à</Text>
                <TextInput
                  style={styles.hourInput}
                  value={item.endHour}
                  editable={item.checked}
                  onChangeText={val => handleHourChange(idx, "endHour", val)}
                />
                <Text style={styles.hourLabel}>h</Text>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Soumettre</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBF0',
    alignItems: 'center',
    paddingVertical: 30,
    flexGrow: 1
  },
   logo:{
        flex:0.4,
        width:'30%',
        objectFit:'contain'
    },
  title: {
    fontSize: 18,
    color: '#010101ff',
    marginBottom: 66,
    marginTop:1
  },
  form: {
    width: '80%',
    marginBottom: 20,
    
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.01)',
    borderRadius: 8,
    paddingVertical: 3
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100
  },
  uncheckedBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#020202ff',
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkedBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#88E19D',
    borderRadius: 5,
    backgroundColor: '#88E19D',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerCheck: {
    width: 12,
    height: 12,
    backgroundColor: '#FFF',
    borderRadius: 3
  },
  day: {
    fontSize: 15,
    color: '#888'
  },
  checkedDay: {
    color: '#88E19D',
    fontWeight: 'bold'
  },
  hourBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    gap:2
  },
  hourLabel: {
    fontSize: 14,
    marginHorizontal: 2,
    color: '#C3C3C3'
  },
  hourInput: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EBE6DA',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 6 : 2,
    width: 40,
    textAlign: 'center',
    color: '#353535',
   
  },
  submitBtn: {
   backgroundColor:'#88E19D', 
    alignItems: 'center',
    borderRadius: 8,
    padding:15,
    width:'80%'
  },
  submitText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
