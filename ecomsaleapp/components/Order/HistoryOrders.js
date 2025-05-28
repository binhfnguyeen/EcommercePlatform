import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

const HistoryOrders = () => {
    const [historyOrders, setHistoryOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigation();

    const loadHistoryOrders = async (currentPage = 1) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const headers = { Authorization: `Bearer ${token}` };
            const url = `${endpoints["history-orders"]}?page=${currentPage}`;

            const res = await Apis.get(url, { headers });
            const newOrders = res.data.results;

            if (!res.data.next) setHasMore(false);

            setHistoryOrders(prev => [...prev, ...newOrders]);
        } catch (err) {
            console.error("Lỗi khi load lịch sử đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistoryOrders(page);
    }, [page]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
            <Text>Địa chỉ giao hàng: {item.shipping_address}</Text>
            <Text>Tổng tiền: {item.total.toLocaleString()} VND</Text>
            <Text>Trạng thái: {item.status === "PAID" ? "Đã thanh toán" : item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.barHeader}>
                <TouchableOpacity style={styles.returnButton} onPress={() =>  navigation.navigate("profile_main") }>
                    <Ionicons name="return-down-back" size={24} color="#2196F3" />
                </TouchableOpacity>
                <Text style={styles.textMyCart}>
                    Lịch sử đơn hàng
                </Text>
            </View>
            <FlatList
                data={historyOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrderItem}
                contentContainerStyle={{ paddingBottom: 20, paddingTop: 50 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
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

    orderItem: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },

    orderId: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
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

export default HistoryOrders;
