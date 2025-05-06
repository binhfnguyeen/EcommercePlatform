import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const DATA = [
  {
    id: '1',
    title: 'Áo Double Zipper Boxy Hoodie...',
    price: '₫282.240',
    discount: '-25%',
    rating: '4.9',
    sold: '77,8k',
    img: require('./assets/hoodie1.jpg'), // Replace with your image path
  },
  {
    id: '2',
    title: 'Quần Short Basic SS2 NOCTUR...',
    price: '₫165.600',
    discount: '-28%',
    rating: '4.9',
    sold: '11,1k',
    img: require('./assets/short1.jpg'), // Replace with your image path
  },
  {
    id: '3',
    title: 'Form Rộng...',
    price: '₫210.600',
    discount: '-20%',
    rating: '4.9',
    sold: '8k',
    img: require('./assets/formr1.jpg'), // Replace with your image path
  },
];

const Shop = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nocturnal</Text>
        <Text style={styles.headerTime}>15:00</Text>
      </View>

      {/* Main Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>BOXY POC TEE</Text>
        <Text style={styles.collection}>W/S 2025 COLLECTION</Text>
      </View>

      {/* Recommended Products */}
      <Text style={styles.recommendationTitle}>Gợi ý cho bạn</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.img} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.productDiscount}>{item.discount}</Text>
            <Text style={styles.productRating}>⭐ {item.rating} - {item.sold}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTime: {
    fontSize: 18,
  },
  banner: {
    backgroundColor: '#eaeaea',
    padding: 16,
    marginVertical: 16,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  collection: {
    fontSize: 16,
  },
  recommendationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productCard: {
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#FF6347',
  },
  productDiscount: {
    fontSize: 12,
    color: '#FF6347',
    textDecorationLine: 'line-through',
  },
  productRating: {
    fontSize: 12,
    color: '#888',
  },
});

export default Shop;

