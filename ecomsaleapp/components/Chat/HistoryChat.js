import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, onValue } from "firebase/database";
import Apis, { endpoints } from "../../configs/Apis";
import formatTime from "../../utils/formatTime";
import Ionicons from 'react-native-vector-icons/Ionicons';
import HistoryChatStyles from "./HistoryChatStyles";

const HistoryChat = ({ navigation }) => {
    const [userId, setUserId] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState({});

    useEffect(() => {
        const fetchChats = async () => {
            const storedUserId = await AsyncStorage.getItem("userId");

            if (!storedUserId) {
                setLoading(false);
                return;
            }

            setUserId(storedUserId);
            const db = getDatabase();
            const chatsMetadataRef = ref(db, "chatsMetadata");

            onValue(chatsMetadataRef, async (snapshot) => {
                const data = snapshot.val();
                if (!data) {
                    setChatList([]);
                    setLoading(false);
                    return;
                }

                const userChats = Object.entries(data)
                    .filter(([_, chat]) =>
                        String(chat.buyerId) === storedUserId || String(chat.sellerId) === storedUserId
                    )
                    .map(([chatId, chat]) => ({
                        id: chatId,
                        otherUserId: String(chat.buyerId) === storedUserId ? String(chat.sellerId) : String(chat.buyerId),
                        lastMessage: chat.lastMessage || "",
                        timestamp: chat.timestamp || 0,
                    }))
                    .sort((a, b) => b.timestamp - a.timestamp);

                setChatList(userChats);

                const userData = {};
                await Promise.all(userChats.map(async (chat) => {
                    try {
                        const res = await Apis.get(endpoints['user-by-id'](chat.otherUserId));
                        userData[chat.otherUserId] = res.data;
                    } catch (e) {
                        console.error(`Error fetching user ${chat.otherUserId}:`, e);
                    }
                }));

                setOtherUser(userData);
                setLoading(false);
            });
        };

        fetchChats();
    }, []);

    const renderItem = ({ item }) => {
        const user = otherUser[item.otherUserId];

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("chat", { otherUserId: item.otherUserId })}
                style={HistoryChatStyles.chatContainer}
            >
                <Image
                    source={{
                        uri: user?.avatar
                            ? `https://res.cloudinary.com/dwivkhh8t/${user.avatar}`
                            : "https://via.placeholder.com/60",
                    }}
                    style={HistoryChatStyles.avatar}
                />
                <View style={HistoryChatStyles.chatInfo}>
                    <Text style={HistoryChatStyles.username}>{user?.username}</Text>
                    <Text numberOfLines={1} style={HistoryChatStyles.lastMessage}>
                        {item.lastMessage}
                    </Text>
                    <Text style={HistoryChatStyles.timestamp}>{formatTime(item.timestamp)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={HistoryChatStyles.container}>
            <View style={HistoryChatStyles.barHeader}>
                <TouchableOpacity style={HistoryChatStyles.returnButton} onPress={() => navigation.navigate("profile_main")}>
                    <Ionicons name="return-down-back" size={24} color="#2196F3" />
                </TouchableOpacity>
                <Text style={HistoryChatStyles.textMyCart}>
                    Lịch sử tin nhắn
                </Text>
            </View>
            {loading ? (
                <ActivityIndicator style={{ marginTop: 80 }} size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={chatList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <Text style={HistoryChatStyles.emptyText}>
                            Không có cuộc trò chuyện nào.
                        </Text>
                    }
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 50 }}
                />
            )}
        </View>
    );
};

export default HistoryChat;
