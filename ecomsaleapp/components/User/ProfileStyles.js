import { StyleSheet } from "react-native";

export default StyleSheet.create({
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