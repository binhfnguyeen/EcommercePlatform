import { Alert, Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyShopDispatchContext } from "../../configs/MyContext";
import LoginStyles from "./LoginStyles";
import Ionicons from "react-native-vector-icons/Ionicons";

const Login = () => {
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);
    const shopdispatch = useContext(MyShopDispatchContext);

    const setState = (value, field) => setUser({ ...user, [field]: value });

    const validate = () => {
        if (!user?.username || !user?.password) {
            setMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
            return false;
        }
        setMsg(null);
        return true;
    };

    const login = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            let res = await Apis.post(endpoints['token'], {
                ...user,
                client_id: "9DgjVd5V4sLg5ZyppXVYuOnIGouBs4Bk96cnsPxe",
                client_secret: "JNnblcFnsTWRRMe6zR53GV4kxrvWwmn4FwYGovyWGkm6L2n3TqJGPmDBbi34EV3JseJn7O4gt2Z8J7YKyBoo8gxUoUFAUHeSeVY7f5uwC6CmoiM0nOmUePk50DS5A13E",
                grant_type: "password"
            });

            let u = await authApis(res.data.access_token).get(endpoints['current_user']);
            if (!u.data.is_approved) {
                Alert.alert("Tài khoản chưa được duyệt");
                return;
            }

            await AsyncStorage.setItem("token", res.data.access_token);
            await AsyncStorage.setItem("userId", u.data.id.toString());
            await AsyncStorage.setItem("userName", u.data.username);

            dispatch({ type: "login", payload: u.data });

            if (u.data.is_shop_owner) {
                let s = await authApis(res.data.access_token).get(endpoints['my-shop']);
                shopdispatch({ type: "getshop", payload: s.data });
            }

        } catch (ex) {
            if (ex.response && ex.response.status === 404) {
                Alert.alert("Bạn chưa có shop", "Hãy tạo shop của mình");
            } else {
                console.error(ex);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={LoginStyles.container}>
            <ScrollView contentContainerStyle={LoginStyles.innerContainer}>

                <Image
                    source={{ uri: 'https://res.cloudinary.com/dvlwb6o7e/image/upload/v1746351973/logo_jnqxrj.png' }}
                    style={LoginStyles.logo}
                />

                <Text style={LoginStyles.title}>Đăng nhập</Text>

                <HelperText type="error" visible={msg}>
                    {msg}
                </HelperText>

                <TextInput
                    label="Tên đăng nhập"
                    value={user.username}
                    onChangeText={t => setState(t, 'username')}
                    mode="outlined"
                    style={LoginStyles.input}
                    left={<TextInput.Icon icon="account" />}
                />

                <TextInput
                    label="Mật khẩu"
                    value={user.password}
                    onChangeText={t => setState(t, 'password')}
                    secureTextEntry={!showPassword}
                    mode="outlined"
                    style={LoginStyles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                />

                <Button
                    mode="contained"
                    onPress={login}
                    disabled={loading}
                    loading={loading}
                    style={LoginStyles.loginButton}
                    labelStyle={LoginStyles.loginButtonText}
                >
                    Đăng nhập
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;
