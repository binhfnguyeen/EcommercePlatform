import { Image, Text, View, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { SliderBox } from "react-native-image-slider-box";
import Style from "./Style";
import Apis, { endpoints } from "../../configs/Apis";
import ProductComment from "./ProductComment";
import StarRating from "../../utils/StarRating";
import { useNavigation } from "@react-navigation/native";

const ProductDetail = ({ route }) => {
    const productId = route.params?.productId;
    const [product, setProduct] = useState(null);
    const [imgUrls, setImgUrls] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [commentInProduct, setCommentInProduct] = useState([])
    const navigation = useNavigation();

    const loadProduct = async () => {
        let res = await Apis.get(endpoints['product'](productId));
        setProduct(res.data);
        setImgUrls(res.data.images?.map(img => img.image));
    };

    const loadFirstComment = async () => {
        let res = await Apis.get(`${endpoints['product-comments'](productId)}?page=1`);
        setCommentInProduct(res.data.results);
        console.info(res.data.results);
    }

    useEffect(() => {
        loadProduct();
        loadFirstComment();
    }, []);

    const onCurrentImagePressed = (index) => {
        setSelectedImage(imgUrls[index]);
        setModalVisible(true);
    };

    if (!product) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <ScrollView style={{ flex: 1 }}>
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
                            <Text style={Style.closeButtonText}>✕ Đóng</Text>
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
                <TouchableOpacity onPress={() => navigation.navigate("productcomment", {'productId': productId})}>
                    <Text style={{ color: "#2196F3", fontSize: 14 }}>Tất cả &gt;</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("productcomment", {'productId': productId})}>
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
        </ScrollView>
    );
};

export default ProductDetail;