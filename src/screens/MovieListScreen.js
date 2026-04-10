import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { getAllMovies, SAMPLE_MOVIES } from '../services/movieService';
import { logoutUser } from '../services/authService';
import { auth } from '../config/firebase';

export default function MovieListScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    const result = await getAllMovies();

    if (result.success && result.data.length > 0) {
      setMovies(result.data);
    } else {
      // Su dung sample data neu chua co data tren Firebase
      setMovies(SAMPLE_MOVIES);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetail', { movie: item })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.genre}>{item.genre}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.duration}> | {item.duration} phut</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('MovieDetail', { movie: item })}
        >
          <Text style={styles.bookButtonText}>Dat Ve</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        <View>
          <Text style={styles.greeting}>Xin chao!</Text>
          <Text style={styles.headerTitle}>Chon phim yeu thich</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.ticketButton}
            onPress={() => navigation.navigate('TicketList')}
          >
            <Text style={styles.ticketIcon}>🎫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Thoat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Movie List */}
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Khong co phim nao</Text>
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  greeting: {
    fontSize: 14,
    color: '#888',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ticketIcon: {
    fontSize: 20,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  listContent: {
    padding: 20,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  poster: {
    width: 120,
    height: 180,
    backgroundColor: '#2d3436',
  },
  movieInfo: {
    flex: 1,
    padding: 15,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  genre: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStar: {
    fontSize: 14,
    color: '#FFD700',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 4,
  },
  duration: {
    fontSize: 12,
    color: '#888',
  },
  description: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 18,
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
