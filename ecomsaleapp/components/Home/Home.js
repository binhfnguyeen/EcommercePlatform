import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";
import Style from "./Style";


const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadProducts = async () => {
        if (page > 0){
            let url = `${endpoints['products']}?page=${page}`;

            try {
                setLoading(true);
                let res = await Apis.get(url);
                setProducts([...products, ...res.data.results]);

                if (!res.data.next){
                    setHasMore(false);
                }
            } catch {
                console.log("Không lấy được danh sách sản phẩm");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadProducts();
    }, [page]);


    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const renderItem = ({ item }) => {
        const imageUrl = item.images[0]?.image;

        return (
            <View style={Style.card}>
                <Image
                    source={{ uri: imageUrl }}
                    style={Style.image}
                    resizeMode="cover"
                />
                <View style={Style.cardContent}>
                    <Text style={Style.productName}>{item.name}</Text>
                    <Text style={Style.price}>{item.price.toLocaleString()} VNĐ</Text>
                    <Text style={Style.subText}>Danh mục: {item.category.name}</Text>
                    <Text style={Style.subText}>Cửa hàng: {item.shop.name}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={Style.container}>
            <FlatList
                onEndReached={loadMore}
                ListFooterComponent={loading && <ActivityIndicator />}
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={Style.flatListContent}
                columnWrapperStyle={Style.columnWrapper}
            />
        </SafeAreaView>
    );
};

export default Home;