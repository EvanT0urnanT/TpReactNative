import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMealContext } from '../context/MealContext';

export default function MealDetailPage() {
    const { id } = useLocalSearchParams();
    const { getMealById, deleteMealById } = useMealContext();
    const router = useRouter(); 
    const [meal, setMeal] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const mealDetails = getMealById?.(id);
            if (mealDetails) {
                setMeal(mealDetails);
            } else {
                Alert.alert('Erreur', 'Repas non trouvé');
            }
        }
    }, [id, getMealById]);

    // Fonction pour supprimer le repas
    const handleDeleteMeal = () => {
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer ce repas ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    onPress: () => {
                        deleteMealById?.(id);
                        router.push('/');
                    },
                    style: "destructive",
                }
            ]
        );
    };

    if (!meal) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Repas non trouvé</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{meal.name}</Text>
            <Text style={styles.detailLabel}>Calories: {parseFloat(meal.kcal || 0).toFixed(1)} kcal</Text>
            <Text style={styles.subTitle}>Ingrédients :</Text>
            <View style={styles.ingredientsList}>
                {meal.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientContainer}>
                        <Text style={styles.ingredientName}>- {ingredient.food.label}</Text>
                        <View style={styles.nutrientList}>
                            <Text style={styles.nutrientItem}>  - KCAL : {parseFloat(ingredient.food.nutrients.ENERC_KCAL || 0).toFixed(1)}</Text>
                            <Text style={styles.nutrientItem}>  - Protéines : {parseFloat(ingredient.food.nutrients.PROCNT || 0).toFixed(1)}g</Text>
                            <Text style={styles.nutrientItem}>  - Lipides : {parseFloat(ingredient.food.nutrients.FAT || 0).toFixed(1)}g</Text>
                            <Text style={styles.nutrientItem}>  - Glucides : {parseFloat(ingredient.food.nutrients.CHOCDF || 0).toFixed(1)}g</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Retour" onPress={() => router.back()} />
                <Button title="Supprimer" color="red" onPress={handleDeleteMeal} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detailLabel: {
        fontSize: 18,
        marginVertical: 5,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    ingredientsList: {
        marginTop: 10,
        marginLeft: 20,
    },
    ingredientItem: {
        fontSize: 16,
        color: '#555',
    },
    ingredientContainer: {
        marginBottom: 10,
    },
    ingredientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    nutrientList: {
        marginLeft: 20,
    },
    nutrientItem: {
        fontSize: 16,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
