import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2; // padding 10 + margin 8 mỗi bên

const Style = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListContent: {
        padding: 10,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    image: {
        width: "100%",
        height: 120,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    cardContent: {
        padding: 10,
    },
    productName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    price: {
        color: "green",
    },
    subText: {
        color: "#555",
    },
});

export default Style;