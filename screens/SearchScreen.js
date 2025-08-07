import { 
    Button, 
    FlatList, 
    Image, 
    StyleSheet, 
    SafeAreaView, 
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from "@react-native-picker/picker";
import * as Location from 'expo-location';

import SearchCard from '../components/searchCard';
import FilterBar from '../components/filterBar';

// Data exemple fictif d'un parent.
const parentTest = {
  firstName: "Sophie",
  lastName: "Martin",
  location: {
    lat: "48.8570",
    lon: "2.3500",
    address: "Paris, France"
  },
  parentInfos: {
    kids: [
      { firstName: "Emma", age: "5" },
      { firstName: "Lucas", age: "8" }
    ]
  }
};


// Data exemple fictif de babysitters.
const babysittersData = [
  {
    firstName: "Anakin",
    lastName: "Skywalker",
    avatar: require("../assets/babysitter2.png"),
    rating: 4.5,
    location: {
        lat: "48.8500",
        lon: "2.3300",
        address: "Paris, France"
    },
    price: 18,
    age: 26,
    babysits: 42
  },
    {
    firstName: "Hannibal",
    lastName: "Lecter",
    avatar: require("../assets/babysitter3.jpg"),
    rating: 2.5,
    location: {
        lat: "48.9000",
        lon: "2.3300",
        address: "Paris, France"
    },
    price: 20,
    age: 40,
    babysits: 42
  },
  {
    firstName: "Penny",
    lastName: "Wise",
    avatar: require("../assets/babysitter1.jpg"),
    rating: 3,
    location: {
      lat: "43.6045",
      lon: "1.4442",
      address: "Toulouse, France"
    },
    price: 15,
    age: 84,
    babysits: 28
  }
];

//Calcul des distances avec Haversine (déjà utilisé dans mappulator)
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

export default function SearchScreen({ navigation }) {

    // Etats des filtres
    const [noteFilter, setNoteFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');

    // Localisation du parent
    const [parentLocation, setParentLocation] = useState(null);

    //On récupère la position du parent (challenge mappulator).
    useEffect(() => {
        (async() => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if(status !== "granted") {
                console.log("Permission de localisation refusée");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setParentLocation(
                parentTest.location // a virer et remplacer par le com' dessous pour la bdd.
                // {lat: location.coords.latitude.toString(),
                // lon: location.coords.longitude.toString()}
        );
        }) ();
    }, []);


    // On filtre selon les 3 critères.
    const filteredBabysitters = babysittersData.filter((b) => {
        let keep = true;

        // Filtrer par note
        if (noteFilter) {
            keep = keep && Math.floor(b.rating) === parseInt(noteFilter);
            // Keep && permet de combiner les filtres.
        }

        // Filtrer par localisation
        if (locationFilter && parentLocation) {
            // Calcul de la distance entre le parent et le babysitter
            const distance = getDistanceKm(
                parseFloat(parentLocation.lat), // Transforme le string en nombre pour la fct getDistance
                parseFloat(parentLocation.lon),
                parseFloat(b.location.lat), 
                parseFloat(b.location.lon)
            );

            // On garde uniquement les babysitter dans le rayon choisi.
            keep = keep && distance <= locationFilter;
            // parseInt transforme la valeur du rayon (ex: "10") en nombre
        }

        // Filtrer par âge.
        if (ageFilter) {
            const [min, max] = ageFilter.split("-").map(Number); // pour faire les intervales d'âges.
            keep = keep && b.age >= min && b.age <= (max || b.age);
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
            />
           
            {/* Liste Babysitters filtrés */}
            <FlatList
                data={filteredBabysitters}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                    let distanceText = "";
                    
                    if (parentLocation) {
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

    picker: {
        backgroundColor: "#EBE6DA",
        marginBottom: 12,
        borderRadius: 12,
        borderRadius: 8,
        height: 40
    },
});