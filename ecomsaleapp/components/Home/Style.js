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

    imgSliderPaginationBoxStyle: {
        position: "absolute",
        bottom: 0,
        padding: 0,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 10
    },

    imgSliderDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 0,
        padding: 0,
        margin: 0,
        backgroundColor: "rgba(128, 128, 128, 0.92)"
    },

    imgComponentStyle: {
        borderRadius: 15,
        width: '100%',
        marginTop: 5,
    },

    commentContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
    },

    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    replyContainer: {
        marginTop: 10,
        marginLeft: 20,
        padding: 10,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
    },

    replyAvatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 8,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },

    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 1,
    },

    closeButtonText: {
        color: "white",
        fontSize: 18,
    },

    modalImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },

    productTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 20,
    },

    headerContainer: {
        paddingTop: 5,
    },

    productInfoContainer: {
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },

    productNameLarge: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 5,
        color: "#222",
    },

    productPrice: {
        fontSize: 18,
        color: "#e91e63",
        fontWeight: "500",
    },

    commentContainer: {
        marginTop: 10,
        marginHorizontal: 16,
        padding: 12,
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "#ddd",
    },

    replyContainer: {
        marginTop: 10,
        marginLeft: 20,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#2196F3",
    },

    productTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
        color: "#444",
        paddingHorizontal: 16,
    },

    evaluateInlineSeeAll: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#eee"
    }, 

    shopContainer: {
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },

    barFooter: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    },

    barHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    chat: {
        alignItems: "center",
        flex: 1,
    },

    addCart: {
        alignItems: "center",
        flex: 1,
    },

    buyNowButton: {
        backgroundColor: '#F44336',
        alignItems: "center",
        height: "100%",
        flex: 2,
        justifyContent: "center",
    }, 

    returnButton: {
        flex: 0.8,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    searchBar: {
        flex: 3,
        marginHorizontal: 8,
        justifyContent: "center",
    },

    viewCart: {
        flex: 0.8,
        alignItems: "flex-end",
        justifyContent: "center",
    },

    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },

    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

});

export default Style;