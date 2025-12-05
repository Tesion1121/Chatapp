// screens/ChatScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  messagesCollection,
  auth,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  signOut,
} from "../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { launchImageLibrary } from "react-native-image-picker";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

type MessageType = {
  id: string;
  text?: string;
  imageUrl?: string;
  userEmail: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
};

const LOCAL_STORAGE_KEY = "chat_messages";

export default function ChatScreen({ navigation }: Props) {
  const user = auth.currentUser;
  const displayEmail = user?.email ?? "Anon";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  // 1) Load history dari AsyncStorage lalu subscribe ke Firestore
  useEffect(() => {
    const loadLocalMessages = async () => {
      try {
        const json = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
        if (json) {
          const parsed: MessageType[] = JSON.parse(json);
          setMessages(parsed);
        }
      } catch (err) {
        console.log("Error load local messages:", err);
      }
    };

    loadLocalMessages();

    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: MessageType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as any;
        list.push({
          id: doc.id,
          text: data.text,
          imageUrl: data.imageUrl,
          userEmail: data.userEmail,
          createdAt: data.createdAt ?? null,
        });
      });
      setMessages(list);
      AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list)).catch(
        console.error
      );
    });

    return () => unsub();
  }, []);

  // 2) Kirim pesan teks ke Firestore
  const sendTextMessage = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(messagesCollection, {
        text: message,
        imageUrl: null,
        userEmail: displayEmail,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err: any) {
      Alert.alert("Gagal mengirim pesan", err.message ?? String(err));
    }
  };

  // 3) Upload gambar ke Firebase Storage dan simpan URL ke Firestore
  const sendImageMessage = async () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert("Error pilih gambar", response.errorMessage);
          return;
        }

        try {
          const asset = response.assets && response.assets[0];
          if (!asset?.uri) {
            Alert.alert("Error", "Gambar tidak ditemukan.");
            return;
          }

          const uri = asset.uri;
          const filename = `images/${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}.jpg`;

          const imgRef = ref(storage, filename);

          // Ambil blob dari URI (React Native)
          const res = await fetch(uri);
          const blob = await res.blob();

          await uploadBytes(imgRef, blob);
          const downloadUrl = await getDownloadURL(imgRef);

          await addDoc(messagesCollection, {
            text: null,
            imageUrl: downloadUrl,
            userEmail: displayEmail,
            createdAt: serverTimestamp(),
          });
        } catch (err: any) {
          Alert.alert("Gagal upload gambar", err.message ?? String(err));
        }
      }
    );
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  const renderItem = ({ item }: { item: MessageType }) => {
    const isMe = item.userEmail === displayEmail;
    return (
      <View
        style={[
          styles.msgBox,
          isMe ? styles.myMsg : styles.otherMsg,
        ]}
      >
        <Text style={styles.sender}>{item.userEmail}</Text>
        {item.text ? <Text>{item.text}</Text> : null}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Logged in as: {displayEmail}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Kirim" onPress={sendTextMessage} />
      </View>
      <View style={styles.imageButtonRow}>
        <Button title="Kirim Gambar" onPress={sendImageMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontSize: 12, color: "#555" },
  msgBox: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#d1f0ff",
    alignSelf: "flex-end",
  },
  otherMsg: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 12,
  },
  image: {
    marginTop: 8,
    width: 180,
    height: 180,
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
  imageButtonRow: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
