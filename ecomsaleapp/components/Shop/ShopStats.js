// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect, useState } from "react";
// import { View,Text } from "react-native"
// import Apis, { authApis, endpoints } from "../../configs/Apis";
// import { BarChart } from "react-native-gifted-charts";
// import {Dimensions,FlatList,TouchableOpacity} from 'react-native';
// import { Button,Menu } from "react-native-paper";
// import EcomSaleStyles from "../../styles/EcomSaleStyles";
// import Ionicons from "react-native-vector-icons/Ionicons"
// import Style from "../Home/Style";

// const ShopStats=()=>{
//     const [data,setData]=useState({});
//     const [loading,setLoading]=useState(false)
//     const windowWidth = Dimensions.get('window').width;
//     const [month,setMonth]=useState()
//     const [quarter,setQuarter]=useState()
//     const [menuVisible, setMenuVisible] = useState(false);
//     const [value,setValue]=useState()
//     const months = [1,2,3,4,5,6,7,8,9,10,11,12];
//     const quarters = [1,2,3,4];

//     const QuarterBar = ({ onQuarterPress }) => {
//         const [selected, setSelected] = useState('All');

//         const handlePress = (quarter) => {
//             setSelected(quarter);
//             onQuarterPress && onQuarterPress(quarter);
//             console.info(quarter)
//         };
//         return( 
//             <FlatList
//                 data={quarters}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={EcomSaleStyles.container}
//                 keyExtractor={(item) => item}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity onPress={() => handlePress(item)} style={[EcomSaleStyles.button, selected === item && EcomSaleStyles.selectedButton]}>
//                     <Text style={[EcomSaleStyles.text, selected === item && EcomSaleStyles.selectedText]}>{item}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//         );
//     };

//     const loadStat=async (month="",quarter="")=>{  
//         let url=`${endpoints['shop-stat']}`;
//         if (month) url += `?month=${month}`;
//         if (quarter) url +=`?quarter=${quarter}`;
//         try{
//             setLoading(true)
//             let token=await AsyncStorage.getItem("token");
//             let res=await authApis(token).get(url)
//             setData(res.data)
//         }catch(ex){
//             console.info(ex)
//         }finally{
//             setLoading(false);
//         }
//     }
 


//     useEffect(()=>{
//         loadStat(month,quarter);
//     },[month,quarter])

//     const DataOfProductStat = data.product_stats?.map((item) => ({
//     value: item.total_revenue,
//     label: item.name,
//     })) || [];

//     const DataOfCategoryStat = data.category_stats?.map((item) => ({
//     value: item.total_revenue,
//     label: item.name,
//     })) || [];

//     const handleQuarterChange = (quarter) => {
//         setQuarter(quarter)
//         setMonth(null)
//     };
//     return(
//         <View style={{margin:8, justifyContent:"center"}}>
            
//             <View>
//                 <TouchableOpacity style={HomeStyles.returnButton} onPress={() => navigation.replace("shopdetail")}>
//                     <Ionicons name="return-down-back" size={24} color="#2196F3" />
//                 </TouchableOpacity>
//             </View>
//             <Text style={{fontSize:20,backgroundColor:"#2196F3"}}>Thống kê theo quý:</Text>
//             <QuarterBar onQuarterPress={handleQuarterChange} />
//             <Text style={{fontSize:20,backgroundColor:"#2196F3"}}>Thống kê theo tháng:</Text>
//             <View style={{ margin: 8 }}>
//                 <Menu
//                     visible={menuVisible}
//                     onDismiss={() => setMenuVisible(false)}
//                     anchor={
//                     <Button
//                         mode="outlined"
//                         onPress={() => setMenuVisible(true)}
//                         style={{ justifyContent: 'flex-start' }}
//                     >
//                         {month?month : "Chọn tháng"}
//                     </Button>
//                     }
//                 >
//                     {months.map((m) => (
//                     <Menu.Item
//                         key={m}
//                         onPress={() => {
//                         setMonth(m);
//                         setQuarter(null)
//                         setMenuVisible(false);
//                         }}
//                         title={m}
//                     />
//                     ))}
//                 </Menu>
//             </View>
//             <Text style={{fontSize:20}}>Thống kê doanh thu từng sản phẩm</Text>
//             <BarChart
//             data={DataOfProductStat}
//             barWidth={windowWidth/5}
//             frontColor="#6a1b9a"
//             barBorderRadius={4}
//             yAxisTextStyle={{ color: '#333' }}
//             xAxisLabelTextStyle={{ fontSize: 12, rotation: 45 }}
//             />
//             <Text style={{fontSize:20}}>Thống kê doanh thu từng danh mục </Text>
//             <BarChart
//             data={DataOfCategoryStat}
//             barWidth={windowWidth/5}
//             frontColor="#6a1b9a"
//             barBorderRadius={4}
//             yAxisTextStyle={{ color: '#333' }}
//             xAxisLabelTextStyle={{ fontSize: 12, rotation: 45 }}
//             />
//         </View>
//     )
// }
// export default ShopStats;


