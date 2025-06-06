import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { LineChart } from "react-native-gifted-charts";
import { ActivityIndicator, Button, Menu } from "react-native-paper";
import EcomSaleStyles from "../../styles/EcomSaleStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeStyles from "../Home/HomeStyles";
import { useNavigation } from "@react-navigation/native";

const ShopStats = ({ route }) => {
  const shopId = route.params?.shopId;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const [month, setMonth] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const navigation = useNavigation();

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

  const loadStat = async ( selectedQuarter = null) => {
    let url = `${endpoints['admin-stat']}?shop_id=${shopId}`;
    
    if (selectedQuarter) url += `&quarter=${selectedQuarter}`;

    try {
      setLoading(true);
      let token = await AsyncStorage.getItem("token");
      let res = await authApis(token).get(url);
      setData(res.data);
    } catch (ex) {
      console.error("API Error:", ex);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("Dữ liệu cập nhật:", data);
  }, [data]);

  useEffect(() => {
    loadStat( quarter);
  }, [quarter]);

  const handleQuarterChange = (q) => {
    setQuarter(q);
  };

  const handleMonthChange = () => {
    setQuarter(null);
  };


  const monthlyStats = data.monthly_stats?.map(item => ({
    value: item.total_revenue,
    dataPointText: item.total_revenue.toString(),
    label: `T${item.month}`
  })) || [];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: "#f4f6f8" }}>
      <TouchableOpacity style={HomeStyles.returnButton} onPress={() => navigation.replace("stats")}>
        <Ionicons name="arrow-back" size={28} color="#2196F3" />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
        <Ionicons name="bar-chart-outline" size={20} color="#2196F3" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Thống kê theo quý
        </Text>
      </View>
      <QuarterBar onQuarterPress={handleQuarterChange} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
        <Ionicons name="calendar-outline" size={20} color="#2196F3" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Thống kê theo tháng:
        </Text>
      </View>
      <View style={{ marginVertical: 8 }}>
            <Button
              mode="outlined"
              onPress={() => handleMonthChange()}
              style={{ borderRadius: 20, borderColor: '#2196F3' }}
              textColor="#2196F3"
            >
              Tháng
            </Button>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 8 }}>
         Doanh thu theo tháng
      </Text>
      {monthlyStats.length > 0 ? (
        <LineChart
          data={monthlyStats}
          width={windowWidth - 32}
          height={220}
          hideDataPoints={false}
          color="#4CAF50"
          thickness={3}
          areaChart
          curved
          startFillColor="rgba(76, 175, 80, 0.3)"
          endFillColor="rgba(255, 255, 255, 0)"
          yAxisTextStyle={{ color: '#333' }}
          xAxisLabelTextStyle={{ fontSize: 12, color: '#333' }}
          dataPointsColor="#388E3C"
          isAnimated
          animationDuration={800}
          initialSpacing={10}
          spacing={30}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 16, color: '#888' }}>
          Không có dữ liệu để hiển thị
        </Text>
      )}
      {loading && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 8, color: "#fff", fontSize: 16 }}>Đang tải dữ liệu...</Text>
        </View>
      )}
      {loading && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 8, color: "#fff", fontSize: 16 }}>Đang tải dữ liệu...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ShopStats;
