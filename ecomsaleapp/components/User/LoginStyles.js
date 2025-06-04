import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    innerContainer: {
        padding: 20,
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    loginButton: {
        marginTop: 20,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#2196F3',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
