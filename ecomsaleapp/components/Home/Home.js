import { useEffect, useRef, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { List, Searchbar } from "react-native-paper";
import Style from "./Style";
import { useNavigation } from "@react-navigation/native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [name, setName] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [myCart, setMyCart] = useState([]);
    const [countProduct, setCountProduct] = useState(0);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const navigation = useNavigation();
    const typingTimeout = useRef(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [shopName, setShopName] = useState("");
    const [ordering, setOrdering] = useState("");

    const loadProducts = async (pageToLoad = 1, nameFilter = "", reset = false) => {
        let url = `${endpoints['products']}?page=${pageToLoad}`;
        if (nameFilter) url += `&name=${nameFilter}`;
        if (minPrice) url += `&min_price=${minPrice}`;
        if (maxPrice) url += `&max_price=${maxPrice}`;
        if (shopName) url += `&shop_name=${shopName}`;
        if (ordering) url += `&ordering=${ordering}`;

        try {
            setLoading(true);
            const res = await Apis.get(url);
            const newProducts = res.data.results;
            const merged = reset ? newProducts : [...products, ...newProducts];
            const unique = Array.from(new Map(merged.map(p => [p.id, p])).values());
            setProducts(unique);
            setHasMore(res.data.next !== null);
        } catch {
            console.log("Không lấy được danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const loadMyCart = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            if (token) {
                const res = await Apis.get(endpoints["my-cart"], { headers });
                const cart = res.data;
                setMyCart(cart);

                const totalCount = cart.details.reduce((sum, item) => sum + item.quantity, 0);
                setCountProduct(totalCount);
            } else {
                setMyCart(null);
                setCountProduct(0);
            }
        } catch (err) {
            if (err.response?.status === 400) {
                Alert.alert("Thông báo", "Bạn cần đăng nhập để xem giỏ hàng", [{ text: "OK" }]);
            }
        }
    }

    const onFocusSearch = () => {
        setIsFilterVisible(true);
    }

    const toggleOrdering = (field) => {
        console.log("Current ordering:", ordering);
        if (ordering === field) {
            setOrdering("-" + field);
        } else if (ordering === "-" + field) {
            setOrdering("");
        } else {
            setOrdering(field);
        }
    };

    useEffect(() => {
        loadMyCart();
    }, [])

    useEffect(() => {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            setPage(1);
            setProducts([]);
            setHasMore(true);
            loadProducts(1, name, true);
        }, 500);

        return () => clearTimeout(typingTimeout.current);
    }, [name, minPrice, maxPrice, shopName, ordering]);

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
            <TouchableOpacity style={Style.card} onPress={() => navigation.navigate('productdetail', { 'productId': item.id })}>
                <Image source={{ uri: imageUrl }} style={Style.image} resizeMode="cover" />
                <View style={Style.cardContent}>
                    <Text style={Style.productName}>{item.name}</Text>
                    <Text style={Style.price}>{item.price.toLocaleString()} VNĐ</Text>
                    <Text style={Style.subText}>Danh mục: {item.category}</Text>
                    <Text style={Style.subText}>Cửa hàng: {item.shop.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View>
            {isFilterVisible && (
                <View style={{
                    padding: 5,
                    paddingTop: 10,
                    borderBottomWidth: 1,
                    backgroundColor: "#fff",
                    borderColor: "#e0e0e0",
                }}>
                    <Text style={{ paddingTop: 5, fontWeight: "bold" }}>Bộ lọc nâng cao</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            style={{
                                flex: 0.45,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                padding: 8,
                                backgroundColor: "#fff"
                            }}
                            placeholder="Giá rẻ nhất..."
                            keyboardType="numeric"
                            value={minPrice}
                            onChangeText={setMinPrice}
                        />
                        <TextInput
                            style={{
                                flex: 0.45,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                padding: 8,
                                backgroundColor: "#fff"
                            }}
                            placeholder="Giá lớn nhất"
                            keyboardType="numeric"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                        />
                    </View>

                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 8,
                            padding: 8,
                            marginTop: 10,
                            backgroundColor: "#fff"
                        }}
                        placeholder="Tên cửa hàng"
                        value={shopName}
                        onChangeText={setShopName}
                    />

                    <Text style={{ paddingBottom: 5, fontWeight: "bold" }}>Sắp xếp sản phẩm theo tên hoặc giá</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 10 }}>
                        {["price", "name"].map((field) => {
                            const isActive = ordering === field || ordering === "-" + field;
                            const isAsc = ordering === field;
                            const label = field === "price" ? "Giá tiền" : "Tên sản phẩm";

                            return (
                                <TouchableOpacity
                                    key={field}
                                    onPress={() => toggleOrdering(field)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        padding: 6,
                                        paddingHorizontal: 12,
                                        borderRadius: 6,
                                        borderWidth: 1,
                                        borderColor: isActive ? "#2196F3" : "#ccc",
                                        backgroundColor: isActive ? "#E3F2FD" : "#fff"
                                    }}
                                >
                                    <Text style={{ color: isActive ? "#2196F3" : "#000" }}>{label}</Text>
                                    {isActive && (
                                        <AntDesign
                                            name={isAsc ? "upcircle" : "downcircle"}
                                            size={14}
                                            color="#2196F3"
                                            style={{ marginLeft: 4 }}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={Style.container}>
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                    setIsFilterVisible(false);
                }}
            >
                <View style={{ flex: 1 }}>
                    <View>
                        <View style={Style.barHeader}>
                            <Searchbar
                                placeholder="Tìm kiếm sản phẩm..."
                                value={name}
                                onChangeText={setName}
                                style={Style.searchBarHome}
                                onFocus={onFocusSearch}
                            />
                            <TouchableOpacity
                                style={Style.viewCartHome}
                                onPress={() => navigation.replace("shoppingcart")}
                            >
                                <AntDesign name="shoppingcart" size={24} color="#2196F3" />
                                <View style={Style.cartBadgeHome}>
                                    <Text style={Style.badgeText}>{countProduct.toString()}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        numColumns={2}
                        onEndReached={loadMore}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={loading && <ActivityIndicator />}
                        contentContainerStyle={Style.flatListContent}
                        columnWrapperStyle={Style.columnWrapper}
                    />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default Home;