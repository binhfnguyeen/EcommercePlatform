import { ScrollView, Text, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { useEffect, useState } from "react";

const ProductDetail = ({ route }) => {
    const productId = route.params?.productId;
    const [product, setProduct] = useState(null);

    const loadProduct = async () => {
        let res = await Apis.get(endpoints['product'](productId));
        setProduct(res.data);
    }

    useEffect(() => {
        loadProduct();
    }, [])

    return (
        <ScrollView>
            {product === null ? (
                <Text>Đang tải dữ liệu...</Text>
            ) : (
                <>
                    <Text>Chi tiết sản phẩm {productId}</Text>
                    <Text>Tên: {product.name}</Text>
                    <Text>Shop: {product.shop?.name}</Text>
                    <Text>Loại: {product.category?.name}</Text>
                </>
            )}
        </ScrollView>
    );
}

export default ProductDetail;