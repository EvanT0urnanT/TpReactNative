import React, { useState } from 'react';
import { TextInput, Button, FlatList, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect } from 'react';
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

  // Valider le repas
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
      name:  'Repas du jour',
      ingredients:  selectedFoods,
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
    <View style={{ flex: 1, padding: 20 }}>
      {/* Barre de recherche */}
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Rechercher un aliment"
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          paddingLeft: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Rechercher" onPress={searchFood} />

      {/* Liste des résultats */}
      <FlatList
        data={foodResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <Text>{item.food.label}</Text>
            <Button title="Sélectionner" onPress={() => selectFood(item)} />
          </View>
        )}
      />

      {/* QR Code Scanner */}
      <Button title="Scanner un QR Code" onPress={scanQRCode} />

      {/* Aliments sélectionnés */}
      {selectedFoods.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text>Aliments sélectionnés :</Text>
          <FlatList
            data={selectedFoods}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>{item.food.label}</Text>}
          />
        </View>
      )}

      {/* Validation */}
      <Button title="Valider le repas" onPress={validateMeal} />
    </View>
  );
};

export default AddMeal;
