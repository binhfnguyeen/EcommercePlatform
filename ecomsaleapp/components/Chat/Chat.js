import React, { useEffect, useMemo, useState } from "react";
import { Text, View, TextInput, Button, FlatList } from "react-native";
import { db } from "../../configs/firebaseConfig"; // cập nhật đường dẫn nếu cần
import { ref, push, onValue } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';

const Chat = ({route}) => {
    const {shop} = route.params;

    const [userId, setUserId] = useState(null);
    const shopOwnerId = shop?.user?.id;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const id = await AsyncStorage.getItem("userId");
            setUserId(id);
        };
        fetchUser();
    }, []);

    const chatId = useMemo(() => {
        if (!userId || !shopOwnerId) return null;
        return Number(userId) < Number(shopOwnerId)
            ? `${userId}_${shopOwnerId}`
            : `${shopOwnerId}_${userId}`;
    }, [userId, shopOwnerId]);

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

    useEffect(() => {
        console.log("Chat ID thay đổi:", chatId);
    }, [chatId]);

    const handleSend = async () => {
        console.log("ID user gui: ", userId);
        console.log("ID chat: ", chatId);
        console.log("Message state: '", message, "'");

        if (!userId || !chatId) {
            console.log("Dừng vì userId hoặc chatId bị thiếu.");
            return;
        }

        if (!message || !message.trim()) {
            console.warn("CẢNH BÁO: Tin nhắn đang rỗng hoặc chỉ chứa khoảng trắng.");
        }

        console.log("CHUẨN BỊ TẠO newMessage object...");

        try {
            const newMessage = {
                id: uuidv4(),
                senderId: userId,
                text: message,
                timestamp: Date.now(),
            };

            console.info("newMessage object được tạo:", newMessage);

            console.log("Đang gửi tin nhắn tới path:", `chats/${chatId}/messages`);

            const messageRef = ref(db, `chats/${chatId}/messages`);
            await push(messageRef, newMessage)
                .then(() => {
                    console.log("Message sent successfully!");
                    setMessage("");
                })
                .catch((error) => {
                    console.error("LỖI KHI THỰC HIỆN PUSH TIN NHẮN:", error);
                });

        } catch (e) {
            console.error("LỖI ĐỒNG BỘ TRONG handleSend (ví dụ: uuidv4() thất bại):", e);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>ID Shop: {shop?.id}</Text>
            <Text>Tên cửa hàng: {shop?.name}</Text>
            <Text>Chủ shop: {shopOwnerId}</Text>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isCurrentUser = item.senderId === userId;
                    return (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                                marginVertical: 4,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: isCurrentUser ? "#DCF8C6" : "#E5E5EA",
                                    padding: 10,
                                    borderRadius: 12,
                                    maxWidth: "75%",
                                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                                }}
                            >
                                <Text style={{ color: "#000" }}>{item.text}</Text>
                            </View>
                        </View>
                    );
                }}
            />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 4,
                        marginRight: 8,
                    }}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Nhập tin nhắn..."
                />
                <Button title="Gửi" onPress={handleSend} />
            </View>
        </View>
    );
}

export default Chat;