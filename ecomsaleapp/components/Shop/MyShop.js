// import { useContext, useEffect, useState } from "react"
// import { MyUserContext } from "../../configs/MyContext"
// import Apis, { authApis,endpoints } from "../../configs/Apis"
// import { View } from "react-native"
// import AsyncStorage from "@react-native-async-storage/async-storage"


// const MyShop = ()=>{
//     const user =useContext(MyUserContext)
//     const [shop,setShop]=useState([])
//     const[loading,setLoading]=useState(false)

//     const loadShop= async () =>{
//         try{
//             setLoading(true)
//             console.info(user.access_token)
//             console.info(user)
//             let token= await AsyncStorage.getItem('token')
//             console.info(token)
//             let res=await authApis(token).get(endpoints['shops'])
//             setShop([...shop,...res.data.results])
//         }catch(ex){
//             console.info(ex)
//         }finally{
//             setLoading(false)
//         }
       
//     }

//     useEffect(()=>{
//         let timer=setTimeout(()=>{loadShop();
//         },500);
//         console.info(shop)
//         return () => clearTimeout(timer);
//     },[])


//     return(

//         <View>
//             {shop.map(s=><Text>{s.name}</Text>)}
//         </View>
//     )
    
// }
// export default MyShop;

import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/MyContext";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyShop = () => {
    const user = useContext(MyUserContext);
    const [shop, setShop] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadShop = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }

            const res = await authApis(token).get(endpoints['my-shop']);
            console.info(res.data)
            setShop( [...shop, ...res.data]);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShop();
    }, []);

    return (
        <View>
            {shop.map(s => <Text key={s.id}>{s.name}</Text>)}
        </View>
    );
};

export default MyShop;
