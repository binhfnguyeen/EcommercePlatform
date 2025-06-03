import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { authApis, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApproveUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);s


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
      const res = await authApis(token).get(endpoints['user-unapproved'])
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
        {user_ids:selectedIds},
        {headers: {
          'Content-Type': 'application/json',
        },})

      Alert.alert('Thành công', res.data.message);
      setSelectedIds([]);
      loadUsers(); // refresh lại danh sách
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể duyệt người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <CheckBox
        value={selectedIds.includes(item.id)}
        onValueChange={() => toggleSelect(item.id)}
      />
      <Text>{item.username} ({item.first_name} {item.last_name})</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Người dùng chờ duyệt</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Duyệt người dùng đã chọn" onPress={approveSelectedUsers} />
      </View>
    </View>
  );
};

export default ApproveUsersScreen;
const s=null