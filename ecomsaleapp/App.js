import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home/Home';
import Login from './components/User/Login';
import Register from './components/User/Register';
import ProductDetail from './components/Home/ProductDetail';
import ProductComment from './components/Home/ProductComment';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyUserReducer from './reducers/MyUserReducer';
import { MyShopContext, MyShopDispatchContext, MyUserContext } from './configs/MyContext';
import { MyDispatchContext } from './configs/MyContext';
import { NavigationContainer } from '@react-navigation/native';
import Profile from './components/User/Profile';
import { useReducer, useContext, useEffect } from 'react';
import { Icon } from 'react-native-paper';
import MyShop from './components/Shop/MyShop';
import ShopDetail from './components/Shop/ShopDetail';
import ReplyComment from './components/Home/ReplyComment';
import CreateProduct from './components/Shop/CreateShopProduct';
import { Provider as PaperProvider } from 'react-native-paper';
import Order from './components/Order/Order';
import PaymentsPaypal from './components/Order/PaymentsPaypal';
import ShoppingCart from './components/Cart/ShoppingCart';
import ShopStats from './components/Shop/ShopStats';
import CreateShop from './components/Shop/CreateShop';
import Chat from './components/Chat/Chat';
import HistoryChat from './components/Chat/HistoryChat';
import HistoryOrders from './components/Order/HistoryOrders';
import AdminShopStatsScreen from './components/Admin/AdminShopStats';
import ShopStat from './components/Admin/ShopStat';
import MyShopReducer from './reducers/MyShopReducer';
import ApproveUsersScreen from './components/Admin/UnapprovedUser';
import UpdateProfile from './components/User/UpdateProfile';


const Stack = createNativeStackNavigator();

const StackNavigate = () => {
  return (
    <Stack.Navigator  screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="productdetail" component={ProductDetail} />
      <Stack.Screen name="productcomment" component={ProductComment} />
      <Stack.Screen name="replycomment" component={ReplyComment}/>
      <Stack.Screen name="order" component={Order}/>
      <Stack.Screen name="MyShop" component={MyShop} options={{title: "Shop"}}/>
      <Stack.Screen name="ShopDetail" component={ShopDetail}/>
      <Stack.Screen name="paymentspaypal" component={PaymentsPaypal}/>
      <Stack.Screen name="shoppingcart" component={ShoppingCart}/>
      <Stack.Screen name="chat" component={Chat}/>
    </Stack.Navigator>
  )
}

// const ShopNavigate =()=>{
//   return(
//     <Stack.Navigator initialRouteName="myshop" screenOptions={{headerShown: false}}>
//         <Stack.Screen name="myshop" component={MyShop} />
//         <Stack.Screen name="shopdetail" component={ShopDetail} />
//         <Stack.Screen name="createproduct" component={CreateProduct}/>
//         <Stack.Screen name="productdetail" component={ProductDetail}/>
//         <Stack.Screen name="shopstats" component={ShopStats}/>
//         <Stack.Screen name="createshop" component={CreateShop}/>
//     </Stack.Navigator>
//   )
// }

const ProfileNavigate = () => {
  return (
    <Stack.Navigator initialRouteName='profile_main' screenOptions={{headerShown: false}}>
      <Stack.Screen name="profile_main" component={Profile} />
      <Stack.Screen name="historychat" component={HistoryChat} />
      <Stack.Screen name="historyorders" component={HistoryOrders}/>
      <Stack.Screen name="chat" component={Chat}/>
      <Stack.Screen name="stats" component={AdminShopStatsScreen}/>
      <Stack.Screen name="statdetail" component={ShopStat}/>
      <Stack.Screen name="unapprovedusers" component={ApproveUsersScreen}/>
      <Stack.Screen name="myshop" component={MyShop} />
      <Stack.Screen name="shopdetail" component={ShopDetail} />
      <Stack.Screen name="createproduct" component={CreateProduct}/>
      <Stack.Screen name="productdetail" component={ProductDetail}/>
      <Stack.Screen name="shopstats" component={ShopStats}/>
      <Stack.Screen name="createshop" component={CreateShop}/>
      <Stack.Screen name="updateprofile" component={UpdateProfile}/>
      
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const user = useContext(MyUserContext)

  return (
    <Tab.Navigator screenOptions={{headerShown: true}}>
      <Tab.Screen name='index' component={StackNavigate} options={{title: "EcomSale", tabBarIcon: () => <Icon size={30} source="home" />}}/>

      {user === null || user._j==null ? <>
        <Tab.Screen name="login" component={Login} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon source="account" size={20} /> }} />
        <Tab.Screen name="register" component={Register} options={{ title: "Đăng ký", tabBarIcon: () => <Icon source="account-plus" size={20} /> }} />
      </> : <>
        <Tab.Screen name="profile" component={ProfileNavigate} options={{title: "Tài khoản", tabBarIcon: () => <Icon source="account" size={20}/>}}/>
        {/* {user._j.is_shop_owner==true ?(<Tab.Screen name="MyShop" component={ShopNavigate} options={{ title: "Cửa hàng", tabBarIcon: () => <Icon source="account" size={20} /> }} />):(<></>)} */}
        
      </>}
    </Tab.Navigator>
  )
}


export default App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null)
  const [shop,shopdispatch]=useReducer(MyShopReducer,null)
  console.info(user)
  console.info(shop)

  return (
    <PaperProvider>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyShopContext.Provider value={shop}>
            <MyShopDispatchContext.Provider value={shopdispatch}>
              <NavigationContainer>

                <TabNavigator />

              </NavigationContainer>
            </MyShopDispatchContext.Provider>
          </MyShopContext.Provider>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});