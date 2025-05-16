import { useEffect, useRef, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
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
    const navigation = useNavigation();
    const typingTimeout = useRef(null);

    const loadProducts = async (pageToLoad = 1, nameFilter = "", reset = false) => {
        let url = `${endpoints['products']}?page=${pageToLoad}`;
        if (nameFilter) url += `&name=${nameFilter}`;

        try {
            setLoading(true);
            const res = await Apis.get(url);
            const newProducts = res.data.results;
            const merged = reset ? newProducts : [...products, ...newProducts];
            const unique = Array.from(new Map(merged.map(p => [p.id, p])).values());
            setProducts(unique);
            console.log(unique);
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
                const res = await Apis.get(endpoints["my-cart"], {headers});
                const cart = res.data;
                setMyCart(cart);
                console.log(cart);

                const totalCount = cart.details.reduce((sum, item) => sum + item.quantity, 0);
                setCountProduct(totalCount);
            } else {
                setMyCart(null);
                setCountProduct(0);
            }
        } catch (err) {
             console.error(err);
        }
    }

    useEffect(()=>{
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
            <TouchableOpacity style={Style.card} onPress={() => navigation.navigate('productdetail', {'productId': item.id})}>
                <Image source={{ uri: imageUrl }} style={Style.image} resizeMode="cover" />
                <View style={Style.cardContent}>
                    <Text style={Style.productName}>{item.name}</Text>
                    <Text style={Style.price}>{item.price.toLocaleString()} VNĐ</Text>
                    <Text style={Style.subText}>Danh mục: {item.category}</Text>
                    <Text style={Style.subText}>Cửa hàng: {item?.shop}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={Style.container}>
            <View style={Style.barHeader}>
                <Searchbar placeholder="Tìm kiếm sản phẩm..." value={name} onChangeText={setName} style={Style.searchBarHome}/>
                <TouchableOpacity style={Style.viewCartHome} onPress={()=>navigation.replace("shoppingcart")}> 
                    <AntDesign name="shoppingcart" size={24} color="#2196F3" />
                    <View style={Style.cartBadgeHome}>
                        <Text style={Style.badgeText}>{countProduct.toString()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={2}
                onEndReached={loadMore}
                ListFooterComponent={loading && <ActivityIndicator />}
                contentContainerStyle={Style.flatListContent}
                columnWrapperStyle={Style.columnWrapper}
            />
        </SafeAreaView>
    );
};

export default Home;