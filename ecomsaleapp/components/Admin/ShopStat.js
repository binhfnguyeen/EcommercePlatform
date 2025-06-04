import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { LineChart } from "react-native-gifted-charts";
import { Button, Menu } from "react-native-paper";
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
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

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

  const loadStat = async (selectedMonth = null, selectedQuarter = null) => {
    let url = `${endpoints['admin-stat']}?shop_id=${shopId}`;
    if (selectedMonth) url += `&month=${selectedMonth}`;
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
    loadStat(month, quarter);
  }, [month, quarter]);

  const handleQuarterChange = (q) => {
    setQuarter(q);
    setMonth(null);
  };

  const handleMonthChange = (m) => {
    setMonth(m);
    setQuarter(null);
    setMenuVisible(false);
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

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>
        📊 Thống kê theo quý:
      </Text>
      <QuarterBar onQuarterPress={handleQuarterChange} />

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
              onPress={() => handleMonthChange(m)}
              title={`Tháng ${m}`}
            />
          ))}
        </Menu>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 8 }}>
        📈 Doanh thu theo tháng
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

    </ScrollView>
  );
};

export default ShopStats;
