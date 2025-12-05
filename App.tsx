// App.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";
import { auth, onAuthStateChanged } from "./firebase";
import type { User } from "firebase/auth";

export type RootStackParamList = {
  Login: undefined;
  Chat: undefined; // tidak butuh param lagi, ambil user dari auth
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return () => unsub();
  }, [initializing]);

  if (initializing) return null; // nunggu info login

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Chat" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
