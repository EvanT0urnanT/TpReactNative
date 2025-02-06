import { useRouter } from "expo-router";
import { useMealContext } from "../context/MealContext";
import { View, Text, FlatList,TouchableOpacity, StyleSheet } from "react-native";

export default function MealListPage() {
  const router = useRouter();
  const { meals } = useMealContext(); // Accéder à la liste des repas enregistrés depuis le contexte

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des repas</Text>

      {meals.length === 0 ? (
        <Text style={styles.noMealsText}>Aucun repas enregistré.</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mealCard}
              onPress={() => router.push(`./${item.id}`)}
            >
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealKcal}>{item.kcal} kcal</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(main)/add")}
      >
        <Text style={styles.addButtonText}>Ajouter un repas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  noMealsText: {
    fontSize: 18,
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: 20,
  },
  mealCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: "#dcdfe1",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  mealKcal: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
