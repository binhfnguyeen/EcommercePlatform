import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import EcomSaleStyles from "../../styles/EcomSaleStyles";
import * as ImageManipulator from 'expo-image-manipulator';
import RegisterStyles from "./RegisterStyles";


const Register = () => {
    const info = [{
        label: 'Tên',
        icon: "text",
        secureTextEntry: false,
        field: "first_name",
        leftIcon: "account"
    }, {
        label: 'Họ và tên lót',
        icon: "text",
        secureTextEntry: false,
        field: "last_name",
        leftIcon: "account"
    }, {
        label: 'Tên đăng nhập',
        icon: "text",
        secureTextEntry: false,
        field: "username",
        leftIcon: "account-circle"
    }, {
        label: 'Mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "password",
        leftIcon: "lock"
    }, {
        label: 'Xác nhận mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "confirm",
        leftIcon: "lock-check"
    }];
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);


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
        setUser({ ...user, [field]: value });
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
        setState(newChecked, "is_shop_owner");
    };

    const resizeImage = async (image) => {
        try {
            const result = await ImageManipulator.manipulateAsync(
                image.uri,
                [{ resize: { width: 800, height: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            return {
                uri: result.uri,
                name: 'avatar.jpg',
                type: 'image/jpeg'
            };
        } catch (err) {
            console.error("Lỗi resize ảnh:", err);
            return image;
        }
    };

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                let form = new FormData();
                for (let key in user) {
                    if (key !== 'confirm') {
                        if (key === 'avatar' && user?.avatar !== null) {
                            const resizedAvatar = await resizeImage(user.avatar)
                            form.append(key, resizedAvatar);
                        } else {
                            if (key == 'is_shop_owner')
                                form.append(key, user[key].toString());
                            else { form.append(key, user[key]); }
                        }
                    }
                }
                console.info(user)
                console.info(form)
                console.info("xog")
                let res = await Apis.post(endpoints['users'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 15000,
                });
                // console.error("Registration failed:", ex.response?.data || ex.message);
                console.info("xog")
                console.info(res.data)
                if (res.status === 201) {
                    console.info("dang ky thanh cong")
                }
            } catch (ex) {
                console.info("ERROR:", ex);
                if (ex.response) {
                    console.log("Response:", ex.response.data);
                } else if (ex.request) {
                    console.log("Request:", ex.request);
                } else {
                    console.log("Error Message:", ex.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <SafeAreaView style={RegisterStyles.container}>
            <ScrollView keyboardShouldPersistTaps="handled"  showsVerticalScrollIndicator={false}>
                <Image
                    source={{ uri: 'https://res.cloudinary.com/dvlwb6o7e/image/upload/v1746351973/logo_jnqxrj.png' }}
                    style={RegisterStyles.logo}
                />

                <Text style={RegisterStyles.title}>Đăng ký tài khoản</Text>

                <HelperText type="error" visible={msg}>
                    {msg}
                </HelperText>

                {info.map(i => (
                    <TextInput
                        key={i.field}
                        label={i.label}
                        value={user[i.field]}
                        onChangeText={t => setState(t, i.field)}
                        mode="outlined"
                        style={RegisterStyles.input}
                        secureTextEntry={i.secureTextEntry && !user[`show_${i.field}`]}
                        left={<TextInput.Icon icon={i.leftIcon} />}
                        right={i.secureTextEntry ? (
                            <TextInput.Icon
                                icon={user[`show_${i.field}`] ? "eye-off" : "eye"}
                                onPress={() =>
                                    setUser(prev => ({
                                        ...prev,
                                        [`show_${i.field}`]: !prev[`show_${i.field}`]
                                    }))
                                }
                            />
                        ) : null}
                    />
                ))}

                <View style={RegisterStyles.checkboxContainer}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={toggleShopOwner}
                    />
                    <Text style={RegisterStyles.checkboxLabel}>Đăng ký làm người bán</Text>
                </View>

                <TouchableOpacity onPress={picker}>
                    <Text style={RegisterStyles.pickerText}>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>

                {user?.avatar && (
                    <Image style={RegisterStyles.avatar} source={{ uri: user.avatar.uri }} />
                )}

                <Button
                    disabled={loading}
                    loading={loading}
                    onPress={register}
                    buttonColor="#007AFF"
                    textColor="#fff"
                    style={RegisterStyles.button}
                    labelStyle={RegisterStyles.registerButtonText}
                >
                    Đăng ký
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Register;