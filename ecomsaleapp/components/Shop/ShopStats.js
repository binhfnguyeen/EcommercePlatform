import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View,Text } from "react-native"
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { BarChart } from "react-native-gifted-charts";
import {Dimensions} from 'react-native';

const ShopStats=()=>{
    const [data,setData]=useState({});
    const [loading,setLoading]=useState(false)
    const windowWidth = Dimensions.get('window').width;

    const loadStat=async ()=>{  
        try{
            setLoading(true)
            let token=await AsyncStorage.getItem("token");
            let res=await authApis(token).get(endpoints['shop-stat'])
            setData(res.data)
        }catch(ex){
            console.info(ex)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        loadStat();
    },[])

    const DataOfProductStat = data.product_stats?.map((item) => ({
    value: item.total_revenue,
    label: item.name,
    })) || [];

    const DataOfCategoryStat = data.category_stats?.map((item) => ({
    value: item.total_revenue,
    label: item.name,
    })) || [];

    return(
        <View style={{margin:8, justifyContent:"center"}}>
            <Text style={{fontSize:20}}>Thống kê doanh thu từng sản phẩm</Text>
            <BarChart
            data={DataOfProductStat}
            barWidth={windowWidth/5}
            frontColor="#6a1b9a"
            barBorderRadius={4}
            yAxisTextStyle={{ color: '#333' }}
            xAxisLabelTextStyle={{ fontSize: 12, rotation: 45 }}
            />
            <Text style={{fontSize:20}}>Thống kê doanh thu từng danh mục </Text>
            <BarChart
            data={DataOfCategoryStat}
            barWidth={windowWidth/5}
            frontColor="#6a1b9a"
            barBorderRadius={4}
            yAxisTextStyle={{ color: '#333' }}
            xAxisLabelTextStyle={{ fontSize: 12, rotation: 45 }}
            />
        </View>
    )
}
export default ShopStats;