import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { MyUserContext } from "../../configs/MyContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import Style from "../Home/Style";
import EcomSaleStyles from "../../styles/EcomSaleStyles";


const CreateShop=()=>{
    const [shop,setShop]=useState({})
    const [loading,setLoading]=useState(false)
    const user=useContext(MyUserContext)
    const [msg,setMsg]=useState(null)
    const navigation=useNavigation()

    const info=[{
        label:"Tên cửa hàng",
        field:"name",
        icon:"text"
    }]

    const handleInput=(field, value)=>{
        setShop({...shop,[field]:value})
    }

      
    const createshop= async()=>{
        const formdata=new FormData();
        formdata.append("name",shop.name)
        formdata.append("user",user._j.id)
        console.info(shop)
        console.info(user)

        try{
            setLoading(true)
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }
            console.info(formdata)
            console.info(token)
            let res=await authApis(token).post(endpoints['shops'],formdata,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            Alert.alert("tạo shop thành công")
            
        }catch(ex){
            console.info(ex)
        }finally{
            setLoading(false)
            navigation.navigate("myshop")
        }
    }

    return(
        <SafeAreaView>
      <View>
        <TouchableOpacity style={Style.returnButton} onPress={() => navigation.replace("myshop")}>
            <Ionicons name="return-down-back" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ padding: 12 }}>
        <HelperText type="error" visible={!!msg}>
          {msg}
        </HelperText>

        {info.map((i) => (
          <TextInput
            key={i.field}
            label={i.label}
            value={shop[i.field]}
            onChangeText={(text) => handleInput(i.field, text)}
            style={EcomSaleStyles.m}
            right={<TextInput.Icon icon={i.icon} />}
          />
        ))}

        <Button disabled={loading} loading={loading} mode="contained" buttonColor="#4CAF50" style={{ margin: 8 }} onPress={createshop}>Tạo cửa hàng</Button>
      </ScrollView>
    </SafeAreaView>
    )
}

export default CreateShop;