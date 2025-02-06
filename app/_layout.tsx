import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "../libs/cache";
import { Slot, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import NavBar from "../components/NavBar";
import { MealProvider } from "./context/MealContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

const RootLayout = () => {
  return (
    <MealProvider>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ClerkProvider>
    </MealProvider>
  );
};

export default RootLayout;
