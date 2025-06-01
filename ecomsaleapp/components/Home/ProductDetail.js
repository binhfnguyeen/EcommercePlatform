import { Image, Text, View, Modal, TouchableOpacity, ActivityIndicator, ScrollView, Alert, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { SliderBox } from "react-native-image-slider-box";
import Style from "./Style";
import Apis, { endpoints } from "../../configs/Apis";
import ProductComment from "./ProductComment";
import StarRating from "../../utils/StarRating";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetail = ({ route }) => {
    const productId = route.params?.productId;
    const [product, setProduct] = useState(null);
    const [imgUrls, setImgUrls] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [commentInProduct, setCommentInProduct] = useState([]);
    const [myCart, setMyCart] = useState([]);
    const [countProduct, setCountProduct] = useState(0);
    const navigation = useNavigation();
    const [shop, setShop] = useState({})
    const [productsCompare, setProductsCompare] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loadProduct = async () => {
        try {
            const res = await Apis.get(endpoints['product'](productId));
            setProduct(res.data);
            setImgUrls(res.data.images?.map(img => img.image));
            setShop(res.data.shop);
        } catch (err) {
            console.error(err);
        }
    };

    const loadFirstComment = async () => {
        let res = await Apis.get(`${endpoints['product-comments'](productId)}?page=1`);
        setCommentInProduct(res.data.results);
        console.info(res.data.results);
    };

    const loadMyCart = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            if (token) {
                const res = await Apis.get(endpoints["my-cart"], { headers });
                const cart = res.data;
                setMyCart(cart);
                console.log(cart);

                const totalCount = cart.details.reduce((sum, item) => sum + item.quantity, 0);
                setCountProduct(totalCount);
            } else {
                setMyCart(null);
                setCountProduct(0);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const loadProductsCompare = async (productId) => {
        try {
            const res = await Apis.get(endpoints['product-compare'](productId));

            setProductsCompare(res.data)
            console.log("Danh sách sản phẩm so sánh: ", res.data)
        } catch (err) {
            console.error(err);
        }
    }

    const addToCart = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            if (!token) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập trước.");
                return;
            }
            const body = {
                "product_id": productId,
                "quantity": 1
            }

            const res = await Apis.post(endpoints["add-cart"], body, { headers });
            console.info("Thêm thành công sản phẩm vào giỏ: ", res.data);
            loadMyCart();
        } catch (err) {
            console.error(err);
        }
    }

    const handleSearch = async (textFind, pageToLoad = 1) => {
        if (!hasMore && pageToLoad !== 1) return;

        if (pageToLoad === 1) {
            setSearchQuery(textFind);
        }

        if (textFind.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            let url = `${endpoints['products']}?page=${pageToLoad}&name=${textFind}`;
            const res = await Apis.get(url);
            
            if (pageToLoad === 1) {
                setSearchResults(res.data.results);
            } else {
                setSearchResults(prev => [...prev, ...res.data.results]);
            }

            console.log("Danh sách sản phẩm: ", res.data.results);

            setHasMore(res.data.next !== null);
            setCurrentPage(pageToLoad);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (productId) {
            loadProduct();
            loadFirstComment();
            loadMyCart();
        } else {
            Alert.alert("Lỗi", "Không xác định được sản phẩm");
            navigation.goBack();
        }
    }, []);

    useEffect(() => {
        if (product) {
            console.log(product.shop);
        }
    }, [product]);

    useEffect(() => {
        loadProductsCompare(productId);
    }, [productId]);

    const onCurrentImagePressed = (index) => {
        setSelectedImage(imgUrls[index]);
        setModalVisible(true);
    };

    useEffect(()=>{
        const delayChangeText = setTimeout(()=>{
            handleSearch(searchQuery, 1);
        }, 500)
        return ()=>clearTimeout(delayChangeText); 
    }, [searchQuery]);

    if (!product) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={{ flex: 1 }}>
            <View style={Style.barHeader}>
                <TouchableOpacity style={Style.returnButton} onPress={() => navigation.replace("home")}>
                    <Ionicons name="return-down-back" size={24} color="#2196F3" />
                </TouchableOpacity>

                <TouchableOpacity style={Style.searchContainer}>

                    <Searchbar
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        inputStyle={Style.searchBarInput}
                        style={{ backgroundColor: 'transparent', elevation: 0, width: "100%" }}
                    />

                </TouchableOpacity>

                <TouchableOpacity style={Style.viewCart} onPress={() => navigation.replace("shoppingcart", { productId: productId })}>
                    <AntDesign name="shoppingcart" size={24} color="#2196F3" />
                    <View style={Style.cartBadge}>
                        <Text style={Style.badgeText}>{countProduct.toString()}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 30, paddingTop: 60, paddingHorizontal: 10 }}
                    ListHeaderComponent={() => (
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Kết quả tìm kiếm</Text>
                    )}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.replace("productdetail", { productId: item.id })}>
                            <View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center' }}>
                                <Image
                                    source={{ uri: item.images[0].image }}
                                    style={{ width: 40, height: 40, borderRadius: 10, marginRight: 10 }}
                                />
                                <View>
                                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                    <Text>{item.price.toLocaleString()} VND</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    onEndReached={() => {
                        if (hasMore) 
                            handleSearch(searchQuery, currentPage + 1);
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => hasMore ? <ActivityIndicator size="small" color="#2196F3" /> : null}
                />
            ) : (<>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 55, paddingTop: 55 }}>
                    <View style={Style.headerContainer}>
                        <SliderBox
                            images={imgUrls}
                            sliderBoxHeight={300}
                            onCurrentImagePressed={onCurrentImagePressed}
                            dotColor="#FFEE58"
                            inactiveDotColor="#90A4AE"
                            paginationBoxVerticalPadding={20}
                            circleLoop
                            resizeMethod={'resize'}
                            resizeMode={'cover'}
                            paginationBoxStyle={Style.imgSliderPaginationBoxStyle}
                            dotStyle={Style.imgSliderDotStyle}
                            ImageComponentStyle={Style.imgComponentStyle}
                            imageLoadingColor="#2196F3"
                        />

                        <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
                            <View style={Style.modalContainer}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={Style.closeButton}>
                                    <Text style={Style.closeButtonText}><AntDesign name="close" size={24} color="#fff" /> Đóng</Text>
                                </TouchableOpacity>
                                {selectedImage && <Image source={{ uri: selectedImage }} style={Style.modalImage} />}
                            </View>
                        </Modal>

                        <View style={Style.productInfoContainer}>
                            <Text style={Style.productNameLarge}>{product.name}</Text>
                            <Text style={Style.productPrice}>{product.price.toLocaleString()} VND</Text>
                        </View>
                    </View>

                    <View style={Style.evaluateInlineSeeAll}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Đánh giá sản phẩm</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("productcomment", { 'productId': productId })}>
                            <Text style={{ color: "#2196F3", fontSize: 14 }}>Tất cả &gt;</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("productcomment", { 'productId': productId })}>
                        {commentInProduct.length > 0 && (
                            <View style={Style.commentContainer}>
                                <View style={Style.commentHeader}>
                                    <Image
                                        source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${commentInProduct[0].user.avatar}` }}
                                        style={Style.avatar}
                                    />
                                    <Text style={{ fontWeight: "bold" }}>
                                        {commentInProduct[0].user.first_name} {commentInProduct[0].user.last_name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                                        <AntDesign name="heart" size={16} color="#FF3B30" />
                                        <Text style={{ marginLeft: 4 }}>{commentInProduct[0].like_count}</Text>
                                    </View>
                                </View>
                                <StarRating star={commentInProduct[0].star} />
                                <Text style={{ marginTop: 5 }}>{commentInProduct[0].content}</Text>
                                {commentInProduct[0].image && (
                                    <Image
                                        source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${commentInProduct[0].image}` }}
                                        style={{
                                            width: "50%",
                                            height: 100,
                                            resizeMode: "contain",
                                            marginTop: 5,
                                            borderRadius: 10
                                        }}
                                    />
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={[Style.shopContainer, { flexDirection: "row", alignItems: "center" }]}>
                            <AntDesign name="isv" size={20} color="#333" style={{ marginRight: 5 }} />
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{product.shop.name}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Sản phẩm tương tự</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {productsCompare.map((item) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => navigation.replace("productdetail", { productId: item.id })}
                                >
                                    <View style={{ marginRight: 15, width: 150 }}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ width: "100%", height: 120, borderRadius: 10 }}
                                            resizeMode="cover"
                                        />
                                        <Text numberOfLines={1} style={{ fontWeight: "bold", marginTop: 5 }}>{item.name}</Text>
                                        <Text style={{ color: "#555" }}>{item.price.toLocaleString()} VND</Text>
                                        <Text style={{ fontSize: 12, color: "#999" }}>{item.shop}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                            <AntDesign name="star" size={14} color="#FFD700" />
                                            <Text style={{ marginLeft: 4 }}>{item.avg_star?.toFixed(1) || '0.0'}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <AntDesign name="message1" size={14} color="#555" />
                                            <Text style={{ marginLeft: 4 }}>{item.total_comments || 0} bình luận</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>

                <View style={Style.barFooter}>
                    <TouchableOpacity style={Style.chat} onPress={() => {
                        navigation.navigate("chat", { 'shop': shop })
                        console.log("SHOP to send:", shop);
                    }}>
                        <AntDesign name="message1" size={24} color="#2196F3" />
                    </TouchableOpacity>

                    <TouchableOpacity style={Style.addCart} onPress={addToCart}>
                        <FontAwesome name="cart-plus" size={24} color="#2196F3" />
                    </TouchableOpacity>

                    <TouchableOpacity style={Style.buyNowButton} onPress={() => navigation.navigate("order", { 'productId': productId })}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Mua ngay</Text>
                    </TouchableOpacity>
                </View>
            </>)}
        </View>
    );
};

export default ProductDetail;