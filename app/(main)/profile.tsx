import { View, Text, Button, ActivityIndicator } from "react-native";
import { useUser, useClerk } from "@clerk/clerk-expo";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Profil</Text>

      <Text style={{ fontSize: 16, color: "gray", marginBottom: 20 }}>Email : {user?.primaryEmailAddress?.emailAddress}</Text>

      <Button title="Se déconnecter" onPress={() => signOut()} color="red" />
    </View>
  );
}
