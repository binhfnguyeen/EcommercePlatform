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


const Stack=createNativeStackNavigator();
const MyShop = () => {
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const navigation=useNavigation();
    const shop=useContext(MyShopContext)
    // const shopdispatch=useContext(MyShopDispatchContext)
    


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

    // const loadShop = async () => {
    //     try {
    //         setLoading(true);
    //         const token = await AsyncStorage.getItem('token');
    //         if (!token) {
    //             console.warn("No token found");
    //             return;
    //         }

    //         const res = await authApis(token).get(endpoints['my-shop']);
    //         shopdispatch({
    //             "type":"getshop",
    //             "payload":res.data
    //         })
            
    //         // setShop(res.data)
    //     } catch (ex) {
    //         if (ex.response && ex.response.status === 404) {
    //             Alert.alert("Bạn chưa có shop nào","Hãy tạo shop của mình");
    //         } else {
    //             console.error(ex);
    //         }
    //     } finally {
    //         setLoading(false);
    //         // console.info(res.data)
    //     }
    // };

    // useEffect(() => {
    //     loadShop();
    // }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View>
            <Text style={EcomSaleStyles.header}>Của hàng của bạn</Text>
            {!shop ? (
            <TouchableOpacity disabled={loading} loading={loading} mode="contained" onPress={() => navigation.navigate('createshop')} style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,          
                    backgroundColor: '#2196F3',
                    borderRadius:20,
                    margin:8 
                }}><Text>Tạo của hàng của bạn</Text></TouchableOpacity>
            ):( <TouchableOpacity disabled={loading} loading={loading} mode="contained" onPress={() => navigation.navigate('shopdetail',{'shopId':shop.id})} style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,          
                    backgroundColor: '#2196F3',
                    borderRadius:20,
                    margin:8 
                }}><Text>{shop._j.name}</Text></TouchableOpacity>)}
            
            {/* <TouchableOpacity onPress={() => navigation.navigate('index',{screen:'ShopDetail',params: { shopId: shop.id }})}><Text>{shop.name}</Text></TouchableOpacity> */}
           
        </View>
    );
};
export default MyShop;
