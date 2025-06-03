import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import ShoppingCartStyles from "./ShoppingCartStyles";

const ShoppingCart = ({route}) => {
    const productId = route.params?.productId;
    const [products, setProducts] = useState({});
    const [myCart, setMyCart] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigation = useNavigation();
    
    const loadCart = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            const res = await Apis.get(endpoints["my-cart"], { headers });
            setMyCart(res.data);
        } catch (err) {
            console.error("Lỗi khi load giỏ hàng:", err);
        }
    };

    const handleDeleteItem = async (productId) => {
         try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const body = {
                "product_id": productId
            }

             await Apis.delete(endpoints["remove-product-cart"], {
                 headers,
                 data: body,
             });

            Alert.alert("Thành công", "Đã xoá sản phẩm khỏi giỏ");
            
            await loadCart();

        } catch (err) {
            console.error(err);
            Alert.alert("Lỗi", "Không thể xoá sản phẩm khỏi giỏ");
        }
    }

    const loadProducts = async () => {
        if (myCart && myCart.details) {
            let newProducts = {};
            for (let item of myCart.details) {
                try {
                    let res = await Apis.get(endpoints["product"](item.product));
                    newProducts[item.product] = res.data;
                } catch (err) {
                    console.error("Lỗi khi load sản phẩm:", err);
                }
            }
            setProducts(newProducts);
            console.info(newProducts);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [])
    );


    useEffect(() => {
        loadProducts();
    }, [myCart]);

    if (!isLoggedIn) {
        return (
            <View style={{ flex: 1 }}>
                <View style={ShoppingCartStyles.barHeader}>
                    <TouchableOpacity style={ShoppingCartStyles.returnButton} onPress={() => { productId ? navigation.navigate("productdetail", { productId: productId }) : navigation.navigate("home") }}>
                        <Ionicons name="return-down-back" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    <Text style={ShoppingCartStyles.textMyCart}>
                        Giỏ hàng của bạn
                    </Text>
                </View>

                <View style={{ padding: 16, paddingTop: 50, alignItems: "center" }}>
                    <Text>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem giỏ hàng.</Text>
                </View>
            </View>
        );
    }


    if (myCart === null) {
        return (
            <View style={{ flex: 1 }}>
                <View style={ShoppingCartStyles.barHeader}>
                    <TouchableOpacity style={ShoppingCartStyles.returnButton} onPress={() => { productId ? navigation.navigate("productdetail", { productId: productId }) : navigation.navigate("home") }}>
                        <Ionicons name="return-down-back" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    <Text style={ShoppingCartStyles.textMyCart}>
                        Giỏ hàng của bạn
                    </Text>
                </View>

                <View style={{ padding: 16, paddingTop: 50, alignItems: "center" }}>
                    <Text>Đang tải giỏ hàng <ActivityIndicator size="small" color="#0000ff" /></Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <View style={ShoppingCartStyles.barHeader}>
                <TouchableOpacity style={ShoppingCartStyles.returnButton} onPress={() => {productId?navigation.navigate("productdetail", {productId: productId}):navigation.navigate("home")}}>
                    <Ionicons name="return-down-back" size={24} color="#2196F3" />
                </TouchableOpacity>
                <Text style={ShoppingCartStyles.textMyCart}>
                    Giỏ hàng của bạn
                </Text>
            </View>
            <ScrollView style={{ padding: 16 }} contentContainerStyle={{paddingBottom: 55, paddingTop: 55}}>

                {myCart.details.map((item) => {
                    const product = products[item.product];

                    return (
                        <View
                            key={item.id}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 12,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            {product && product.images.length > 0 && (
                                <Image
                                    source={{ uri: product.images[0].image }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                        marginRight: 12,
                                    }}
                                />
                            )}

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                    {product ? product.name : "Đang tải..."}
                                </Text>
                                <Text>Giá: {product ? product.price.toLocaleString() : "..."}</Text>
                                <Text>Số lượng: {item.quantity}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDeleteItem(item.product)}
                                style={{
                                    backgroundColor: "#ff4444",
                                    paddingVertical: 6,
                                    paddingHorizontal: 12,
                                    borderRadius: 6,
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Xoá</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
            <View style={ShoppingCartStyles.barFooter}>
                {myCart ?
                    <Text style={ShoppingCartStyles.productPriceText}>{myCart.total.toLocaleString()} VND</Text>
                    : <Text style={ShoppingCartStyles.productPriceText}>0 VND</Text>}
                <TouchableOpacity style={ShoppingCartStyles.buyNowButton} onPress={()=>navigation.replace("order", {myCart: myCart})}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Mua ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ShoppingCart;