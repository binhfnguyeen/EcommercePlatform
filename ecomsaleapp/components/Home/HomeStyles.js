import { StyleSheet } from "react-native";

const HomeStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    flatListContent: {
        padding: 10,
        paddingTop: 70,
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

    imgComponentStyle: {
        borderRadius: 15,
        width: '100%',
        marginTop: 5,
    },

    imgSliderDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 0,
        padding: 0,
        margin: 0,
        backgroundColor: "rgba(128, 128, 128, 0.92)",
    },

    imgSliderPaginationBoxStyle: {
        position: "absolute",
        bottom: 0,
        padding: 0,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 10,
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
        flex: 0.5,
        alignItems: "flex-start",
        justifyContent: "center",
        // backgroundColor: '#FFFF66',
    },

    searchBarHome: {
        flex: 3,
        marginHorizontal: 8,
        justifyContent: "center",
    },

    viewCartHome: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    cartBadgeHome: {
        position: 'absolute',
        top: -4,
        right: 8,
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

    searchContainer: {
        flex: 3,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        paddingHorizontal: 12,
        elevation: 2,
    },

    searchBarInput: {
        fontSize: 14,
        paddingVertical: 0,
        height: 40,
        marginTop: -2,
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
        borderColor: "#eee",
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

});

export default HomeStyles;