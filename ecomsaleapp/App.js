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
import { MyUserContext } from './configs/MyContext';
import { MyDispatchContext } from './configs/MyContext';
import { NavigationContainer } from '@react-navigation/native';
import Profile from './components/User/Profile';
import { useReducer, useContext } from 'react';
import { Icon } from 'react-native-paper';
import MyShop from './components/Shop/MyShop';
import ShopDetail from './components/Shop/ShopDetail';
import ReplyComment from './components/Home/ReplyComment';
import Order from './components/Order/Order';
import PaymentsPaypal from './components/Order/PaymentsPaypal';
import ShoppingCart from './components/Cart/ShoppingCart';


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
    </Stack.Navigator>
  )
}

const ShopNavigate =()=>{
  return(
    <Stack.Navigator initialRouteName="myshop" screenOptions={{headerShown: false}}>
        <Stack.Screen name="myshop" component={MyShop} />
        <Stack.Screen name="shopdetail" component={ShopDetail} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const user = useContext(MyUserContext)

  return (
    <Tab.Navigator screenOptions={{headerShown: true}}>
      <Tab.Screen name='index' component={StackNavigate} options={{title: "EcomSale", tabBarIcon: () => <Icon size={30} source="home" />}}/>

      {user === null ? <>
        <Tab.Screen name="login" component={Login} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon source="account" size={20} /> }} />
        <Tab.Screen name="register" component={Register} options={{ title: "Đăng ký", tabBarIcon: () => <Icon source="account-plus" size={20} /> }} />
      </> : <>
        <Tab.Screen name="profile" component={Profile} options={{ title: "Tài khoản", tabBarIcon: () => <Icon source="account" size={20} /> }} />
        <Tab.Screen name="MyShop" component={ShopNavigate} options={{ title: "Cửa hàng", tabBarIcon: () => <Icon source="account" size={20} /> }} />
      </>}
    </Tab.Navigator>
  )
}


export default App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null)

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>

          <TabNavigator />

        </NavigationContainer>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
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