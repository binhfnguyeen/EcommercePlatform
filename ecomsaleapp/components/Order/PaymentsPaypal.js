import { Alert, Linking, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PaymentStyles from "./PaymentsStyles";

const PaymentsPaypal = ({ route }) => {
    const { order, payment, productId, myCart } = route.params;
    const [user, setUser] = useState({})
    const navigation = useNavigation();
    const handleCreatePaypalPayment = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const res = await Apis.post(
                endpoints["paypal-payment"](payment.id),
                {},
                { headers }
            );

            if (res.data.paypal_approve_url) {
                if (myCart?.details?.length > 0) {
                    await Promise.all(
                        myCart.details.map(item =>
                            Apis.delete(endpoints["remove-product-cart"], {
                                headers,
                                data: { product_id: item.product }
                            })
                        )
                    );
                    console.log("Đã xoá các sản phẩm khỏi giỏ hàng");
                }

                Linking.openURL(res.data.paypal_approve_url);
                {
                    productId ?navigation.replace("productdetail", { productId: productId }):navigation.replace("home")
                }
            } else {
                Alert.alert("Lỗi", "Không nhận được liên kết Paypal");
            }
        } catch (err) {
            console.log("Tạo thanh toán paypal bị lỗi: ", err)
            Alert.alert("Lỗi", "Không thể tạo thanh toán");
        }
    }

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            
            const res = await Apis.get(endpoints["current_user"], {headers})
            console.log(res.data);
            setUser(res.data)
        } catch (err) {
            console.log("Lỗi: ", err)
        }
    }

    const handleCancelOrder = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const res = await Apis.delete(endpoints["cancel-order"](order.id), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200 || res.status === 204) {
                Alert.alert("Thành công", "Đơn hàng đã được huỷ", [
                    {
                        text: "OK",
                        onPress: () => productId ?navigation.replace("productdetail", { productId: productId }):navigation.replace("home")
                    }
                ]);
            } else {
                Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại.");
            }
        } catch (err) {
            console.log("Lỗi huỷ order:", err);
            Alert.alert("Lỗi", "Không thể hủy thanh toán");
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <ScrollView contentContainerStyle={PaymentStyles.container}>
            <View style={PaymentStyles.card}>
                <Text style={PaymentStyles.title}>Thông tin đơn hàng</Text>
                <Text style={PaymentStyles.label}>ID đơn hàng:</Text>
                <Text style={PaymentStyles.value}>#{order.id}</Text>

                <Text style={PaymentStyles.label}>Họ và tên:</Text>
                <Text style={PaymentStyles.value}>{user?.last_name} {user?.first_name}</Text>

                <Text style={PaymentStyles.label}>Số điện thoại:</Text>
                <Text style={PaymentStyles.value}>{order.phone}</Text>

                <Text style={PaymentStyles.label}>Địa chỉ nhận:</Text>
                <Text style={PaymentStyles.value}>{order.shipping_address}</Text>

                <Text style={PaymentStyles.label}>Trạng thái đơn hàng:</Text>
                <Text style={[PaymentStyles.value, order.status === "PENDING" && PaymentStyles.pending]}>
                    {order.status === "PENDING" ? "Đang xử lý" : order.status}
                </Text>

                <Text style={PaymentStyles.label}>Tổng giá tiền:</Text>
                <Text style={[PaymentStyles.value, PaymentStyles.price]}>{order.total.toLocaleString()} VND</Text>

                <Text style={PaymentStyles.label}>Thanh toán:</Text>
                <Text style={PaymentStyles.value}>{payment.payment_method}</Text>
            </View>

            <TouchableOpacity style={PaymentStyles.button} onPress={handleCancelOrder}>
                <Text style={PaymentStyles.buttonText}>Hủy thanh toán</Text>
            </TouchableOpacity>

            <TouchableOpacity style={PaymentStyles.buttonPrimary} onPress={handleCreatePaypalPayment}>
                <Text style={PaymentStyles.buttonText}>Thanh toán bằng PayPal</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

export default PaymentsPaypal;