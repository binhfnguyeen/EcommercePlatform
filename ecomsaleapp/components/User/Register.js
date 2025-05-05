import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import EcomSaleStyles from "../../styles/EcomSaleStyles";


const Register = () => {
    const info = [{
        label: 'Tên',
        icon: "text",
        secureTextEntry: false,
        field: "first_name"
    }, {
        label: 'Họ và tên lót',
        icon: "text",
        secureTextEntry: false,
        field: "last_name"
    }, {
        label: 'Tên đăng nhập',
        icon: "text",
        secureTextEntry: false,
        field: "username"
    }, {
        label: 'Mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "password"
    }, {
        label: 'Xác nhận mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "confirm"
    }];
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checked,setChecked]=useState(true);


    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled)
                setState(result.assets[0], "avatar");
        }
    }

    const setState = (value, field) => {
        setUser({...user, [field]: value});
    }

    const validate = () => {
        if (!user?.username || !user?.password) {
            setMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
            return false;
        } else if (user.password !== user.confirm) {
            setMsg("Mật khẩu KHÔNG khớp!");
            return false;
        }

        setMsg(null);
        
        return true;
    }
    const toggleShopOwner = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        setState(newChecked.toString(), "is_shop_owner");
    };

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                let form = new FormData();
                for (let key in user) {
                    if (key !== 'confirm') {
                        if (key === 'avatar' && user?.avatar !== null) {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: user.avatar.type
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }
                console.info(user)
                console.info(form)
                console.info("xog")
                let res = await Apis.post(endpoints['users'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // console.error("Registration failed:", ex.response?.data || ex.message);
                console.info("xog")
                console.info(res.data)
                if (res.status === 201) {
                    console.info("dang ky thanh cong")
                }
            } catch (ex) {
                console.error("Registration failed:", ex.response?.data || ex.message);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <SafeAreaView style={EcomSaleStyles.static}>
            <ScrollView >
                <Image source={{uri:'https://res.cloudinary.com/dvlwb6o7e/image/upload/v1746351973/logo_jnqxrj.png'}} style={{ width: 100, height: 100, borderRadius: 20, marginLeft:"auto",marginRight:"auto", marginTop:8 }}/>
                <HelperText type="error" visible={msg}>
                    {msg}
                </HelperText>

                {info.map(i => <TextInput value={user[i.field]} onChangeText={t => setState(t, i.field)} style={EcomSaleStyles.m} key={i.field} label={i.label} secureTextEntry={i.secureTextEntry} right={<TextInput.Icon icon={i.icon} />} />)}
                <Text style={{margin:8}}>Đăng ký làm người bán:</Text>
                <Checkbox key={'is_shop_owner'} status={checked?'checked':'unchecked'} onPress={toggleShopOwner} label="Đăng ký người bán"></Checkbox>
                
                <TouchableOpacity style={{margin:8}} onPress={picker}>
                    <Text>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>

                {user?.avatar && <Image style={{ width: 100, height: 100, borderRadius: 50, marginLeft:"auto",marginRight:"auto", marginTop:8 }} source={{uri: user.avatar.uri}} />}

                <Button disabled={loading} loading={loading} onPress={register} buttonColor="#DCDCDC" style={{margin:8}}>Đăng ký</Button>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Register;