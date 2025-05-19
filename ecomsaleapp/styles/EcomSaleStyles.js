import { StyleSheet } from "react-native";

export default StyleSheet.create({
    m:{
        margin:8,
        backgroundColor:"#FFFFFF"
    },
    input_text:{
        width:"auto",
    },

    header:{
        padding: 60,
        textAlign: 'center',
        background: "#1abc9c",
        fontSize: 30,
    },
    flex_view:{
        flexDirection: "row",
        flexWrap:"wrap",
        justifyContent:"center"
    },
    container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        backgroundColor: '#C0C0C0',
        borderRadius: 20,
    },
    selectedButton: {
        backgroundColor: '#4a90e2',
    },
    text: {
        color: '#333',
    },
    selectedText: {
        color: '#fff',
    },
})
