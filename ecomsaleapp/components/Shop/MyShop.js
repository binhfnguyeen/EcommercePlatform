import { useContext, useEffect, useState } from "react";
import { MyShopContext, MyShopDispatchContext, MyUserContext } from "../../configs/MyContext";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EcomSaleStyles from "../../styles/EcomSaleStyles";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons"
import { ActivityIndicator } from "react-native-paper";
import MyShopStyles from "./MyShopStyles";


const Stack = createNativeStackNavigator();
const MyShop = () => {
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const shop = useContext(MyShopContext)
    const shopdispatch=useContext(MyShopDispatchContext)



    // const StackNavigate = () => {
    //     return (
    //         <NavigationContainer>
    //             <Stack.Navigator initialRouteName="shopdetail" screenOptions={{headerShown: false}}>
    //                 <Stack.Screen name="myshop" component={MyShop} />
    //                 <Stack.Screen name="shopdetail" component={ShopDetail} />
    //             </Stack.Navigator>
    //         </NavigationContainer>
    //     )
    //     }

    const loadShop = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }

            const res = await authApis(token).get(endpoints['my-shop']);
            shopdispatch({
                "type":"getshop",
                "payload":res.data
            })

            // setShop(res.data)
        } catch (ex) {
            if (ex.response && ex.response.status === 404) {
                Alert.alert("Bạn chưa có shop nào","Hãy tạo shop của mình");
            } else {
                console.error(ex);
            }
        } finally {
            setLoading(false);
            // console.info(res.data)
        }
    };

    useEffect(() => {
        loadShop();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={MyShopStyles.container}>
            <View style={MyShopStyles.barHeader}>
                <TouchableOpacity style={MyShopStyles.returnButton} onPress={() => navigation.navigate("profile_main")}>
                    <Ionicons name="return-down-back" size={24} color="#2196F3" />
                </TouchableOpacity>
                <Text style={MyShopStyles.textMyShop}>
                    Của hàng của bạn
                </Text>
            </View>
            <View style={MyShopStyles.buttonContainer}>
                {shop === null || shop._j==null ? (
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => navigation.navigate('createshop')}
                        style={MyShopStyles.shopButton}
                    >
                        <Text style={MyShopStyles.shopButtonText}>Tạo cửa hàng của bạn</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => navigation.navigate('shopdetail', { shopId: shop.id })}
                        style={MyShopStyles.shopButton}
                    >
                        <Text style={MyShopStyles.shopButtonText}>{shop._j.name}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
export default MyShop;
