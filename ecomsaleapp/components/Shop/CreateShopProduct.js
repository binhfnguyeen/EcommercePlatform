import { useEffect, useState } from "react"
import { View, Text,SafeAreaView,ScrollView,TouchableOpacity, Alert } from "react-native"
import { Button,TextInput,HelperText } from "react-native-paper"
import { Image } from "react-native"
import EcomSaleStyles from "../../styles/EcomSaleStyles"
import * as ImagePicker from 'expo-image-picker';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { Menu, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage"


const CreateProduct = ({route}) => {
  const [product, setProduct] = useState({ name: "", price: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories,setCategories]=useState([]);

  const shopId=route.params?.shopId;

  const picker = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissions denied!");
      return;
      }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      });

    if (!result.canceled) {
      setImages(result.assets);
      }
  };

  const loadCategory= async ()=>{
    let res= await Apis.get(endpoints['categorys'])
    setCategories(res.data)
  }

  useEffect(()=>{
    loadCategory()
  },[])

  const handleInput = (field, value) => {
      setProduct({...product,[field]:value})
    };

  const submitProduct= async()=>{
    if(!product.name || !product.price){
      setMsg('Xin hãy nhập đầy đủ thông tin')
      return;
    }
    const formData=new FormData();
    formData.append("name",product.name)
    formData.append('price',product.price)
    formData.append("category",category.id)
    images.forEach((img)=>{
      formData.append("images",{
        uri:img.uri,
        name:img.fileName,
        type:img.type?.includes("jpeg") || img.name?.endsWith(".jpg") ? "image/jpeg" : "image/png"
      })
    });
    try{
      console.info(formData)
      setLoading(true)
      const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("No token found");
                return;
            }
      // for (let [key, value] of formData.entries()) {
      //       console.log(`${key}:`, value);
      //     }
      // console.info(formData)
      // console.info(token)
      // console.info(authApis(token).defaults)
      // console.info(endpoints['create-product'](shopId))
      // console.info(authApis().defaults.baseURL+endpoints['create-product'](shopId))
      let url = `${endpoints['create-product'](shopId)}`;
      let res= await authApis(token).post(url,formData,{
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })
      Alert.alert("tạo sản phẩm thành công")

      setProduct({name:"",price:""})
      setImages([])
      setCategory(null)
    }catch(ex){
      console.info("ERROR:", ex);
      if (ex.response) {
        console.log("Response:", ex.response.data);
      } else if (ex.request) {
        console.log("Request:", ex.request);
      } else {
        console.log("Error Message:", ex.message);
      }
    }finally{
      setLoading(false)
    }
    
  }

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
            onChangeText={(text) => handleInput(i.field, text)}
            style={EcomSaleStyles.m}
            keyboardType={i.field === "price" ? "numeric" : "default"}
            right={<TextInput.Icon icon={i.icon} />}
          />
        ))}

        <View style={{ margin: 8 }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={{ justifyContent: 'flex-start' }}
                >
                {category ? category.name : "Chọn danh mục"}
              </Button>
            }
            >
            {categories.map((cat) => (
              <Menu.Item
                key={cat.id}
                onPress={() => {
                  setCategory(cat);
                  setMenuVisible(false);
                }}
                title={cat.name}
              />
            ))}
          </Menu>
        </View>

        <TouchableOpacity style={{ margin: 8 }} onPress={picker}>
          <Text>Chọn ảnh sản phẩm...</Text>
        </TouchableOpacity>
        
        <View style={EcomSaleStyles.flex_view}>
          {images.map((img, index) => (
            <Image key={index} style={{ width: 100, height: 100, alignSelf: "center", marginTop: 8, borderRadius: 8, }} source={{ uri: img.uri }}/>
          ))}
        </View>

        <Button disabled={loading} loading={loading} mode="contained" buttonColor="#4CAF50" style={{ margin: 8 }} onPress={submitProduct}>Tạo sản phẩm</Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateProduct;