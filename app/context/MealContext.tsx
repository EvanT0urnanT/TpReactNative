import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Meal {
  id: string;
  name: string;
  ingredients: string[];
  kcal: number;
}

interface MealContextType {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  deleteMealById: (id: string) => void;
  getMealById: (id: string) => Meal | undefined;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

interface MealProviderProps {
  children: ReactNode;
}

export const MealProvider = ({ children }: MealProviderProps) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  // Charger les repas depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const mealsData = await AsyncStorage.getItem('meals');
        if (mealsData) {
          setMeals(JSON.parse(mealsData));
        }
      } catch (error) {
        console.error('Failed to load meals from AsyncStorage:', error);
      }
    };

    loadMeals();
  }, []);

  // Sauvegarder les repas dans AsyncStorage
  const saveMealsToStorage = async (meals: Meal[]) => {
    try {
      await AsyncStorage.setItem('meals', JSON.stringify(meals));
    } catch (error) {
      console.error('Failed to save meals to AsyncStorage:', error);
    }
  };

  // Ajouter un repas et mettre à jour AsyncStorage
  const addMeal = (meal: Meal) => {
    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);
    saveMealsToStorage(updatedMeals);
  };

  // Supprimer un repas par ID et mettre à jour AsyncStorage
  const deleteMealById = (id: string) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);
    saveMealsToStorage(updatedMeals);
  };

  const getMealById = (id: string) => meals.find(meal => meal.id === id);

  return (
    <MealContext.Provider value={{ meals, addMeal, deleteMealById, getMealById }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMealContext = (): MealContextType => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMealContext must be used within a MealProvider');
  }
  return context;
};
