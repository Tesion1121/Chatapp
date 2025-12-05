// screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email dan password tidak boleh kosong.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sukses", "Akun berhasil dibuat. Anda sudah login.");
      navigation.replace("Chat");
    } catch (err: any) {
      Alert.alert("Register gagal", err.message ?? String(err));
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email dan password tidak boleh kosong.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Chat");
    } catch (err: any) {
      Alert.alert("Login gagal", err.message ?? String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login / Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonRow}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Register" onPress={handleRegister} />
      </View>

      <Text style={styles.helper}>
        *Untuk tugas, "username" bisa dianggap sebagai email.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonRow: {
    marginVertical: 4,
  },
  helper: {
    marginTop: 16,
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
});
