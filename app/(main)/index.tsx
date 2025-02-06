import { useRouter } from "expo-router";
import { useMealContext } from "../context/MealContext"; // Import du contexte des repas
import { View, Text, FlatList, Button, TouchableOpacity } from "react-native";

export default function MealListPage() {
  const router = useRouter();
  const { meals } = useMealContext(); // Accéder à la liste des repas enregistrés depuis le contexte

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Liste des repas
      </Text>

      {meals.length === 0 ? (
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Aucun repas enregistré.
        </Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 15,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginBottom: 10,
              }}
              onPress={() => router.push(`./${item.id}`)}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
              <Text style={{ color: "#555" }}>{item.kcal} kcal</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Button title="Ajouter un repas" onPress={() => router.push("/(main)/add")} />
    </View>
  );
}
