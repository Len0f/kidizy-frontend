import { url } from '../App';
import { 
    FlatList, 
    Image, 
    StyleSheet, 
    SafeAreaView,
    View 
} from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import * as Location from 'expo-location'; (PAS BESOIN POUR LA SIMULATION)
import { useNavigation } from '@react-navigation/native';

import SearchCard from '../components/searchCard';
import FilterBar from '../components/filterBar';

// -----------------------Données en dur pour simulation (à retirer plus tard)
// const parentFalse = {
//   firstName: 'Sophie',
//   lastName: 'Martin',
//   location: {
//     lat: '48.8570',
//     lon: '2.3500',
//     address: 'Paris, France'
//   }
// };

// -------------------------- CALCULS DISTANCE HAVERSINE (déjà utilisé dans mappulator)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

export default function SearchScreen() {
    const navigation = useNavigation();

    // Etat des users
    const [babysitters, setBabysitters] = useState([]);
    const [parent, setParent] = useState(null);
    
    // Localisation du parent
    const [parentLocation, setParentLocation] = useState(null);

    // Etats des filtres
    const [noteFilter, setNoteFilter] = useState(''); // par note
    const [locationFilter, setLocationFilter] = useState(''); // par localisation
    const [ageFilter, setAgeFilter] = useState(''); // par age
    const [availabilityDayFilter, setAvailabilityDayFilter] = useState(''); // par jour
    const [availabilityHoursFilter, setAvailabilityHoursFilter] = useState(''); // par tranches horaires

// -------------------------- RECUPERATION DE LA POSITION DU PARENT (challenge mappulator).
    const token = useSelector((state) => state.user.value.token);

    useEffect(() => {
        // ------------------ RECUPERATION DU PARENT
        if(!token) return;

        console.log("Token utilisé pour le fetch parent :", token);
        fetch(`${url}users/me/${token}`)
        .then(response => response.json())
        .then ((data) => {
            if(data.result) {
                //console.log("Parent connecté récupéré depuis le backend :", data.user);
                setParent(data.user);
                setParentLocation(data.user.location || null);
            } else {
                //console.log("Erreur récupération du parent :", data.error);
            }
        });
        
        // ------------------ RECUPERATION DES BABYSITTERS
        fetch(`${url}users/babysitters`)
        .then(response => response.json())
        .then(data => {
            if(data.result) {
                setBabysitters(data.babysitters);
            } else {
                console.log('Erreur de récupération des babysitters', data.error);
            }
        });
    }, []);

// ----------------------- FILTRE DES BABYSITTERS : 3 CRITERES
    const filteredBabysitters = babysitters.filter((b) => {
        let keep = true;

        // -------------------------- PAR NOTE
        if (noteFilter) {
            keep = keep && Math.floor(b.rating) === parseInt(noteFilter);
            // Keep && permet de combiner les filtres.
        }

        // -------------------------- PAR LOCALISATION
        if (locationFilter && parentLocation) {
            
            if (b.location?.lat && b.location?.lon) {
                // Calcul de la distance entre le parent et le babysitter
                const distance = getDistanceKm(
                    parseFloat(parentLocation.lat), // Transforme le string en nombre pour la fct getDistance
                    parseFloat(parentLocation.lon),
                    parseFloat(b.location.lat), 
                    parseFloat(b.location.lon)
                );

                // On garde uniquement les babysitter dans le rayon choisi.
                keep = keep && distance <= locationFilter;
            } else {
                // On exclut les bb sans positions si le filtre distance est actif.
                keep = false;
            }
        }

        // -------------------------- PAR AGE
        if (ageFilter && b?.age) {
            const [min, max] = ageFilter.split("-").map(Number); // pour faire les intervales d'âges.
            const age = parseInt(b.age);
            keep = keep && age >= min && age <= (max || age);
        }

        // -------------------------- PAR DISPONIBILITE
        // Filtre par jour uniquement
        if (availabilityDayFilter) {
            const isAvailableThatDay = b.availability?.some(slot => slot.day === availabilityDayFilter);
            keep = keep && isAvailableThatDay;
        }

        // Filtre par tranche horaire uniquement
        if (availabilityHoursFilter) {
            const [desiredStart, desiredEnd] = availabilityHoursFilter.split('-');
            const isAvailableThatHour = b.availability?.some(slot =>
                slot.startHour < desiredEnd && slot.endHour > desiredStart
            );
            keep = keep && isAvailableThatHour;
        }

        return keep;
    })

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
           
            {/* LISTE DES BABYSITTERS FILTRES */}
            <FlatList
                data={filteredBabysitters}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                    let distanceText = "";
                    
                    if (
                        parentLocation &&
                        item.location?.lat &&
                        item.location?.lon
                    ) {
                        const dist = getDistanceKm(
                            parseFloat(parentLocation.lat),
                            parseFloat(parentLocation.lon),
                            parseFloat(item.location.lat),
                            parseFloat(item.location.lon)
                        ).toFixed(1);
                        distanceText = dist;
                    }

                    return (
                        <SearchCard
                            avatar={item.avatar}
                            name={`${item.firstName} ${item.lastName}`}
                            price={item.price}
                            age={item.age}
                            guards={item.babysits}
                            rating={item.rating}
                            distance={distanceText}
                            btnTitle="Reserver"
                            userColor="#98C2E6"
                            onPress = {() => 
                                navigation.navigate('ProfilBook', {
                                    babysitter : item,
                                })
                            }
                        />
                    );
                }}
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