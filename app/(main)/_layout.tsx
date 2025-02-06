import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import NavBar from "../../components/NavBar";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <NavBar/>
    
  );
}
