import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/MyContext";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EcomSaleStyles from "../../styles/EcomSaleStyles";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons"
import { ActivityIndicator } from "react-native-paper";


const Stack=createNativeStackNavigator();
const MyShop = () => {
    const user = useContext(MyUserContext);
    const [shop, setShop] = useState();
    const [loading, setLoading] = useState(false);
    const navigation=useNavigation();


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
            for(let d in res.data){
                // setState(res.data[d],d);
                setShop(res.data)
                // console.info(res.data)
                // console.info(shop)
            }
            // setShop(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
            // console.info(res.data)
            console.info(shop.user)
        }
    };

    useEffect(() => {
        loadShop();
    }, []);

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
                }}><Text>{shop.name}</Text></TouchableOpacity>)}
            
            {/* <TouchableOpacity onPress={() => navigation.navigate('index',{screen:'ShopDetail',params: { shopId: shop.id }})}><Text>{shop.name}</Text></TouchableOpacity> */}
           
        </View>
    );
};
export default MyShop;
