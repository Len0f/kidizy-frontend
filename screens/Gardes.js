import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import ReturnBtn from '../components/returnBtn';
import MainBtn from '../components/mainBtn';
import TextInfo from '../components/TextInfo';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSelector } from 'react-redux';
import { url } from '../App';

// Lire la route get
// remplir les champs nécéssaire.

export default function GardeScreen({ navigation, route }) {
  const { profil } = useUser();
  const token = useSelector((state) => state.user.value.token);

  let userColor = profil === 'parent' ? '#98C2E6' : '#88E19D';

  // --------- Timer
  const [debutGarde, setDebutGarde] = useState(false);
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(0);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (start) {
      intervalIdRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 1000);
    }
    return () => clearInterval(intervalIdRef.current);
  }, [start]);

  const debutDeGarde = () => {
    setDebutGarde(true);
    setStart(true);
    startTimeRef.current = Date.now() - time;
  };

  const finDeGarde = () => {
    navigation.navigate('Notation');
    setDebutGarde(false);
    setStart(false);
  };

  function formatTime() {
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }


  const data = { Prenom: 'Josiane', Nom: 'Pichet', Jour: '09/08', Horaires: '19H00-23H00', Enfant: 'Gregory', Commentaires: 'Ne sait pas nager' };
  const keys = Object.keys(data);

  const routeLocation = route?.params?.location || null; 
  
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      if (!token) return;
      try {
        const r = await fetch(`${url}users/me/${token}`);
        const j = await r.json();
        const loc = j?.user?.location;
        if (mounted && loc && (loc.lat || loc.lon)) {
          setUserLocation({
            address: loc.address || '',
            lat: loc.lat,
            lon: loc.lon,
          });
        }
      } catch (_) {}
    };

    if (!routeLocation) fetchMe();
    return () => {
      mounted = false;
    };
  }, [token, routeLocation]);


  const toNum = (v) => {
    if (v === null || v === undefined) return null;
    const n = typeof v === 'string' ? parseFloat(v) : v;
    return Number.isFinite(n) ? n : null;
  };

  const resolvedLocation = useMemo(() => {
  
    const src = routeLocation || userLocation;
    const lat = toNum(src?.lat);
    const lon = toNum(src?.lon);

    if (lat !== null && lon !== null) {
      return {
        latitude: lat,
        longitude: lon,
        address: src?.address || '',
      };
    }
    
    return {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '',
    };
  }, [routeLocation, userLocation]);

  const [region, setRegion] = useState({
    latitude: resolvedLocation.latitude,
    longitude: resolvedLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

 
  useEffect(() => {
    setRegion((prev) => ({
      ...prev,
      latitude: resolvedLocation.latitude,
      longitude: resolvedLocation.longitude,
    }));
  }, [resolvedLocation.latitude, resolvedLocation.longitude]);

  const hasValidCoords = Number.isFinite(resolvedLocation.latitude) && Number.isFinite(resolvedLocation.longitude);

  // --------- Navigation retour
  const { from } = route?.params || {};
  const returnScreen = () => {
    if (from === 'Pay') navigation.navigate('Pay');
    else if (from === 'HistoricGardes') navigation.navigate('HistoricGardes');
    else navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.btnReturnContainer}>
        <ReturnBtn style={styles.returnBtn} returnScreen={returnScreen} />
      </SafeAreaView>

      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitle}>Garde du jour :</Text>
      </View>

      <View style={styles.mainContent}>
        <TextInfo title={keys[0]} textContent={data.Prenom} userStyle={{ color: userColor }} width={'43%'} />
        <TextInfo title={keys[1]} textContent={data.Nom} userStyle={{ color: userColor }} width={'43%'} />
        <TextInfo title={keys[2]} textContent={data.Jour} userStyle={{ color: userColor }} width={'43%'} />
        <TextInfo title={keys[3]} textContent={data.Horaires} userStyle={{ color: userColor }} width={'43%'} />
        <TextInfo title={keys[4] + '(s) à garder'} textContent={data.Enfant} userStyle={{ color: userColor }} width={'90%'} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          mapType="hybrid"
          initialRegion={region}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {hasValidCoords && (
            <Marker
              coordinate={{ latitude: resolvedLocation.latitude, longitude: resolvedLocation.longitude }}
              title={resolvedLocation.address || data.Prenom}
              description={resolvedLocation.address ? 'Adresse de la garde' : undefined}
              pinColor={userColor}
            />
          )}
        </MapView>

        {/* Bouton recentrer discret (ne casse pas ton design) */}
        {/* <TouchableOpacity
          onPress={() =>
            setRegion((prev) => ({
              ...prev,
              latitude: resolvedLocation.latitude,
              longitude: resolvedLocation.longitude,
            }))
          }
          style={styles.recenterBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.recenterText}>Recentrer</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.buttons}>
        <MainBtn
          disabled={debutGarde}
          clickNav={debutDeGarde}
          btnTitle={debutGarde ? `Garde debutée : ${formatTime()}` : 'Debut'}
          userStyle={debutGarde ? { backgroundColor: '#EBE6DA', width: 'auto' } : { backgroundColor: userColor, width: '43%' }}
        />
        <MainBtn
          clickNav={finDeGarde}
          style={styles.btn}
          btnTitle={'Fin'}
          userStyle={!debutGarde ? { backgroundColor: '#EBE6DA', width: '43%', marginTop: 20 } : { backgroundColor: userColor, width: '43%', marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
    position: 'relative',
    alignItems: 'center',
  },
  btnReturnContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    marginLeft: 20,
  },
  screenTitleContainer: {
    marginVertical: 50,
    justifyContent: 'center',
  },
  screenTitle: {
    fontFamily: 'Montserrat',
    fontSize: 28,
    fontWeight: '700',
  },
  buttons: {
    alignItems: 'flex-end',
    width: '90%',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  btn: {
    marginBottom: 20,
    borderWidth: 1,
  },
  mainContent: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
  mapContainer: {
    height: 130,
    width: '90%',
    marginVertical: 10,
  },
  recenterBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  recenterText: {
    fontSize: 12,
    color: '#333',
  },
});
