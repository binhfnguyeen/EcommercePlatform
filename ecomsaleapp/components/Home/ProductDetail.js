import { Image, Text, View, Modal, TouchableOpacity, ActivityIndicator, ScrollView, Alert, FlatList } from "react-native";
import { useContext, useEffect, useState } from "react";
import { SliderBox } from "react-native-image-slider-box";
import Apis, { endpoints } from "../../configs/Apis";
import StarRating from "../../utils/StarRating";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductDetailStyles from "./ProductDetailStyles";
<<<<<<< Updated upstream
import * as Animatable from 'react-native-animatable';
=======
import { MyShopContext } from "../../configs/MyContext";

>>>>>>> Stashed changes

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
    const [shop, setShop] = useState({});
    const [productsCompare, setProductsCompare] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const shopuser=useContext(MyShopContext)
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
        try {
            let res = await Apis.get(`${endpoints['product-comments'](productId)}?page=1`);
            setCommentInProduct(res.data.results);
            console.info(res.data.results);
        } catch (err) {
            console.error("Lỗi khi tải bình luận:", err);
        } finally {
            setLoading(false);
        }
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
            const headers = { Authorization: `Bearer ${token}`};
            if (!token) {
                Alert.alert("Thông báo", "Bạn cần đăng nhập trước để thêm sản phẩm vào giỏ!", [{text: "OK"}]);
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
            <View style={ProductDetailStyles.barHeader}>
                <TouchableOpacity style={ProductDetailStyles.returnButton} onPress={() => navigation.replace("home")}>
                    <Ionicons name="return-down-back" size={24} color="#2196F3" />
                </TouchableOpacity>

                <TouchableOpacity style={ProductDetailStyles.searchContainer}>

                    <Searchbar
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                        inputStyle={ProductDetailStyles.searchBarInput}
                        style={{ backgroundColor: 'transparent', elevation: 0, width: "100%" }}
                    />

                </TouchableOpacity>

                <TouchableOpacity style={ProductDetailStyles.viewCart} onPress={() => navigation.replace("shoppingcart", { productId: productId })}>
                    <AntDesign name="shoppingcart" size={24} color="#2196F3" />
                    <View style={ProductDetailStyles.cartBadge}>
                        <Text style={ProductDetailStyles.badgeText}>{countProduct.toString()}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {searchResults.length > 0 ? (
                <Animatable.View animation="slideInDown" duration={600}>
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
                </Animatable.View>
            ) : (<>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 55, paddingTop: 55 }}>
                    <View style={ProductDetailStyles.headerContainer}>
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
                            paginationBoxStyle={ProductDetailStyles.imgSliderPaginationBoxStyle}
                            dotStyle={ProductDetailStyles.imgSliderDotStyle}
                            ImageComponentStyle={ProductDetailStyles.imgComponentStyle}
                            imageLoadingColor="#2196F3"
                        />

                        <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
                            <View style={ProductDetailStyles.modalContainer}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={ProductDetailStyles.closeButton}>
                                    <Text style={ProductDetailStyles.closeButtonText}><AntDesign name="close" size={24} color="#fff" /> Đóng</Text>
                                </TouchableOpacity>
                                {selectedImage && <Image source={{ uri: selectedImage }} style={ProductDetailStyles.modalImage} />}
                            </View>
                        </Modal>

                        <View style={ProductDetailStyles.productInfoContainer}>
                            <Text style={ProductDetailStyles.productNameLarge}>{product.name}</Text>
                            <Text style={ProductDetailStyles.productPrice}>{product.price.toLocaleString()} VND</Text>
                        </View>
                    </View>

                    <View style={ProductDetailStyles.evaluateInlineSeeAll}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Đánh giá sản phẩm</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("productcomment", { 'productId': productId })}>
                            <Text style={{ color: "#2196F3", fontSize: 14 }}>Tất cả &gt;</Text>
                        </TouchableOpacity>
                    </View>
                        <TouchableOpacity onPress={() => navigation.navigate("productcomment", { 'productId': productId })}>
                            {loading ? (
                                <View style={{ padding: 5, paddingTop: 5, alignItems: "center" }}>
                                    <Text>Đang tải bình luận <ActivityIndicator size="small" color="#0000ff" /></Text>
                                </View>
                            ) : commentInProduct.length > 0 ? (
                                <View style={ProductDetailStyles.commentContainer}>
                                    <View style={ProductDetailStyles.commentHeader}>
                                        <Image
                                            source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${commentInProduct[0].user.avatar}` }}
                                            style={ProductDetailStyles.avatar}
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
                            ) : (
                                <View style={{ padding: 16, paddingTop: 50, alignItems: "center" }}>
                                    <Text>Không có bình luận</Text>
                                </View>
                            )}
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={ProductDetailStyles.shopContainer}>
                            <AntDesign name="isv" size={20} color="#333" style={{ marginRight: 10 }} />
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

                <View style={ProductDetailStyles.barFooter}>
                    {shop && shopuser && shop.id !== shopuser._j?.id && (
                    <TouchableOpacity style={ProductDetailStyles.chat} onPress={() => {
                        navigation.navigate("chat", { shop });
                        console.log("SHOP to send:", shop);
                    }}>
                        <AntDesign name="message1" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    )}
                    

                    <TouchableOpacity style={ProductDetailStyles.addCart} onPress={addToCart}>
                        <FontAwesome name="cart-plus" size={24} color="#2196F3" />
                    </TouchableOpacity>

                    <TouchableOpacity style={ProductDetailStyles.buyNowButton} onPress={() => navigation.navigate("order", { 'productId': productId })}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Mua ngay</Text>
                    </TouchableOpacity>
                </View>
            </>)}
        </View>
    );
};

export default ProductDetail;