import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { BarChart } from "react-native-gifted-charts";
import { Button, Menu } from "react-native-paper";
import EcomSaleStyles from "../../styles/EcomSaleStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeStyles from "../Home/HomeStyles";
import { useNavigation } from "@react-navigation/native";

const ShopStats = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const [month, setMonth] = useState();
  const [quarter, setQuarter] = useState();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation=useNavigation()

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const quarters = [1, 2, 3, 4];

  const QuarterBar = ({ onQuarterPress }) => {
    const [selected, setSelected] = useState('All');

    const handlePress = (quarter) => {
      setSelected(quarter);
      onQuarterPress && onQuarterPress(quarter);
    };

    return (
      <FlatList
        data={quarters}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={[
              EcomSaleStyles.button,
              selected === item && EcomSaleStyles.selectedButton,
              { marginHorizontal: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 }
            ]}
          >
            <Text
              style={[
                EcomSaleStyles.text,
                selected === item && EcomSaleStyles.selectedText,
                { fontSize: 16 }
              ]}
            >
              Quý {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const loadStat = async (month = "", quarter = "") => {
    let url = `${endpoints['shop-stat']}`;
    if (month) url += `?month=${month}`;
    if (quarter) url += `?quarter=${quarter}`;

    try {
      setLoading(true);
      let token = await AsyncStorage.getItem("token");
      let res = await authApis(token).get(url);
      setData(res.data);
    } catch (ex) {
      console.info(ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStat(month, quarter);
  }, [month, quarter]);

  const DataOfProductStat = data.product_stats?.map((item) => ({
    value: item.total_revenue,
    label: item.name,
  })) || [];

  const DataOfCategoryStat = data.category_stats?.map((item) => ({
    value: item.total_revenue,
    label: item.name,
  })) || [];

  const handleQuarterChange = (quarter) => {
    setQuarter(quarter);
    setMonth(null);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: "#f4f6f8" }}>
      {/* Quay lại */}
      <TouchableOpacity style={HomeStyles.returnButton} onPress={() => navigation.replace("shopdetail")}>
        <Ionicons name="arrow-back" size={28} color="#2196F3" />
      </TouchableOpacity>

      {/* Chọn Quý */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>
        📊 Thống kê theo quý:
      </Text>
      <QuarterBar onQuarterPress={handleQuarterChange} />

      {/* Chọn Tháng */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        🗓️ Thống kê theo tháng:
      </Text>
      <View style={{ marginVertical: 8 }}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={{ borderRadius: 20, borderColor: '#2196F3' }}
              textColor="#2196F3"
            >
              {month ? `Tháng ${month}` : "Chọn tháng"}
            </Button>
          }
        >
          {months.map((m) => (
            <Menu.Item
              key={m}
              onPress={() => {
                setMonth(m);
                setQuarter(null);
                setMenuVisible(false);
              }}
              title={`Tháng ${m}`}
            />
          ))}
        </Menu>
      </View>

      {/* Biểu đồ theo sản phẩm */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 8 }}>
        🛍️ Doanh thu theo sản phẩm
      </Text>
      <BarChart
        data={DataOfProductStat}
        barWidth={windowWidth / 5}
        frontColor="#4CAF50"
        barBorderRadius={6}
        yAxisTextStyle={{ color: '#333' }}
        xAxisLabelTextStyle={{ fontSize: 12, rotation: 45 }}
      />

      {/* Biểu đồ theo danh mục */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 24, marginBottom: 8 }}>
        📂 Doanh thu theo danh mục
      </Text>
      <BarChart
        data={DataOfCategoryStat}
        barWidth={windowWidth / 5}
        frontColor="#FF9800"
        barBorderRadius={6}
        yAxisTextStyle={{ color: '#333' }}
        xAxisLabelTextStyle={{ fontSize: 12, rotation: 45 }}
      />
    </ScrollView>
  );
};

export default ShopStats;
