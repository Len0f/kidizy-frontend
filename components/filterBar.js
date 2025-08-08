import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function FilterBar(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(null); // Type de filtre selectionné.

    // Données des options pour chaques filtres.
    const filterData = {
        note: ["Toutes", "1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"],
        location: ["Toutes", "5 km", "10 km", "20 km"],
        age: ["Tous", "18 - 25 ans", "26 - 35 ans", "36 - 45 ans", "46 ans et +"]
    };

    const openModal = (filterType) => {
        setCurrentFilter(filterType);
        setModalVisible(true);
    };

    // Ouvre le modal pour un type de filtre.
    const selectOption = (value) => {
        if (currentFilter === 'note') {
            props.setNoteFilter(value === "Toutes" ? "" : Number(value.split(" ")[0])); // Ex: 4 étoiles = 4 (nombre)
        }
        if (currentFilter === 'location') {
            if (value === "Toutes") {
                props.setLocationFilter("");
            } else {
                props.setLocationFilter(Number(value.split(" ")[0])); // 10 km = 10 (nombre)
            }
        }
        if (currentFilter === 'age') {
            if (value === "Tous") props.setAgeFilter("");

            else {
                // Permet de traduire le libellé affiché dans le menu pour être utilisé par le filtre.
                const mapAges = {
                    "18 - 25 ans": "18-25",
                    "26 - 35 ans": "26-35",
                    "36 - 45 ans": "36-45",
                    "46 ans et +": "46-99"
                };
                props.setAgeFilter(mapAges[value]);
            }
        }

        setModalVisible(false);
    };

    const getLabel = (type) => {
        if(type === 'note') {
            if(!props.noteFilter) return "Note";
            return `${props.noteFilter} ★`;
        }

        if(type === 'location') {
            if(!props.locationFilter) return "Distance";
            return `${props.locationFilter} km`;
        }

        if (type === 'age') {
            if (!props.ageFilter) return "Âge";
            const mapAgesLabel = {
                
                "18-25": "18 - 25 ans",
                "26-35": "26 - 35 ans",
                "36-45": "36 - 45 ans",
                "46-99": "46 ans et +"
            };
            return mapAgesLabel[props.ageFilter];
        }
    };

    return (
        <>
            <Text style={styles.sortText}>Trier par :</Text>
            <View style={styles.row}>

                <TouchableOpacity style={styles.filterBtn} onPress={() => openModal('note')}>
                    <Text style={styles.filterText}>{getLabel('note')}</Text>
                    <FontAwesome name="chevron-down" size={10} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterBtn} onPress={() => openModal('location')}>
                    <Text style={styles.filterText}>{getLabel('location')}</Text>
                    <FontAwesome name="chevron-down" size={10} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterBtn} onPress={() => openModal('age')}>
                    <Text style={styles.filterText}>{getLabel('age')}</Text>
                    <FontAwesome name="chevron-down" size={10} color="#555" />
                </TouchableOpacity>

            </View>


            {/* Choix dans le modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <FlatList
                        data={filterData[currentFilter]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => selectOption(item)}
                            >
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        />
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    sortText: {
        fontSize: 14,
        marginBottom: 8
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },

    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#EBE6DA',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 4
    },

    filterText: {
        fontSize: 14,
        fontWeight: '500'
     },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 250,
        paddingVertical: 10
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    
    optionText: {
        fontSize: 14
    }
})