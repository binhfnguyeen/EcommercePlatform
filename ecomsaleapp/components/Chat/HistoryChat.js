import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, onValue } from "firebase/database";
import Apis, { endpoints } from "../../configs/Apis";
import formatTime from "../../utils/formatTime";
import Ionicons from 'react-native-vector-icons/Ionicons';

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
                style={styles.chatContainer}
            >
                <Image
                    source={{
                        uri: user?.avatar
                            ? `https://res.cloudinary.com/dwivkhh8t/${user.avatar}`
                            : "https://via.placeholder.com/60",
                    }}
                    style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                    <Text style={styles.username}>{user?.username}</Text>
                    <Text numberOfLines={1} style={styles.lastMessage}>
                        {item.lastMessage}
                    </Text>
                    <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.barHeader}>
                <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate("profile_main")}>
                    <Ionicons name="return-down-back" size={24} color="#2196F3" />
                </TouchableOpacity>
                <Text style={styles.textMyCart}>
                    Lịch sử tin nhắn
                </Text>
            </View>
            <FlatList
                data={chatList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có cuộc trò chuyện nào.</Text>}
                contentContainerStyle={{ paddingBottom: 20, paddingTop: 50 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },

    chatContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
        backgroundColor: "#f0f0f0",
    },

    chatInfo: {
        flex: 1,
        justifyContent: "center",
    },

    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },

    lastMessage: {
        fontSize: 14,
        color: "#666",
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    emptyText: {
        textAlign: "center",
        padding: 20,
        fontSize: 16,
        color: "#888",
    },

    timestamp: {
        fontSize: 10,
        color: "#888",
        marginTop: 4,
        alignSelf: "flex-end",
    },
        barHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    returnButton: {
        flex: 0.8,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    textMyCart: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: -1
    }
});

export default HistoryChat;
