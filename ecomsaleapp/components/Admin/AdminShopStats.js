// AdminShopStatsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AdminShopStatsScreen = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loadshop = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn("No token found");
        return;
      }
      const res = await authApis(token).get(endpoints["shops"]);
      setShops(res.data);
    } catch (ex) {
      console.info(ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadshop();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Thống kê cửa hàng</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
      ) : shops.length === 0 ? (
        <Text style={styles.emptyText}>Không có cửa hàng nào.</Text>
      ) : (
        shops.map(shop => (
          <TouchableOpacity
            key={shop.id}
            style={styles.shopCard}
            onPress={() => navigation.navigate('statdetail', { shopId: shop.id })}
          >
            <View style={styles.shopCardContent}>
              <Ionicons name="storefront-outline" size={24} color="#2196F3" style={{ marginRight: 10 }} />
              <Text style={styles.shopName}>{shop.name}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f4f6f8',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  shopCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default AdminShopStatsScreen;
