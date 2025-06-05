import { useContext, useEffect, useRef, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HomeStyles from "../Home/HomeStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { MyShopContext } from "../../configs/MyContext";

const winWith = { width: Dimensions.get('window').width };

const ShopDetail = ({ route }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const typingTimeout = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigation();
    const shop = useContext(MyShopContext);
    const shopId = shop._j.id;

    const loadProducts = async (pageToLoad = 1, nameFilter = "", reset = false) => {
        let url = `${endpoints['shop-detail'](shopId)}`;
        if (nameFilter) url += `&name=${nameFilter}`;

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }

            const api = authApis(token);
            const res = await api.get(url);
            const newProducts = res.data.results;
            const merged = reset ? newProducts : [...products, ...newProducts];
            const unique = Array.from(new Map(merged.map(p => [p.id, p])).values());
            setProducts(unique);
            setHasMore(res.data.next !== null);
        } catch (ex) {
            console.error("Registration failed:", ex.response?.data || ex.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            setPage(1);
            setProducts([]);
            setHasMore(true);
            loadProducts(1, name, true);
        }, 500);

        return () => clearTimeout(typingTimeout.current);
    }, [name]);

    useEffect(() => {
        if (page === 1) return;
        if (!loading && hasMore) loadProducts(page, name);
    }, [page]);

    const loadMore = () => {
        if (!loading && hasMore) setPage(prev => prev + 1);
    };

    const renderItem = ({ item }) => {
        const imageUrl = item.images[0]?.image;

        return (
            <TouchableOpacity
                style={[HomeStyles.card, { margin: 8, borderRadius: 12, backgroundColor: '#fff', elevation: 2 }]}
                onPress={() => navigation.navigate('productdetail', { productId: item.id })}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={[HomeStyles.image, { borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}
                    resizeMode="cover"
                />
                <View style={[HomeStyles.cardContent, { padding: 10 }]}>
                    <Text style={[HomeStyles.productName, { fontSize: 16, fontWeight: '600' }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[HomeStyles.price, { color: '#e91e63', fontSize: 15 }]}>{item.price.toLocaleString()} VNĐ</Text>
                    <Text style={HomeStyles.subText}>Danh mục: {item.category}</Text>
                    <Text style={HomeStyles.subText}>Cửa hàng: {item.shop.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[HomeStyles.container, { backgroundColor: '#f5f5f5' }]}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                backgroundColor: '#fff',
                elevation: 4,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                marginBottom: 8,
            }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => navigation.replace("myshop")}>
                    <Ionicons name="arrow-back" size={24} color="#2196F3" />
                    <Text style={{ fontSize: 16, marginLeft: 6, color: "#2196F3" }}>Quay lại</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("createproduct", { shopId })}
                        style={{
                            backgroundColor: "#2196F3",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Sản phẩm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("shopstats")}
                        style={{
                            backgroundColor: "#4CAF50",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Thống kê</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={2}
                onEndReached={loadMore}
                ListFooterComponent={loading && <ActivityIndicator style={{ marginVertical: 20 }} />}
                contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
                columnWrapperStyle={{ justifyContent: "space-between" }}
            />
        </SafeAreaView>
    );
};

export default ShopDetail;
