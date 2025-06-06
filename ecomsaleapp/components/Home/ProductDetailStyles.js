import { StyleSheet } from "react-native";

export default StyleSheet.create({
    barHeader: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 55,
        backgroundColor: '#fff',
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        zIndex: 100,
    },
    
    returnButton: {
        padding: 5,
    },

    searchContainer: {
        flex: 1,
        marginHorizontal: 10,
    },

    searchBarInput: {
        fontSize: 14,
        paddingVertical: 0,
    },

    viewCart: {
        padding: 5,
        position: 'relative',
    },

    cartBadge: {
        position: 'absolute',
        right: 0,
        top: -5,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    headerContainer: {
        backgroundColor: '#fff',
        paddingBottom: 15,
    },

    imgSliderPaginationBoxStyle: {
        position: 'absolute',
        bottom: 0,
        padding: 0,
        alignSelf: 'center',
    },

    imgSliderDotStyle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 0,
        padding: 0,
        backgroundColor: '#2196F3',
    },

    imgComponentStyle: {
        borderRadius: 15,
        width: '95%',
        marginTop: 5,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },

    closeButtonText: {
        color: '#fff',
        fontSize: 18,
    },

    modalImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
        borderRadius: 15,
    },

    productInfoContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    productNameLarge: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    productPrice: {
        fontSize: 18,
        color: '#2196F3',
        marginTop: 5,
    },

    evaluateInlineSeeAll: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },

    commentContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
    },

    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    shopContainer: {
        flexDirection: "row", 
        alignItems: "center",
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 5,
        width: "100%",
    },

    barFooter: {
        height: 55,
        backgroundColor: '#fff',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },

    chat: {
        flex: 1,
        alignItems: 'center',
    },

    addCart: {
        flex: 1,
        alignItems: 'center',
    },

    buyNowButton: {
        backgroundColor: '#F44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
});
