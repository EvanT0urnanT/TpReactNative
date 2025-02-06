import React, { useState, useEffect } from 'react';
import { TextInput, Button, FlatList, View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCameraPermissions } from "expo-camera";
import { useMealContext } from '../../context/MealContext';
import uuid from 'react-native-uuid';

const EdamamAPI = 'https://api.edamam.com/api/food-database/v2/parser';

const AddMeal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foodResults, setFoodResults] = useState<any[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const { addMeal } = useMealContext();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const searchFood = async () => {
    if (!searchTerm) return;

    try {
      const response = await fetch(
        `${EdamamAPI}?app_id=${process.env.EXPO_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.EXPO_PUBLIC_EDAMAM_KEY}&ingr=${searchTerm}`
      );
      const data = await response.json();
      setFoodResults(data.hints);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les aliments');
    }
  };

  const selectFood = (food: any) => {
    setSelectedFoods((prev) => [...prev, food]);
  };

  const scanQRCode = () => {
    router.push('/(main)/add/camera');
  };

  const validateMeal = () => {
    if (selectedFoods.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner des aliments');
      return;
    }

    var kcalFood = 0;
    selectedFoods.forEach(food => {
      kcalFood += food.food.nutrients.ENERC_KCAL;
    });

    const newMeal = {
      id: uuid.v4(),
      name: 'Repas du jour',
      ingredients: selectedFoods,
      kcal: kcalFood,
    }

    addMeal(newMeal);

    Alert.alert('Succès', 'Repas ajouté avec succès');
    setSearchTerm('');
    setSelectedFoods([]);
    setFoodResults([]);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter</Text>
      {/* Barre de recherche */}
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Rechercher un aliment"
        style={styles.searchInput}
      />
      <Button title="Rechercher" onPress={searchFood} color="#3498db" />

      {/* Liste des résultats */}
      <FlatList
        data={foodResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            <Text style={styles.foodName}>{item.food.label}</Text>
            <Button title="Sélectionner" onPress={() => selectFood(item)} color="#2ecc71" />
          </View>
        )}
      />

      {/* QR Code Scanner */}
      <TouchableOpacity style={styles.scanButton} onPress={scanQRCode}>
        <Ionicons name="scan" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Aliments sélectionnés */}
      {selectedFoods.length > 0 && (
        <View style={styles.selectedFoodsContainer}>
          <Text style={styles.selectedFoodsTitle}>Aliments sélectionnés :</Text>
          <FlatList
            data={selectedFoods}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.selectedFood}>{item.food.label}</Text>}
          />
        </View>
      )}

      {/* Validation */}
      <TouchableOpacity style={styles.validateButton} onPress={scanQRCode}>
        <Ionicons name="checkmark" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  foodName: {
    fontSize: 16,
    color: "#2c3e50",
  },
    scanButton: {
      backgroundColor: "#3498db",
      padding: 15,
      borderRadius: 50,
      position: "absolute",
      bottom: 30,
      left: 30,  // Positionné à gauche
      justifyContent: "center",
      alignItems: "center",
    },
  
    validateButton: {
      backgroundColor: "#27ae60",
      padding: 15,
      borderRadius: 50,
      position: "absolute",
      bottom: 30,
      right: 30, // Positionné à droite
      justifyContent: "center",
      alignItems: "center",
    },
  
  selectedFoodsContainer: {
    marginTop: 20,
  },
  selectedFoodsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  selectedFood: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
});

export default AddMeal;
