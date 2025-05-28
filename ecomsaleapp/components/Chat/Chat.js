import React, { useEffect, useMemo, useState } from "react";
import { Text, View, TextInput, Button, FlatList, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { db } from "../../configs/firebaseConfig";
import { ref, push, onValue, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import * as ImgPicker from 'expo-image-picker';
import 'react-native-get-random-values';
import Apis, { endpoints } from "../../configs/Apis";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import formatTime from "../../utils/formatTime";
import { useNavigation } from "@react-navigation/native";

const Chat = ({ route }) => {
    const { shop, otherUserId } = route.params;

    const [userId, setUserId] = useState(null);
    const [oUserId, setOUserId] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [image, setImage] = useState(null);
    const [otherUser, setOtherUser] = useState({});
    const [checkLoggedIn, setCheckLoggedIn] = useState(false);
    const navigation = useNavigation();
    const getOtherUser = async () => {
        try {
            const res = await Apis.get(endpoints['user-by-id'](oUserId));
            setOtherUser(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(()=>{
        const checkLoggedIn = async () => {
            const res = await AsyncStorage.getItem("token");
            if (res) {
                setCheckLoggedIn(true);
            } else {
                setCheckLoggedIn(false);
            }
        }

        checkLoggedIn();
    }, [])

    useEffect(() => {
        if (oUserId) getOtherUser();
    }, [oUserId]);

    useEffect(() => {
        const fetchUser = async () => {
            const id = await AsyncStorage.getItem("userId");
            setUserId(id);
            if (shop?.user?.id) setOUserId(shop.user.id);
            else if (otherUserId) setOUserId(otherUserId);
        };
        fetchUser();
    }, [shop, otherUserId]);

    const chatId = useMemo(() => {
        if (!userId || !oUserId) return null;
        const sortedIds = [userId, oUserId].sort();
        return `${sortedIds[0]}_${sortedIds[1]}`;
    }, [userId, oUserId]);

    useEffect(() => {
        if (!userId || !chatId) return;
        const messagesRef = ref(db, `chats/${chatId}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgs = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
                setMessages(msgs);
            } else {
                setMessages([]);
            }
        });
        return () => unsubscribe();
    }, [chatId, userId]);

    const handleSend = async () => {
        if (!userId || !chatId || (!message && !image)) return;

        try {
            let imagePath = null;
            if (image) {
                imagePath = await uploadImgToCloudinary();
            }

            const newMessage = {
                id: uuidv4(),
                senderId: userId,
                text: message,
                image: imagePath ? `https://res.cloudinary.com/dwivkhh8t/${imagePath}` : null,
                timestamp: Date.now(),
            };

            await push(ref(db, `chats/${chatId}/messages`), newMessage);
            await set(ref(db, `chatsMetadata/${chatId}`), {
                buyerId: userId,
                sellerId: oUserId,
                lastMessage: message || "Đã gửi hình ảnh",
                timestamp: Date.now(),
            });

            setMessage("");
            setImage(null);
        } catch (e) {
            console.error(e);
        }
    };

    const pickImage = async () => {
        let { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permission denied!");
        } else {
            const r = await ImgPicker.launchImageLibraryAsync();
            if (!r.canceled) setImage(r.assets[0]);
        }
    };

    const uploadImgToCloudinary = async () => {
        if (!image) return null;

        const formData = new FormData();
        formData.append("file", {
            uri: image.uri,
            type: "image/jpeg",
            name: "upload.jpg",
        });
        formData.append("upload_preset", "ecomsale");

        const response = await fetch("https://api.cloudinary.com/v1_1/dwivkhh8t/image/upload", {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });

        const resJson = await response.json();
        const path = resJson.secure_url.substring(resJson.secure_url.indexOf("image/upload"));
        return path;
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.header}>
                {otherUser?.avatar?
                    <View style={styles.userInfo}>
                        <Image source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${otherUser.avatar}` }} style={styles.avatar} />
                        <Text style={styles.username}>{otherUser.username}</Text>
                    </View>:<ActivityIndicator size="large" color="#0000ff" />
                }
            </View>

            {checkLoggedIn === false ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "red", fontSize: 16, fontWeight: "bold" }}>Vui lòng đăng nhập để nhắn với cửa hàng!</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        style={styles.messageList}
                        renderItem={({ item }) => {
                            const isCurrentUser = item.senderId === userId;
                            return (
                                <View style={[styles.messageContainer, isCurrentUser ? styles.currentUser : styles.otherUser]}>
                                    <View style={[styles.messageBubble, { backgroundColor: isCurrentUser ? "#DCF8C6" : "#E5E5EA" }]}>
                                        {item.text && <Text style={styles.messageText}>{item.text}</Text>}
                                        {item.image && (
                                            <Image source={{ uri: item.image }} style={styles.messageImage} />
                                        )}
                                        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                                    </View>
                                </View>
                            );
                        }}
                    />

                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            <Text style={styles.imagePickerText}>
                                <FontAwesome name="image" size={24} color="#2196F3" />
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Nhập tin nhắn..."
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <Text style={styles.sendText}>Gửi</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </KeyboardAvoidingView>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },
    header: {
        padding: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    shopText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    username: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        marginVertical: 4,
        flexDirection: "row",
        paddingBottom: 30,
    },
    currentUser: {
        justifyContent: "flex-end",
    },
    otherUser: {
        justifyContent: "flex-start",
    },
    messageBubble: {
        padding: 10,
        borderRadius: 12,
        maxWidth: "70%",
    },
    messageText: {
        color: "#000",
    },
    messageImage: {
        marginTop: 5,
        width: 150,
        height: 150,
        borderRadius: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        backgroundColor: "#fff",
        borderColor: "#ddd",
    },
    imagePicker: {
        backgroundColor: "#d0e0fc",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 5,
    },
    imagePickerText: {
        color: "#0056b3",
        fontWeight: "600",
    },
    textInput: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        padding: 10,
        marginRight: 5,
    },
    sendButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    sendText: {
        color: "#fff",
        fontWeight: "bold",
    },

    timestamp: {
        fontSize: 10,
        color: "#888",
        marginTop: 4,
        alignSelf: "flex-end",
    },

    returnButton: {
        flex: 0.5,
        alignItems: "flex-start",
        justifyContent: "center",
    }, 
});
