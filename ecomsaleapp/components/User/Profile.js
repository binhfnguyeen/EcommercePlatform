import { use, useContext, useEffect, useState } from "react";
import { MyDispatchContext, MyShopDispatchContext, MyUserContext } from "../../configs/MyContext";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const shopdispatch=useContext(MyShopDispatchContext)
    const navigation = useNavigation();
    const[loading,setLoading]=useState(false)

    if (user?._j !== null) {
        const u = user._j;

    const logout= async ()=>{
        try{
            setLoading(true)
            await AsyncStorage.removeItem("token")
            await AsyncStorage.removeItem("userId")
            await AsyncStorage.removeItem("userName")
            dispatch({
                "type":"logout",
            })

            shopdispatch({
                "type":"notshopowner",
            })
            
        }catch(ex){
            console.info(ex)
        }finally{
            setLoading(false)
            console.info(user)
        }
        
    }

        return (
            <SafeAreaView style={styles.container}>  
                <View style={styles.card}>
                    {u.avatar && (
                        <Image source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${u.avatar}` }} style={styles.avatar} />
                    )}
                    <Text style={styles.name}>{u.first_name} {u.last_name}</Text>
                    <Text style={styles.username}>@{u.username}</Text>

                    <Button
                        mode="contained"
                        style={styles.button}
                        icon="history"
                        onPress={() => navigation.navigate("historyorders")}
                    >
                        Xem lịch sử đơn hàng
                    </Button>

                    <Button
                        mode="contained"
                        style={[styles.button, { backgroundColor: "#03A9F4" }]}
                        icon="message-text"
                        onPress={() => navigation.navigate("historychat")}
                    >
                        Xem lịch sử chat
                    </Button>
                    {user._j.is_superuser==true ?(<><Button
                        mode="outlined"
                        onPress={()=>navigation.navigate("stats")}
                        style={[styles.button, { backgroundColor: "#03A9F4" }]}
                        labelStyle={{ color: "#e53935" }}
                    >
                        Xem thống kê
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={()=>navigation.navigate("unapprovedusers")}
                        style={[styles.button, { backgroundColor: "#03A9F4" }]}
                        labelStyle={{ color: "#e53935" }}
                    >
                        Danh sách user chưa được xác nhận
                    </Button>
                    </>):(<></>)}
                    {/* <Button
                        disabled={loading} 
                        loading={loading}
                        mode="outlined"
                        onPress={()=>navigation.navigate("stats")}
                        style={[styles.button, { backgroundColor: "#03A9F4" }]}
                        labelStyle={{ color: "#e53935" }}
                    >
                        Xem thống kê
                    </Button> */}
                    <Button
                        disabled={loading} 
                        loading={loading}
                        mode="outlined"
                        onPress={logout}
                        style={styles.logoutButton}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        width: "100%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
    },
    username: {
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
    },
    phone: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    button: {
        width: "100%",
        marginVertical: 8,
        borderRadius: 10,
    },
    logoutButton: {
        width: "100%",
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#e53935",
        borderRadius: 10,
    },
});
