import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const PaymentsPaypal = ({route}) => {
    const { order, payment, productId } = route.params;
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
                Linking.openURL(res.data.paypal_approve_url);
                navigation.replace("productdetail", { productId: productId });
            } else {
                Alert.alert("Lỗi", "Không nhận được liên kết Paypal");
            }
        } catch (err) {
            console.log("Tạo thanh toán paypal bị lỗi: ", err)
            Alert.alert("Lỗi", "Không thể tạo thanh toán");
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
                        onPress: () => navigation.replace("productdetail", { productId: productId })
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

    
    return (
        <View>
            <Text>Đơn hàng #{order.id}</Text>
            <Text>Thanh toán: {payment.payment_method}</Text>

            <TouchableOpacity style={Styles.button} onPress={handleCancelOrder}>
                <Text style={Styles.buttonText}>Hủy thanh toán</Text>
            </TouchableOpacity>

            <TouchableOpacity style={Styles.button} onPress={handleCreatePaypalPayment}>
                <Text style={Styles.buttonText}>Thanh toán bằng paypal</Text>
            </TouchableOpacity>
        </View>
    );
}

export default PaymentsPaypal;