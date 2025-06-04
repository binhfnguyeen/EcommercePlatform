import { use, useContext, useEffect, useState } from "react";
import { MyDispatchContext, MyShopDispatchContext, MyUserContext } from "../../configs/MyContext";
import { SafeAreaView, View, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileStyles from "./ProfileStyles";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const shopdispatch = useContext(MyShopDispatchContext)
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
    },[])

    if (user?._j !== null) {
        const u = user._j;

        const logout = async () => {
            try {
                setLoading(true)
                await AsyncStorage.removeItem("token")
                await AsyncStorage.removeItem("userId")
                await AsyncStorage.removeItem("userName")
                dispatch({
                    "type": "logout",
                })

                shopdispatch({
                    "type": "notshopowner",
                })

            } catch (ex) {
                console.info(ex)
            } finally {
                setLoading(false)
                console.info(user)
            }

        }

        return (
            <SafeAreaView style={ProfileStyles.container}>
                <View style={ProfileStyles.card}>
                    {u.avatar && (
                        <Image source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${u.avatar}` }} style={ProfileStyles.avatar} />
                    )}
                    <Text style={ProfileStyles.name}>{u.first_name} {u.last_name}</Text>
                    <Text style={ProfileStyles.username}>@{u.username}</Text>

                    <Button
                        mode="contained"
                        style={[ProfileStyles.button, { backgroundColor: "#03A9F4" }]}
                        icon="account"
                        onPress={() => navigation.navigate("updateprofile")}
                    >
                        Thông tin
                    </Button>

                    <Button
                        mode="contained"
                        style={ProfileStyles.button}
                        icon="history"
                        onPress={() => navigation.navigate("historyorders")}
                    >
                        Xem lịch sử đơn hàng
                    </Button>

                    <Button
                        mode="contained"
                        style={[ProfileStyles.button, { backgroundColor: "#03A9F4" }]}
                        icon="message-text"
                        onPress={() => navigation.navigate("historychat")}
                    >
                        Xem lịch sử chat
                    </Button>
                    {user._j.is_superuser == true ? (<><Button
                        mode="contained"
                        onPress={() => navigation.navigate("stats")}
                        style={[ProfileStyles.button, { backgroundColor: "#4CAF50" }]}
                        icon="chart-bar"
                    >
                        Xem thống kê
                    </Button>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate("unapprovedusers")}
                            style={[ProfileStyles.button, { backgroundColor: "#FF9800" }]}
                            icon="store-cog"
                        >
                            Xác nhận chủ cửa hàng
                        </Button>
                    </>) : (<></>)}
                    {user._j.is_shop_owner == true ? (<><Button
                        mode="contained"
                        onPress={() => navigation.navigate("myshop")}
                        style={[ProfileStyles.button, { backgroundColor: "#9C27B0" }]}
                        icon="store"
                    >
                        Cửa hàng
                    </Button>
                    </>) : (<></>)}
                    <Button
                        disabled={loading}
                        loading={loading}
                        mode="outlined"
                        onPress={logout}
                        style={ProfileStyles.logoutButton}
                        labelStyle={{ color: "#e53935" }}
                        icon="logout"
                    >
                        Đăng xuất
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return null;
};

export default Profile;
