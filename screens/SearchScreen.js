import { 
    ActivityIndicator,
    FlatList, 
    Image, 
    StyleSheet, 
    SafeAreaView,
    Text,
    View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SearchCard from '../components/searchCard';
import FilterBar from '../components/filterBar';
import { url } from '../App';

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

    // ------------------- Données venant du backend
    const [babysitters, setBabysitters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextOffset, setNextOffset] = useState(0);
    const [error, setError] = useState('');
    
    // Localisation du parent
    const [parentLocation] = useState(parentFalse.location);

    // Etats des filtres
    const [noteFilter, setNoteFilter] = useState(''); // par note
    const [locationFilter, setLocationFilter] = useState(''); // par localisation
    const [ageFilter, setAgeFilter] = useState(''); // par age
    const [availabilityDayFilter, setAvailabilityDayFilter] = useState(''); // par jour
    const [availabilityHoursFilter, setAvailabilityHoursFilter] = useState(''); // par tranches horaires

// -------------------------- CONSTRUCTION DE L'URL /users/babysitters
    const buildUrl = useCallback((offset = 0, limit = 20) => {
        const params = new URLSearchParams();

        if (noteFilter) params.set('rating', String(noteFilter));
        if (ageFilter) params.set('ageRange', ageFilter);
        if (availabilityDayFilter) params.set('day', availabilityDayFilter);
        if (availabilityHoursFilter) params.set('hours', availabilityHoursFilter);

        if (locationFilter && parentLocation?.lat && parentLocation?.lon) {
            params.set('maxDistanceKm', String(locationFilter));
            params.set('parentLat', String(parentLocation.lat));
            params.set('parentLon', String(parentLocation.lon));
        }

        params.set('offset', String(offset));
        params.set('limit', String(limit));

        return `${url}users/babysitters?${params.toString()}`;
    }, [
        noteFilter,
        ageFilter,
        availabilityDayFilter,
        availabilityHoursFilter,
        locationFilter,
        parentLocation,
    ]);

// -------------------------- CHARGEMENT DES BABYSITTERS
    // 20 premiers chargement.

    const loadInitial = useCallback(async () => {
        setRefreshing(true);
        setError('');
        const response = await fetch(buildUrl(0, 20));
        const data = await response.json();
        if (data.result) {
            setBabysitters(data.babysitters || []);
            setHasMore(!!data.hasMore);
            setNextOffset(Number(data.nextOffset || 0));
        } else {
            setError(data.error || 'Erreur inconnue');
        }
    }, [buildUrl]);

    // chargement de la suite.
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        try {
          setLoading(true);
          const response = await fetch(buildUrl(nextOffset, 20));
          const data = await response.json();
          if (data.result) {
              setBabysitters(prev => {
                const merged = [...prev, ...(data.babysitters || [])];
                const seen = new Set();
                return merged.filter(item => {
                  if (!item?._id) return false;
                  if (seen.has(item._id)) return false;
                  seen.add(item._id);
                  return true;
                });
              });
            setHasMore(!!data.hasMore);
            setNextOffset(Number(data.nextOffset || nextOffset));
          } else {
            setError(data.error || 'Erreur inconnue');
          }
        } catch (e) {
          setError('Erreur réseau');
          console.log('Erreur réseau:', e);
        } finally {
          setLoading(false);
        }
    }, [buildUrl, hasMore, loading, nextOffset]);
    
    // Recharger à chaque changement de filtres
    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

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
                        onPress = {() => 
                            navigation.navigate('ProfilBook', {
                                babysitter : item,
                            })
                        }
                    />
                )}
                onEndReachedThreshold={0.3}
                onEndReached={loadMore}
                refreshing={refreshing}
                onRefresh={loadInitial}
                ListFooterComponent={
                    loading ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null
                }
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