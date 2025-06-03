import { StyleSheet } from "react-native";

export default StyleSheet.create({
    commentContainer: {
        backgroundColor: "#fff",
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        gap: 8,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },

    messageButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#2196F3",
        borderRadius: 6,
        backgroundColor: "#E3F2FD",
    },

    heartButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#FF3B30",
        borderRadius: 6,
        backgroundColor: "#FFEAEA",
    },

    replyContainer: {
        marginTop: 10,
        marginLeft: 20,
        padding: 10,
        backgroundColor: "#f3f3f3",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#2196F3",
    },

    replyAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
});
