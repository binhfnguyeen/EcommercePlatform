import { useContext, useState } from "react"
import Apis, { authApis, endpoints } from "../../configs/Apis"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Button, HelperText, TextInput } from "react-native-paper"
import { MyUserContext } from "../../configs/MyContext"
import Style from "../Home/Style"


const CreateShop=()=>{
    const [shop,setShop]=useState()
    const [loading,setLoading]=useState(false)
    const user=useContext(MyUserContext)

    const info=[{
        label:"Tên cửa hàng",
        field:"name",
        icon:"text"
    }]

    const handleInput=(value, field)=>{
        setShop({...shop,[field]:value})
    }

      
    const createshop= async()=>{
        const formdata=new FormData();
        formdata.append("name",shop.name)
        formdata.append("user",user.id)

        try{
            setLoading(true)
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }
            let res=await authApis(token).post(endpoints['shops'],formdata,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            Alert.alert("tạo sản phẩm thành công")

        }catch(ex){
            console.info(ex)
        }finally{
            setLoading(false)
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