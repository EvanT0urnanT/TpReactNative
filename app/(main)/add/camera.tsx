import { CameraType, CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

const EDAMAM_APP_ID = "e9bc4e17";
const EDAMAM_APP_KEY = "8feab6f5af75cf512316a5ca096b8e4b";

export default function CameraScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const searchFoodByBarcode = async (barcode: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.edamam.com/api/food-database/v2/parser`,
        {
          params: {
            app_id: EDAMAM_APP_ID,
            app_key: EDAMAM_APP_KEY,
            upc: barcode,
          },
        }
      );

      const foodData = response.data.hints;
      
      if (foodData.length === 0) {
        Alert.alert("Produit inconnu", "Ce code-barres ne correspond à aucun aliment dans la base de données.");
      } else {
        const food = foodData[0].food;
        Alert.alert("Produit trouvé", `Ajouté : ${food.label} - ${food.nutrients.ENERC_KCAL.toFixed(2)} kcal`);
      }
    } catch (error) {
      console.error("Erreur API :", error);
      Alert.alert("Erreur", "Impossible de récupérer les informations de l'aliment.");
    }
    setLoading(false);
  };

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      searchFoodByBarcode(result.data);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>📷 Autorisez l'accès à la caméra pour scanner un code-barres.</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Autoriser</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"] }}
      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
    >
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Recherche de l'aliment...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>🔄 Changer de caméra</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setScanned(false)}>
          <Text style={styles.text}>📷 Scanner à nouveau</Text>
        </Pressable>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    fontSize: 18,
    paddingBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -50 }],
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
});