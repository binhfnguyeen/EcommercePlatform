import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    pickerText: {
        textAlign: 'center',
        color: '#007AFF',
        fontSize: 16,
        marginTop: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginVertical: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 1,
    },
    checkboxLabel: {
        fontSize: 16,
        marginLeft: 8,
    },
    button: {
        marginTop: 20,
        borderRadius: 8,
        paddingVertical: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        paddingBottom: 10
    },
});
