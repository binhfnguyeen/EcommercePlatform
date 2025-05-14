import { Text, View } from "react-native";

const ShoppingCart = ({ route }) => {
    const myCartId = route.params?.myCartId;
    return (
        <View>
            <View>
                {myCartId !== null ? (
                    <Text>Shopping Cart {myCartId}</Text>
                ) : (
                    <Text>Bạn chưa đăng nhập</Text>
                )}
            </View>
        </View>
    )
}

export default ShoppingCart;