
import { 
    FlatList, 
    Image, 
    StyleSheet, 
    SafeAreaView,
    View 
} from 'react-native';
import { useEffect, useState } from 'react';
// import * as Location from 'expo-location'; (PAS BESOIN POUR LA SIMULATION)
import { useNavigation } from '@react-navigation/native';

import SearchCard from '../components/searchCard';
import FilterBar from '../components/filterBar';

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

// const babysittersFalse = [
//     {
//         firstName: 'Anakin',
//         lastName: 'Skywalker',
//         rating: 4.5,
//         location: { lat: '48.8520', lon: '2.3480', address: 'Paris' }, // ~2km - Visible avec: 5km, 10km, 20km, Toutes
//         price: 18,
//         babysits: 42,
//         avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
//         age: '26',
//         availability: [
//             { day: 'Lundi', startHour: '08:00', endHour: '12:00' },
//             { day: 'Mercredi', startHour: '14:00', endHour: '18:00' }
//         ]
//     },
//     {
//         firstName: 'Leia',
//         lastName: 'Organa',
//         rating: 4.9,
//         location: { lat: '48.8800', lon: '2.3800', address: 'Paris' }, // ~7km - Visible avec: 10km, 20km, Toutes
//         price: 20,
//         babysits: 50,
//         avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
//         age: '24',
//          availability: [
//             { day: 'Lundi', startHour: '09:00', endHour: '17:00' },
//             { day: 'Vendredi', startHour: '10:00', endHour: '13:00' }
//         ]
//     },
//     {       
//         firstName: 'Luke',
//         lastName: 'Skywalker',
//         rating: 3.2,
//         location: { lat: '48.9000', lon: '2.4200', address: 'Paris' }, // ~15km - Visible avec: 20km, Toutes
//         price: 17,
//         babysits: 30,
//         avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
//         age: '22',
//          availability: [
//             { day: 'Jeudi', startHour: '09:00', endHour: '17:00' },
//             { day: 'Samedi', startHour: '20:00', endHour: '23:00' }
//         ]
//     },
//     {
//         firstName: 'Rey',
//         lastName: 'Palpatine',
//         rating: 2.5,
//         location: { lat: '48.9300', lon: '2.4800', address: 'Paris' }, // ~25km - Visible avec: Toutes seulement
//         price: 15,
//         babysits: 18,
//         avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
//         age: '20',
//          availability: [
//             { day: 'Dimanche', startHour: '10:00', endHour: '15:00' },
//             { day: 'Mercredi', startHour: '14:00', endHour: '18:00' }
//         ]
//     },
// ];

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
    useEffect(() => {
        // ------------------ ON FORCE LES DONNEES DE SIMULATIONS
        setParent(parentFalse);
        setParentLocation(parentFalse.location);

        // setBabysitters(babysittersFalse);


        // ---------------------- RECUPERATION DES BABYSITTERS
        fetch('https://')
    

    }, []);


    // ---------------------- RECUPERATION DU PARENT VIA TOKEN


    //         fetch(`https:192.33.0.42:3000/users/me/${token}`)
    //         .then(response => response.json())
    //         .then ((data) => {
    //             if(data.result) {
    //                 setParent(data.user);
    //                 setParentLocation(data.user.location || currentPosition);
    //             } else {
    //                 console.log("Erreur parent :", data.error);
    //             }
    //         });


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