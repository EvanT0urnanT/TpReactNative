import { Stack } from "expo-router";

export default function addLayout() {
  return (
    <Stack screenOptions={{
      headerShown:false,
    }} />
  );
}
