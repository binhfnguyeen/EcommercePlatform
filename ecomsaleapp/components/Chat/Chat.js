import { Text, View } from "react-native"

const Chat = ({route}) => {
    const {shop} = route.params;
    return (
        <View>
            <Text>ID: {shop.id}</Text>
            <Text>Tên cửa hàng: {shop.name}</Text>
        </View>
    );
}

export default Chat;