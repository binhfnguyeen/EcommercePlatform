import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import EcomSaleStyles from "../../styles/EcomSaleStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyShopDispatchContext } from "../../configs/MyContext";


const Login = () => {
    const info = [ {
        label: 'Tên đăng nhập',
        icon: "text",
        secureTextEntry: false,
        field: "username"
    }, {
        label: 'Mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "password"
    }];
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav=useNavigation();
    const dispatch = useContext(MyDispatchContext)
    const shopdispatch=useContext(MyShopDispatchContext)

    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }

    const validate = () => {
        if (!user?.username || !user?.password) {
            setMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
            return false;
        }
        setMsg(null);
        
        return true;
    }

    const login = async () => {
        if (validate() === true) {
            try {
                setLoading(true);

                let form = new FormData();
                for (let key in user) {
                    if (key !== 'confirm') {
                        form.append(key,user[key])
                    }
                }
                // console.info(form)
                // console.info(Apis.defaults)
                let res = await Apis.post(endpoints['token'], {
                    ...user,
                    "client_id":"9DgjVd5V4sLg5ZyppXVYuOnIGouBs4Bk96cnsPxe",
                    "client_secret":"JNnblcFnsTWRRMe6zR53GV4kxrvWwmn4FwYGovyWGkm6L2n3TqJGPmDBbi34EV3JseJn7O4gt2Z8J7YKyBoo8gxUoUFAUHeSeVY7f5uwC6CmoiM0nOmUePk50DS5A13E",
                    "grant_type": "password"
                    
                });
                console.info(res.data)
                await AsyncStorage.setItem("token",res.data.access_token);
                
                let u= await authApis(res.data.access_token).get(endpoints['current_user'])
                await AsyncStorage.setItem("userId", u.data.id.toString());
                await AsyncStorage.setItem("userName", u.data.username);
                let s=await authApis(res.data.access_token).get(endpoints['my-shop']);
                console.info(u.data)
                console.info(AsyncStorage.getItem('token'))

                dispatch({
                    "type":"login",
                    "payload":u.data
                })

                if (u.is_shop_owner==true)
                    shopdispatch({
                        "type":"isshopowner",
                        "payload":s.data
                    })

                // console.info(MyDispatchContext)
                // nav.navigate("profile")

            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <HelperText type="error" visible={msg}>
                    {msg}
                </HelperText>

                {info.map(i => <TextInput value={user[i.field]} onChangeText={t => setState(t, i.field)} style={EcomSaleStyles.m} key={i.field} label={i.label} secureTextEntry={i.secureTextEntry} right={<TextInput.Icon icon={i.icon} />} />)}

                <Button disabled={loading} loading={loading} onPress={login} buttonColor="#DCDCDC" style={{margin:8}}>Đăng nhập</Button>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Login;