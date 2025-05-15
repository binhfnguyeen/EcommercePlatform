import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImgPicker from 'expo-image-picker';
import Apis, { endpoints } from "../../configs/Apis";
import Style from "./Style";
import StarRating from "../../utils/StarRating";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReplyComment = ({ route }) => {
    const commentParentId = route.params?.commentParentId;
    const productId = route.params?.productId;
    const [commentParent, setCommentParent] = useState(null);
    const [reply, setReply] = useState("");
    const [replies, setReplies] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

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

    const loadCommentParent = async () => {
        try {
            let res = await Apis.get(endpoints['comment-detail'](commentParentId));
            console.log("API Response Data:", res.data);
            setCommentParent(res.data);
        } catch (err) {
            console.error("Lỗi khi tải bình luận cha:", err);
        }
    };

    const loadCommentReplies = async () => {
        if (page > 0) {
            try {

                const res = await Apis.get(`${endpoints['comment-replies'](commentParentId)}?page=${page}`);
                setReplies(page === 1 ? res.data.results : prev => [...prev, ...res.data.results]);
                console.log(res.data.results);
                if (res.data.next === null)
                    setPage(0);
            } catch {
                console.info("Không thể load comment");
            } finally {
                setLoading(false);
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

    const submitReply = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            path = await uploadImgToCloudinary();

            const body = {
                content: reply,
                image: path ?? null,
            };

            console.log("Body gửi lên:", body);

            const res = await Apis.post(endpoints["comment-reply"](commentParentId), body, { headers });

            console.log("Gửi dữ liệu:", res.data)

            setReply("");
            setImage(null);
            setReplies([]);
            setPage(1);
            loadCommentReplies();
        } catch (err) {
            console.error("Lỗi khi gửi bình luận: ", err);
        }
    }

    const renderReplyInput = () => {
        return (
            <KeyboardAvoidingView style={{ padding: 10, backgroundColor: "#f9f9f9", borderTopWidth: 1, borderColor: "#ddd" }}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Trả lời bình luận</Text>
                <TextInput
                    value={reply}
                    onChangeText={setReply}
                    placeholder="Nhập bình luận..."
                    style={{
                        backgroundColor: "white",
                        padding: 10,
                        marginVertical: 10,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ccc"
                    }}
                    multiline
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                    <TouchableOpacity onPress={pickImage}
                        style={{ flex: 1, backgroundColor: "#e0e0e0", padding: 12, alignItems: "center", borderRadius: 8 }}>
                        <Text style={{ color: "#333", fontWeight: "bold" }}>{image ? "Đổi Hình" : "Chọn Hình"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={submitReply}
                        style={{ flex: 1, backgroundColor: "#2196F3", padding: 12, alignItems: "center", borderRadius: 8 }}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Gửi bình luận</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    };

    useEffect(() => {
        loadCommentParent();
    }, []);

    useEffect(() => {
        loadCommentReplies();
    }, [page]);

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {renderReplyInput()}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                onMomentumScrollEnd={loadMore}
            >
                {commentParent && (
                    <View style={Style.commentContainer}>
                        <View style={Style.commentHeader}>
                            <Image
                                source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${commentParent.user.avatar}` }}
                                style={Style.avatar}
                            />
                            <Text style={{ fontWeight: "bold" }}>
                                {commentParent.user.first_name} {commentParent.user.last_name}
                            </Text>
                        </View>
                        <StarRating star={commentParent.star} />
                        <Text style={{ marginTop: 5 }}>{commentParent.content}</Text>
                        {commentParent.image && (
                            <Image
                                source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${commentParent.image}` }}
                                style={{
                                    width: "50%",
                                    height: 100,
                                    resizeMode: "contain",
                                    marginTop: 5,
                                    borderRadius: 10,
                                }}
                            />
                        )}
                    </View>
                )}

                {replies.map(reply => (
                    <View key={`reply-${reply.id}`} style={Style.replyContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={{ uri: `https://res.cloudinary.com/dwivkhh8t/${reply.user.avatar}` }} style={Style.replyAvatar} />
                            <Text style={{ fontWeight: "bold" }}>{reply.user.first_name} {reply.user.last_name}</Text>
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

                {loading && <ActivityIndicator size="large" color="#2196F3" />}
            </ScrollView>

        </View>
    );
};

export default ReplyComment;