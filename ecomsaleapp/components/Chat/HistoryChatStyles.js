import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },

    chatContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
        backgroundColor: "#f0f0f0",
    },

    chatInfo: {
        flex: 1,
        justifyContent: "center",
    },

    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },

    lastMessage: {
        fontSize: 14,
        color: "#666",
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    emptyText: {
        textAlign: "center",
        padding: 20,
        fontSize: 16,
        color: "#888",
    },

    timestamp: {
        fontSize: 10,
        color: "#888",
        marginTop: 4,
        alignSelf: "flex-end",
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

    returnButton: {
        flex: 0.8,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    textMyCart: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: -1
    }
});