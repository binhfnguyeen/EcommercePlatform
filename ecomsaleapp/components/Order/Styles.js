import { StyleSheet } from "react-native";

export default Styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },

    label: {
        fontSize: 16,
        marginBottom: 6,
        marginTop: 12,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
    },

    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        alignContent: "center"
    },

    button: {
        padding: 10,
        backgroundColor: "#eee",
        borderRadius: 5,
        marginHorizontal: 10,
    },

    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },

    quantityText: {
        fontSize: 16,
        minWidth: 30,
        textAlign: "center",
    }
});