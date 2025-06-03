import React, { useEffect, useMemo, useState } from "react";
import { Text, View, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, ActivityIndicator } from "react-native";
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
import ChatStyles from "./ChatStyles";

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
        <KeyboardAvoidingView style={ChatStyles.container}>
            <View style={ChatStyles.header}>
                {otherUser?.avatar?
                    <View style={ChatStyles.userInfo}>
                        <Image source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${otherUser.avatar}` }} style={ChatStyles.avatar} />
                        <Text style={ChatStyles.username}>{otherUser.username}</Text>
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
                        style={ChatStyles.messageList}
                        renderItem={({ item }) => {
                            const isCurrentUser = item.senderId === userId;
                            return (
                                <View style={[ChatStyles.messageContainer, isCurrentUser ? ChatStyles.currentUser : ChatStyles.otherUser]}>
                                    <View style={[ChatStyles.messageBubble, { backgroundColor: isCurrentUser ? "#DCF8C6" : "#E5E5EA" }]}>
                                        {item.text && <Text style={ChatStyles.messageText}>{item.text}</Text>}
                                        {item.image && (
                                            <Image source={{ uri: item.image }} style={ChatStyles.messageImage} />
                                        )}
                                        <Text style={ChatStyles.timestamp}>{formatTime(item.timestamp)}</Text>
                                    </View>
                                </View>
                            );
                        }}
                    />

                    <View style={ChatStyles.inputContainer}>
                        <TouchableOpacity onPress={pickImage} style={ChatStyles.imagePicker}>
                            <Text style={ChatStyles.imagePickerText}>
                                <FontAwesome name="image" size={24} color="#2196F3" />
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            style={ChatStyles.textInput}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Nhập tin nhắn..."
                        />
                        <TouchableOpacity style={ChatStyles.sendButton} onPress={handleSend}>
                            <Text style={ChatStyles.sendText}>Gửi</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </KeyboardAvoidingView>
    );
};

export default Chat;
