import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },
    header: {
        padding: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    shopText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    username: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        marginVertical: 4,
        flexDirection: "row",
        paddingBottom: 30,
    },
    currentUser: {
        justifyContent: "flex-end",
    },
    otherUser: {
        justifyContent: "flex-start",
    },
    messageBubble: {
        padding: 10,
        borderRadius: 12,
        maxWidth: "70%",
    },
    messageText: {
        color: "#000",
    },
    messageImage: {
        marginTop: 5,
        width: 150,
        height: 150,
        borderRadius: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        backgroundColor: "#fff",
        borderColor: "#ddd",
    },
    imagePicker: {
        backgroundColor: "#d0e0fc",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 5,
    },
    imagePickerText: {
        color: "#0056b3",
        fontWeight: "600",
    },
    textInput: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        padding: 10,
        marginRight: 5,
    },
    sendButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    sendText: {
        color: "#fff",
        fontWeight: "bold",
    },

    timestamp: {
        fontSize: 10,
        color: "#888",
        marginTop: 4,
        alignSelf: "flex-end",
    },

    returnButton: {
        flex: 0.5,
        alignItems: "flex-start",
        justifyContent: "center",
    }, 
});