import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{meal.name}</Text>
            <Text style={styles.detailLabel}>Calories: {parseFloat(meal.kcal || 0).toFixed(1)} kcal</Text>
            <Text style={styles.subTitle}>Ingrédients :</Text>
            <View style={styles.ingredientsList}>
                {meal.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientCard}>
                        <Text style={styles.ingredientName}>- {ingredient.food.label}</Text>
                        <View style={styles.nutrientList}>
                            <Text style={styles.nutrientItem}>KCAL: {parseFloat(ingredient.food.nutrients.ENERC_KCAL || 0).toFixed(1)}</Text>
                            <Text style={styles.nutrientItem}>Protéines: {parseFloat(ingredient.food.nutrients.PROCNT || 0).toFixed(1)}g</Text>
                            <Text style={styles.nutrientItem}>Lipides: {parseFloat(ingredient.food.nutrients.FAT || 0).toFixed(1)}g</Text>
                            <Text style={styles.nutrientItem}>Glucides: {parseFloat(ingredient.food.nutrients.CHOCDF || 0).toFixed(1)}g</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Retour" onPress={() => router.push('/')} color="#5c6bc0" />
                <Button title="Supprimer" color="#d32f2f" onPress={handleDeleteMeal} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f6f9',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    detailLabel: {
        fontSize: 18,
        marginVertical: 5,
        color: '#34495e',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#2980b9',
    },
    ingredientsList: {
        marginTop: 15,
    },
    ingredientCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    ingredientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1abc9c',
    },
    nutrientList: {
        marginLeft: 10,
        marginTop: 8,
    },
    nutrientItem: {
        fontSize: 16,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
});
