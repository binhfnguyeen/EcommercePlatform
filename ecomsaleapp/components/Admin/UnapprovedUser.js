import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryChatStyles from '../Chat/HistoryChatStyles';
import AdminStyles from './AdminStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ApproveUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation=useNavigation();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn("No token found");
        return;
      }
      const res = await authApis(token).get(endpoints['user-unapproved']);
      setUsers(res.data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const approveSelectedUsers = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 người dùng.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn("No token found");
        return;
      }
      const res = await authApis(token).patch(endpoints['approve-user'],
        { user_ids: selectedIds },
        { headers: { 'Content-Type': 'application/json' } }
      );

      Alert.alert('Thành công', res.data.message);
      setSelectedIds([]);
      loadUsers();
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể duyệt người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Checkbox
        status={selectedIds.includes(item.id) ? 'checked' : 'unchecked'}
        onPress={() => toggleSelect(item.id)}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.fullName}>{item.first_name} {item.last_name}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={AdminStyles.barHeader}>
        <TouchableOpacity style={AdminStyles.returnButton} onPress={() => navigation.navigate("profile_main")}>
          <Ionicons name="return-down-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Người dùng chờ duyệt</Text>
      </View>

      <View style={{ flex: 1, marginTop: 60 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={approveSelectedUsers}>
        <Text style={styles.buttonText}>Duyệt người dùng đã chọn</Text>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  username: { fontSize: 16, fontWeight: '500', color: '#333' },
  fullName: { fontSize: 14, color: '#777' },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ApproveUsersScreen;
