import { 
    FlatList, 
    Image, 
    StyleSheet, 
    SafeAreaView,
    Text,
    View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SearchCard from '../components/searchCard';
import FilterBar from '../components/filterBar';
import { url } from '../App';
import { selectedId } from '../reducers/user';

// -----------------------Données en dur pour simulation (à retirer plus tard)
const parentFalse = {
  firstName: 'Sophie',
  lastName: 'Martin',
  location: {
    lat: '48.8570',
    lon: '2.3500',
    address: 'Paris, France'
  }
};

export default function SearchScreen() {
    const navigation = useNavigation();

    const token = useSelector((state) => state.user.value.token); // récupère le token Redux
    const [parentLocation, setParentLocation] = useState(null);

// ------------------------- RECUPERATION DE LA LOCALISATION DU PARENT
useEffect(() => {
    if (!token) return; // pas de token → rien à faire

const fetchParentLocation = async () => {
    const res = await fetch(`${url}users/me/${token}`);
    const json = await res.json();

    if (json?.result && json?.user?.role === 'PARENT' && json?.user?.location) {
      const { lat, lon, address } = json.user.location;
      if (lat != null && lon != null) {
        setParentLocation({
          lat: String(lat),
          lon: String(lon),
          address: address || '',
        });
      }
    }
};

fetchParentLocation();
  }, [token]);

// ------------------------- ETATS AVEC DONNEES VENANT DU BACK
    const [babysitters, setBabysitters] = useState([]);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false); // indique si le rafraichissement complet des données est en cours lors du scroll.

    // Etats des filtres
    const [noteFilter, setNoteFilter] = useState('');                               // par note
    const [locationFilter, setLocationFilter] = useState('');                       // par localisation
    const [ageFilter, setAgeFilter] = useState('');                                 // par tranche d'ages
    const [availabilityDayFilter, setAvailabilityDayFilter] = useState('');         // par jour
    const [availabilityHoursFilter, setAvailabilityHoursFilter] = useState('');     // par tranches horaires
    const [sortFilter, setSortFilter] = useState('')     // pour trier par ordre croissant ou décroissant.

// -------------------------- CONSTRUCTION DE L'URL /users/babysitters
    const buildUrl = useCallback(() => {                         // useCallBack : mémorise la fonction pou.  //offset/limit : le nombre de babysitter chargé par bloc.
        const params = new URLSearchParams();                                          // Objet qui permet de créer l'URL

    // Application des filtres : si un ou des filtres sont défini, on l'ajoute dans l'URL comme paramètre GET.
    if (noteFilter) params.set('rating', String(noteFilter));
    if (ageFilter) params.set('ageRange', ageFilter);
    if (availabilityDayFilter) params.set('day', availabilityDayFilter);
    if (availabilityHoursFilter) params.set('hours', availabilityHoursFilter);
    
    if (locationFilter && parentLocation?.lat && parentLocation?.lon) {
      params.set('maxDistanceKm', String(locationFilter));
      params.set('parentLat', String(parentLocation.lat));
      params.set('parentLon', String(parentLocation.lon));
    }
  
    if (sortFilter) params.set('sort', sortFilter);
    
    return `${url}users/babysitters?${params.toString()}`;  // Construction de l'URL.
}, [
    // Dépendances qui permet de recharger l'URL que si le filtre change.
    noteFilter,
    ageFilter,
    availabilityDayFilter,
    availabilityHoursFilter,
    locationFilter,
    parentLocation,
    sortFilter]);
// -------------------------- CHARGEMENT DES BABYSITTERS
    const load = useCallback(() => {
        setRefreshing(true);
        setError('');
        fetch(buildUrl())
        .then(response => response.json())
        .then(data => {
            setBabysitters(data.result ? (data.babysitters || []) : []);
        })
        .catch(() => {
          setError('Impossible de charger les résultats. Réessaie.');
          setBabysitters([]);
        })
        .finally(() => setRefreshing(false));
    }, [buildUrl]);

    // Recharger quand token/user/filtre changent
    useEffect(() => {
        load();
    }, [load, locationFilter, parentLocation]);

    const dispath = useDispatch();
    const recupInfoBaby = (item) =>{
        dispath(selectedId(item._id))
        navigation.navigate('ProfilBook', { babysitter : item })
    }

return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Image 
                style={styles.logo}
                source={require('../assets/KidizyLogo.png')}
            />
        </View>

        <FilterBar
            noteFilter={noteFilter}
            setNoteFilter={setNoteFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            ageFilter={ageFilter}
            setAgeFilter={setAgeFilter}
            availabilityDayFilter={availabilityDayFilter}
            setAvailabilityDayFilter={setAvailabilityDayFilter}
            availabilityHoursFilter={availabilityHoursFilter}
            setAvailabilityHoursFilter={setAvailabilityHoursFilter}

            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
        />

        {error ? (
            <Text style={{ color: 'crimson', marginBottom: 8 }}>{error}</Text>
        ) : null}
       
        {/* LISTE DES BABYSITTERS FILTRES */}
        <FlatList
            data={babysitters}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => (

                <SearchCard
                    avatar={item.avatar}
                    name={`${item.firstName} ${item.lastName}`}
                    price={item.price}
                    age={item.age}
                    guards={item.babysits}
                    rating={item.rating}
                    distance={item.distanceKm ?? ''}
                    btnTitle="Reserver"
                    userColor="#98C2E6"
                    onPress = {() =>recupInfoBaby(item)}
                />
            )}
            
            refreshing={refreshing}
            onRefresh={load}
            ListEmptyComponent={
                !refreshing && !error ? (
                    <Text style={{ textAlign: 'center', marginTop: 24 }}>
                        Aucun résultat pour ces filtres.
                    </Text>
                    ) : null
                }
            contentContainerStyle={{ paddingBottom: 24 }}

        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFBF0',
    },

header: {
    alignItems: "center",
    marginBottom:16,
},

logo: {
    marginTop: 50,
    height: 50,
    resizeMode: "contain"
},

sort: {
    fontSize: 16,
    marginBottom: 8
},
});