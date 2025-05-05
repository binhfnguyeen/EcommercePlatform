import { useContext, useReducer } from "react"
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import MyUserReducer from "../../reducers/MyUserReducer";
import { View,SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "react-native";

const Profile = () =>{
    const user=useContext(MyUserContext);
    const dispatch=useContext(MyDispatchContext);
    

    console.info(user)
    if (user?._j !== null)
        return(
        <SafeAreaView>
            <View>
                <Text>Xin chào {user._j.first_name} {user._j.last_name}</Text>
                <Button>Đăng xuất</Button>
            </View>
        </SafeAreaView>
        )

    return <Text>ĐÃ ĐĂNG XUẤT</Text>
}

export default Profile;