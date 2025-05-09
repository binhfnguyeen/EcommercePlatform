import { useEffect, useRef, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Style from "../Home/Style";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ShopDetail = ({route})=>{
    const shopId = route.params?.shopId;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [name, setName] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigation();
    const typingTimeout = useRef(null);

    const loadProducts = async ( reset = false) => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    const url = `${endpoints["shop-detail"](shopId)}`;
    console.info(token)

    try {
        setLoading(true);
        const res = await authApis(token).get(url);
        const newProducts = res.data.results;
        const merged = reset ? newProducts : [...products, ...newProducts];
        const unique = Array.from(new Map(merged.map((p) => [p.id, p])).values());
        setProducts(unique);
        setHasMore(res.data.next !== null);
    } catch (ex) {
        console.log(ex);
    } finally {
        setLoading(false);
    }
  };

  // Load products once when component mounts
    useEffect(() => {
    loadProducts(1, true);
  }, []);

  // Load more when page increases
  useEffect(() => {
    if (page === 1) return;
    if (!loading && hasMore) loadProducts(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.images[0]?.image;

    return (
      <TouchableOpacity
        style={Style.card}
        onPress={() => navigation.navigate("productdetail", { productId: item.id })}
      >
        <Image source={{ uri: imageUrl }} style={Style.image} resizeMode="cover" />
        <View style={Style.cardContent}>
          <Text style={Style.productName}>{item.name}</Text>
          <Text style={Style.price}>{item.price.toLocaleString()} VNĐ</Text>
          <Text style={Style.subText}>Danh mục: {item.category.name}</Text>
          <Text style={Style.subText}>Cửa hàng: {item.shop.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={Style.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        onEndReached={loadMore}
        ListFooterComponent={loading && <ActivityIndicator />}
        contentContainerStyle={Style.flatListContent}
        columnWrapperStyle={Style.columnWrapper}
      />
    </SafeAreaView>
  );
};

export default ShopDetail;