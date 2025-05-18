import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 16,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#dee2e6",
        alignItems: "center",
        justifyContent: "center",
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    quantityInput: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#fff",
    }
});
