import { useContext, useEffect } from "react";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const navigation = useNavigation();

    useEffect(() => {
        if (user === null) {
            navigation.jumpTo("login");
        }
    }, [user]);

    if (user?._j !== null) {
        const u = user._j;

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
                        // onPress={() => navigation.navigate("order")}
                    >
                        Xem lịch sử đơn hàng
                    </Button>

                    <Button
                        mode="contained"
                        style={[styles.button, { backgroundColor: "#03A9F4" }]}
                        icon="message-text"
                        // onPress={() => navigation.navigate("chat")}
                    >
                        Xem lịch sử chat
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => dispatch({ type: "logout" })}
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
