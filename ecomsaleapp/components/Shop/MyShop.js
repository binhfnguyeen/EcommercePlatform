import { useContext, useState } from "react"
import { MyUserContext } from "../../configs/MyContext"
import Apis, { authApis,endpoints } from "../../configs/Apis"
import { View } from "react-native"

const MyShop = ()=>{
    const user =useContext(MyUserContext)
    const [shop,setShop]=useState({})
    const[loading,setLoading]=useState(false)

    const loadShop= async ()=>{
        try{
            setLoading(true)
            let res=await Apis.get(endpoints['shops'])
            setShop(...shop,... res.data.result)
        }catch(ex){
            console.info("khong co cua hang nao")
        }finally{
            setLoading(false)
        }
       
    }

    return(
        <View>
            <Text>{shop.name}</Text>
        </View>
    )
    
}
export default MyShop;