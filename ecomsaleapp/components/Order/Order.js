import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import OrderStyles from "./OrderStyles"
import Apis, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Order = ({ route }) => {
    const productId = route.params?.productId;
    const {myCart} = route.params; 
    const [shippingAddress, setShippingAddress] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [quantity, setQuantity] = useState(1);
    const [phone, setPhone] = useState("");
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);

    const getCurrentUser = async () => {
        const token = await AsyncStorage.getItem("token");
        console.log(token)
        const res = await Apis.get(endpoints['current_user'], {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    }

    const incQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decQuantity = () => {
        if (quantity > 1)
            setQuantity(prev => prev - 1);
    }

    useEffect(() => {
        if (myCart && myCart.details) {
            setCartItems(myCart.details);
        }
    }, [myCart]);

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập trước.");
                return;
            }

            const orderHeaders = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            const orderBody = {
                shipping_address: shippingAddress,
                phone: phone,
                status: "PENDING",
                items: productId
                    ? [{ product_id: productId, quantity: quantity }]
                    : cartItems.map(item => ({
                        product_id: item.product,
                        quantity: item.quantity
                    }))
            };

            const orderRes = await Apis.post(endpoints["orders"], orderBody, { headers: orderHeaders });
            const createdOrder = orderRes.data;
            console.log("Đã tạo Order ", createdOrder);

            const paymentBody = {
                payment_method: "PAYPAL",
                total: createdOrder.total,
                status: true,
                order: createdOrder.id
            };

            const paymentRes = await Apis.post(endpoints["payments"], paymentBody, { headers: orderHeaders });
            const createdPayment = paymentRes.data;
            console.log("Đã tạo Payment", createdPayment);

            navigation.navigate("paymentspaypal", { order: createdOrder, payment: createdPayment, productId: productId, myCart: myCart });

        } catch (err) {
            console.error("Lỗi trong quá trình đặt hàng và thanh toán:", err);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi xử lý thanh toán.");
        }
    };

    return (
        <ScrollView style={OrderStyles.container}>
            <Text style={OrderStyles.label}>Địa chỉ giao hàng:</Text>
            <TextInput style={OrderStyles.input} value={shippingAddress} onChangeText={setShippingAddress} placeholder="Nhập địa chỉ..."/>

            <Text style={OrderStyles.label}>Số điện thoại:</Text>
            <TextInput style={OrderStyles.input} value={phone} onChangeText={setPhone} placeholder="Nhập số điện thoại..."/>

            {productId ? <Text style={OrderStyles.label}>Số lượng:</Text> : null}
            {productId ?
                <View style={OrderStyles.quantityContainer}>
                    <TouchableOpacity onPress={decQuantity} style={OrderStyles.quantityButton}>
                        <Text style={OrderStyles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={OrderStyles.quantityInput}
                        value={quantity.toString()}
                        onChangeText={text => setQuantity(parseInt(text) || 1)}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={incQuantity} style={OrderStyles.quantityButton}>
                        <Text style={OrderStyles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View> : null
            }

            <TouchableOpacity style={OrderStyles.button} onPress={handleSubmit}>
                <Text style={OrderStyles.buttonText}>Xác nhận thanh toán</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Order;
