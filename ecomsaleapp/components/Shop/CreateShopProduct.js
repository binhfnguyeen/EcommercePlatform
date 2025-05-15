import { useState } from "react"
import { View, Text,SafeAreaView,ScrollView,TouchableOpacity } from "react-native"
import { Button,TextInput,HelperText,Image } from "react-native-paper"
import EcomSaleStyles from "../../styles/EcomSaleStyles"
import * as ImagePicker from 'expo-image-picker';
import { authApis, endpoints } from "../../configs/Apis";


const CreateProduct = () => {
  const [product, setProduct] = useState({ name: "", price: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const picker = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissions denied!");
      return;
      }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
      }
  };

  // const handleInput = (field, value) => {
  //     setProduct((prev) => ({
  //     ...prev,
  //     [field]: value,
  //     }));
  //   };

  // const submitProduct = async () => {
  //   if (!product.name || !product.price) {
  //     setMsg("Vui lòng nhập đầy đủ thông tin!");
  //     return;
  //   }

  // setLoading(true);
  // const formData = new FormData();

  // formData.append("name", product.name);
  // formData.append("price", product.price);
  // formData.append("category", "1"); // Replace with dynamic value or selector
  // formData.append("shop", "1");     // Replace with actual shop ID

  // images.forEach((img, index) => {
  //   formData.append("images", {
  //     uri: img.uri,
  //     name: `image_${index}.jpg`,
  //     type: "image/jpeg",
  //     });
  //   });

  // try {
  //   const res = await authApis.post(
  //     endpoints['create-product'],formData,
  //     {
  //       headers: {
  //       "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   Alert.alert("Thành công", "Sản phẩm đã được tạo!");
  //   setProduct({ name: "", price: "" });
  // setImages([]);
  // } catch (error) {
  //     console.error(error);
  //     setMsg("Tạo sản phẩm thất bại.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const info = [
    {
      label: "Tên sản phẩm",
      field: "name",
      icon: "text",
    },
    {
      label: "Giá sản phẩm",
      field: "price",
      icon: "cash",
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView style={{ padding: 12 }}>
        <HelperText type="error" visible={!!msg}>
          {msg}
        </HelperText>

        {info.map((i) => (
          <TextInput
            key={i.field}
            label={i.label}
            value={product[i.field]}
            // onChangeText={(text) => handleInput(i.field, text)}
            style={EcomSaleStyles.m}
            keyboardType={i.field === "price" ? "numeric" : "default"}
            right={<TextInput.Icon icon={i.icon} />}
          />
        ))}

        <TouchableOpacity style={{ margin: 8 }} onPress={picker}>
          <Text>Chọn ảnh sản phẩm...</Text>
        </TouchableOpacity>

        {images.map((img, index) => (
          <Image key={index} style={{ width: 100, height: 100, alignSelf: "center", marginTop: 8, borderRadius: 8, }} source={{ uri: img.uri }}/>
        ))}

        <Button disabled={loading} loading={loading} mode="contained" buttonColor="#4CAF50" style={{ margin: 8 }}>Tạo sản phẩm</Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateProduct;