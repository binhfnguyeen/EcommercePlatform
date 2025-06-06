import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import RegisterStyles from "./RegisterStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeStyles from "../Home/HomeStyles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileStyles from "./ProfileStyles";
import { useNavigation } from "@react-navigation/native";

const UpdateProfile = () => {
    const fields = [
        { label: 'Tên', field: "first_name", icon: "account" },
        { label: 'Họ và tên lót', field: "last_name", icon: "account" },
        { label: 'Tên đăng nhập', field: "username", icon: "account-circle" },
        { label: 'Mật khẩu mới (nếu đổi)', field: "password", icon: "lock", secure: true },
        {label: 'Xác nhận mật khẩu', field: "confirm", icon: "lock-check", secure: true}
    ];

    const [user, setUser] = useState({});
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigation=useNavigation()

    const setState = (value, field) => {
        setUser((prev) => ({ ...prev, [field]: value }));
    };

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Không có quyền truy cập thư viện ảnh!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            setState(result.assets[0], "avatar");
        }
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

    const loadCurrentUser = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }
            console.info("xog1")
            const res = await authApis(token).get(endpoints["current_user"]);
            const data = res.data;
            console.info(res.data)
            setUser({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                username: data.username || "",
                avatar: data.avatar
                    ? { uri: `https://res.cloudinary.com/dvlwb6o7e/${data.avatar}` }
                    : null
            });
        } catch (err) {
            console.error("Lỗi khi tải thông tin người dùng:", err);
            setMsg("Không thể tải dữ liệu người dùng.");
        } finally{
            setLoading(false)
            console.info(res.data)
        }
    };

    useEffect(() => {
        loadCurrentUser();
    }, []);

    const validate = () => {
        if (user.password && user.password !== user.confirm) {
            setMsg("Mật khẩu xác nhận không khớp!");
            return false;
        }
        setMsg(null);
        return true;
    };

    const updateProfile = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            let form = new FormData();

            for (let key in user) {
                if (user[key]) {
                    if (key === "avatar" && user.avatar?.uri) {
                        const resized = await resizeImage(user.avatar);
                        form.append("avatar", resized);
                    } else if (key !== 'show_password') {
                        form.append(key, user[key]);
                    }
                }
            }
            
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }
            const res = await authApis(token).patch(endpoints["current_user"], form, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                alert("thành công","Cập nhật thành công!");
            }
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            setMsg("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={RegisterStyles.container}>
                <View style={{ padding: 10 }}>
                    <TouchableOpacity style={ProfileStyles.returnButton} onPress={() => navigation.navigate("profile_main")}>
                        <Ionicons name="arrow-back" size={28} color="#2196F3" />
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:15}}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    <Text style={RegisterStyles.title}>Cập nhật thông tin cá nhân</Text>

                    <HelperText type="error" visible={!!msg}>{msg}</HelperText>

                    {fields.map(i => (
                        <TextInput
                            key={i.field}
                            label={i.label}
                            value={user[i.field] || ""}
                            onChangeText={t => setState(t, i.field)}
                            mode="outlined"
                            style={RegisterStyles.input}
                            secureTextEntry={i.secure && !user[`show_${i.field}`]}
                            left={<TextInput.Icon icon={i.icon} />}
                            right={i.secure ? (
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

                    <TouchableOpacity onPress={picker}>
                        <Text style={RegisterStyles.pickerText}>Chọn ảnh đại diện mới...</Text>
                    </TouchableOpacity>

                    {user?.avatar?.uri && (
                        <Image style={RegisterStyles.avatar} source={{ uri: user.avatar.uri }} />
                    )}

                    <Button
                        mode="contained"
                        disabled={loading}
                        loading={loading}
                        onPress={updateProfile}
                        buttonColor="#007AFF"
                        textColor="#000000"
                        style={RegisterStyles.button}
                        labelStyle={RegisterStyles.registerButtonText}
                    >
                        Cập nhật
                    </Button>
                </ScrollView>
                </View>
                
        </SafeAreaView>
    );
};

export default UpdateProfile;
