import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
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

    buyNowButton: {
        backgroundColor: '#F44336',
        alignItems: "center",
        height: "100%",
        flex: 2,
        justifyContent: "flex-end",
    },

    productPriceText: {
        fontSize: 18,
        color: "#e91e63",
        fontWeight: "500",
        justifyContent: "flex-start"
    },

    returnButton: {
        flex: 0.8,
        alignItems: "flex-start",
        justifyContent: "center",
    },
});

export default Styles;