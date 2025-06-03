import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    replyInputContainer: {
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    replyInputTitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    replyTextInput: {
        backgroundColor: "white",
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    replyButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    pickImageButton: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        padding: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    pickImageButtonText: {
        color: "#333",
        fontWeight: "bold",
    },
    submitButton: {
        flex: 1,
        backgroundColor: "#2196F3",
        padding: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
    },

    commentContainer: {
        padding: 10,
        backgroundColor: "white",
        margin: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
    heartButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    replyContainer: {
        backgroundColor: "#f2f2f2",
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 8,
    },
    replyAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
});
