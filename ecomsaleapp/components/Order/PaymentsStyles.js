import { StyleSheet } from "react-native";

const PaymentStyles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f5f5f5",
        flexGrow: 1,
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        width: "100%",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        color: "#888",
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        color: "#222",
        marginBottom: 4,
    },
    pending: {
        color: "#e67e22",
        fontWeight: "bold",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#27ae60",
    },
    button: {
        backgroundColor: "#e74c3c",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
        marginBottom: 12,
    },
    buttonPrimary: {
        backgroundColor: "#3498db",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default PaymentStyles;