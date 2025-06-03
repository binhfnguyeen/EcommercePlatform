import { View, Text, FlatList, ActivityIndicator, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from "react-native";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StarRating from "../../utils/StarRating";
import StarRatingWidget from 'react-native-star-rating-widget';
import * as ImgPicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProductCommentStyles from "./ProductCommentStyles";

const ProductComment = ({ route }) => {
    const productId = route.params?.productId;
    const [commentInProduct, setCommentInProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [commentContent, setCommentContent] = useState("");
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setCommentInProduct([]);
            setPage(1);
        });

        return unsubscribe;
    }, [navigation]);

    const getCurrentUser = async () => {
        const token = await AsyncStorage.getItem("token");
        console.log(token)
        const res = await Apis.get(endpoints['current_user'], {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data
    }


    const loadCommentInProduct = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let res = await Apis.get(`${endpoints['product-comments'](productId)}?page=${page}`);
                setCommentInProduct(page === 1 ? res.data.results : prev => [...prev, ...res.data.results]);
                if (res.data.next === null)
                    setPage(0);
            } catch {
                console.info("Không thể load comment");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Không thể like!", "Bạn cần đăng nhập trước..", [
                    {
                        text: "OK"
                    }
                ]);
                return;
            }
            const headers = { Authorization: `Bearer ${token}` };
            const res = await Apis.post(endpoints["comment-like"](commentId),  {}, {headers})

            console.info(res.data);
            await loadCommentInProduct();

        } catch (err){
            if (err.response?.status === 400 || err.response?.status === 409) {
                Alert.alert("Thông báo", "Bạn đã like rồi!", [{ text: "OK" }]);
            } else {
                console.error("Lỗi khi like:", err);
                Alert.alert("Lỗi", "Không thể thực hiện like. Vui lòng thử lại sau.");
            }
        }
    }

    const pickImage = async () => {
        let { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permission denied!");
        } else {
            const r = await ImgPicker.launchImageLibraryAsync();
            if (!r.canceled)
                setImage(r.assets[0]);
        }
    }

    const uploadImgToCloudinary = async () => {
        let imgUrl = null;
        let path = null;
        if (image) {
            const formData = new FormData();
            formData.append("file", {
                uri: image.uri,
                type: "image/jpeg",
                name: "upload.jpg",
            });
            formData.append("upload_preset", "ecomsale");

            const response = await fetch("https://api.cloudinary.com/v1_1/dwivkhh8t/image/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
            }

            const resJson = await response.json();
            imgUrl = resJson.secure_url;
            path = imgUrl.substring(imgUrl.indexOf('image/upload'));
            console.info("Upload thành công:", path);
        }
        return path;
    }

    useEffect(() => {
        loadCommentInProduct();
    }, [page]);

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    };

    const submitComment = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const user = await getCurrentUser();
            console.info(`Lấy user để đăng bình luận ${user.id}`)
            if (!user) {
                alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
                return;
            }

            path = await uploadImgToCloudinary();

            const body = {
                user: user.id,
                star: parseInt(rating),
                content: commentContent,
                image: path ?? null,
                comment_parent: null
            };

            console.log("Body gửi lên:", body);

            await Apis.post(endpoints["product-comments"](productId), body, { headers });

            setCommentContent("");
            setRating(5);
            setImage(null);
            setPage(1);
            setCommentInProduct([]);
            await loadCommentInProduct();
        } catch (err) {
            console.error("Lỗi khi gửi bình luận: ", err);
        }
    }

    const renderCommentItem = ({ item: parent }) => (
        <View style={ProductCommentStyles.commentContainer}>
            <View style={ProductCommentStyles.commentHeader}>
                <Image source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${parent.user.avatar}` }} style={ProductCommentStyles.avatar} />
                <Text style={{ fontWeight: "bold" }}>{parent.user.first_name} {parent.user.last_name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                    <AntDesign name="heart" size={16} color="#FF3B30" />
                    <Text style={{ marginLeft: 4 }}>{parent.like_count}</Text>
                </View>
            </View>
            <StarRating star={parent.star} />
            <Text style={{ marginTop: 5 }}>{parent.content}</Text>
            {parent.image && (
                <Image
                    source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${parent.image}` }}
                    style={{ width: "50%", height: 100, resizeMode: "contain", marginTop: 5, borderRadius: 10 }}
                />
            )}
            <View style={{ flexDirection: "row", marginTop: 8, gap: 12 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("replycomment", { commentParentId: parent.id, productId })}
                    style={ProductCommentStyles.messageButton}
                >
                    <AntDesign name="message1" size={16} color="#2196F3" />
                    <Text style={{ marginLeft: 6, color: "#2196F3", fontWeight: "600" }}>Trả lời</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleLikeComment(parent.id)}
                    style={ProductCommentStyles.heartButton}
                >
                    <AntDesign name="heart" size={16} color="#FF3B30" />
                    <Text style={{ marginLeft: 6, color: "#FF3B30", fontWeight: "600" }}>Thích</Text>
                </TouchableOpacity>
            </View>
            {commentInProduct
                .filter(reply => reply.comment_parent === parent.id)
                .map(reply => (
                    <View key={`reply-${reply.id}`} style={ProductCommentStyles.replyContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${reply.user.avatar}` }} style={ProductCommentStyles.replyAvatar} />
                            <Text style={{ fontWeight: "bold" }}>{reply.user.first_name} {reply.user.last_name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                                <AntDesign name="heart" size={16} color="#FF3B30" />
                                <Text style={{ marginLeft: 4 }}>{reply.like_count}</Text>
                            </View>
                        </View>
                        <Text style={{ marginTop: 3 }}>{reply.content}</Text>
                        {reply.image && (
                            <Image
                                source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${reply.image}` }}
                                style={{ width: "100%", height: 200, resizeMode: "contain", marginTop: 5, borderRadius: 8 }}
                            />
                        )}
                    </View>
                ))}
        </View>
    );

    const renderCommentInput = () => (
        <KeyboardAvoidingView style={{ padding: 10, backgroundColor: "#f9f9f9", borderTopWidth: 1, borderColor: "#ddd" }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Đánh giá sản phẩm</Text>
            <StarRatingWidget rating={rating} onChange={setRating} starSize={28} minRating={1} enableHalfStar={false} />
            <TextInput
                value={commentContent}
                onChangeText={setCommentContent}
                placeholder="Nhập bình luận..."
                style={{
                    backgroundColor: "white",
                    padding: 10,
                    marginVertical: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#ccc"
                }}
                multiline />
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                <TouchableOpacity onPress={pickImage}
                    style={{ flex: 1, backgroundColor: "#e0e0e0", padding: 12, alignItems: "center", borderRadius: 8 }}>
                    <Text style={{ color: "#333", fontWeight: "bold" }}>{image ? "Đổi Hình" : "Chọn Hình"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={submitComment}
                    style={{ flex: 1, backgroundColor: "#2196F3", padding: 12, alignItems: "center", borderRadius: 8 }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Gửi bình luận</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    );

    return (
        <View style={{ flex: 1 }}>
            {renderCommentInput()}
            <FlatList
                data={commentInProduct.filter(cmt => cmt.comment_parent === null)}
                keyExtractor={(item) => `comment-${item.id}`}
                renderItem={renderCommentItem}
                onEndReached={loadMore}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#2196F3" /> : null}
                ListEmptyComponent={!loading && <Text>Chưa có bình luận nào.</Text>}
            />
        </View>
    );
};

export default ProductComment;