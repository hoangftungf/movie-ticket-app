import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { getTicketsByUser, cancelTicket } from '../services/ticketService';
import { getLocalTickets, cancelLocalTicket } from '../services/localTicketService';
import { auth } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from '../context/ToastContext';

export default function TicketListScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useToast();

  useFocusEffect(
    useCallback(() => {
      loadTickets();
    }, [])
  );

  const loadTickets = async () => {
    setLoading(true);
    const user = auth.currentUser;

    let result;
    if (user) {
      // Lay tu Firebase neu da dang nhap
      result = await getTicketsByUser(user.uid);
    } else {
      // Lay tu local storage neu dung demo mode
      result = await getLocalTickets();
    }

    if (result.success) {
      setTickets(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const handleCancelTicket = (ticketId, movieTitle) => {
    Alert.alert(
      'Xac nhan huy ve',
      `Ban co chac muon huy ve xem phim "${movieTitle}"?`,
      [
        { text: 'Khong', style: 'cancel' },
        {
          text: 'Huy ve',
          style: 'destructive',
          onPress: async () => {
            const user = auth.currentUser;
            let result;

            if (user) {
              result = await cancelTicket(ticketId);
            } else {
              result = await cancelLocalTicket(ticketId);
            }

            if (result.success) {
              showSuccess('Da huy ve thanh cong!');
              loadTickets();
            } else {
              showError('Khong the huy ve. Vui long thu lai!');
            }
          }
        }
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#00b894';
      case 'cancelled': return '#d63031';
      case 'used': return '#636e72';
      default: return '#6c5ce7';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Da xac nhan';
      case 'cancelled': return 'Da huy';
      case 'used': return 'Da su dung';
      default: return status;
    }
  };

  const renderTicketItem = ({ item }) => (
    <View style={styles.ticketCard}>
      {/* Movie Poster */}
      <Image
        source={{ uri: item.moviePoster }}
        style={styles.poster}
      />

      {/* Ticket Info */}
      <View style={styles.ticketInfo}>
        <View style={styles.ticketHeader}>
          <Text style={styles.movieTitle} numberOfLines={1}>{item.movieTitle}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Rap:</Text>
          <Text style={styles.value}>{item.theaterName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngay:</Text>
          <Text style={styles.value}>{item.showDate}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Gio:</Text>
          <Text style={styles.value}>{item.showtime}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ghe:</Text>
          <Text style={styles.value}>{item.seats?.join(', ')}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tong tien:</Text>
          <Text style={styles.priceValue}>{formatCurrency(item.totalPrice)}</Text>
        </View>

        {/* Actions */}
        {item.status === 'confirmed' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelTicket(item.id, item.movieTitle)}
            >
              <Text style={styles.cancelButtonText}>Huy ve</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* QR Code placeholder */}
      <View style={styles.qrContainer}>
        <View style={styles.qrCode}>
          <Text style={styles.qrText}>QR</Text>
        </View>
        <Text style={styles.ticketId}>#{item.id?.slice(-6).toUpperCase()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
        <Text style={styles.loadingText}>Dang tai...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ve cua toi</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Ticket List */}
      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyTitle}>Chua co ve nao</Text>
            <Text style={styles.emptyText}>Dat ve ngay de xem phim yeu thich!</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('MovieList')}
            >
              <Text style={styles.browseButtonText}>Xem phim</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0c29',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a2e',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 20,
  },
  ticketCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 120,
    backgroundColor: '#2d3436',
  },
  ticketInfo: {
    padding: 15,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 60,
    color: '#888',
    fontSize: 13,
  },
  value: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#2d3436',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#888',
    fontSize: 14,
  },
  priceValue: {
    color: '#6c5ce7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: 'rgba(214, 48, 49, 0.2)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#d63031',
    fontSize: 14,
    fontWeight: '600',
  },
  qrContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'center',
  },
  qrCode: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketId: {
    color: '#fff',
    fontSize: 10,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 25,
  },
  browseButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
