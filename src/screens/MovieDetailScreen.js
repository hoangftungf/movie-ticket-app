import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SAMPLE_THEATERS, SAMPLE_SHOWTIMES } from '../services/movieService';
import { createTicket } from '../services/ticketService';
import { scheduleShowtimeReminder, sendImmediateNotification } from '../services/notificationService';
import { auth } from '../config/firebase';

const SEATS_ROW = ['A', 'B', 'C', 'D', 'E'];
const SEATS_COL = [1, 2, 3, 4, 5, 6];

export default function MovieDetailScreen({ route, navigation }) {
  const { movie } = route.params;
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theaters] = useState(SAMPLE_THEATERS);
  const [bookedSeats] = useState(['A1', 'A2', 'C3', 'D4']); // Ghe da dat (mock)

  const getShowtimesForTheater = (theaterId) => {
    return SAMPLE_SHOWTIMES.filter(
      st => st.theaterId === theaterId && st.movieId === movie.id
    );
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateTotal = () => {
    if (!selectedShowtime) return 0;
    return selectedSeats.length * selectedShowtime.price;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const handleBooking = async () => {
    if (!selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
      Alert.alert('Loi', 'Vui long chon rap, suat chieu va ghe!');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Loi', 'Vui long dang nhap de dat ve!');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);

    const ticketData = {
      userId: user.uid,
      userEmail: user.email,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      theaterId: selectedTheater.id,
      theaterName: selectedTheater.name,
      theaterAddress: selectedTheater.address,
      showtimeId: selectedShowtime.id,
      showtime: selectedShowtime.startTime,
      seats: selectedSeats,
      totalPrice: calculateTotal(),
      showDate: new Date().toISOString().split('T')[0], // Hom nay
    };

    const result = await createTicket(ticketData);
    setLoading(false);

    if (result.success) {
      // Gui notification nhac gio chieu
      await sendImmediateNotification(
        'Dat ve thanh cong!',
        `Ban da dat ve xem phim "${movie.title}" luc ${selectedShowtime.startTime}`,
        { ticketId: result.ticketId }
      );

      Alert.alert(
        'Dat ve thanh cong!',
        `Phim: ${movie.title}\nRap: ${selectedTheater.name}\nGio: ${selectedShowtime.startTime}\nGhe: ${selectedSeats.join(', ')}\nTong: ${formatCurrency(calculateTotal())}`,
        [
          {
            text: 'Xem ve cua toi',
            onPress: () => navigation.navigate('TicketList')
          },
          { text: 'OK' }
        ]
      );

      // Reset selection
      setSelectedSeats([]);
      setSelectedShowtime(null);
    } else {
      Alert.alert('Loi', result.error || 'Khong the dat ve. Vui long thu lai!');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Movie Header */}
      <View style={styles.header}>
        <Image source={{ uri: movie.poster }} style={styles.backdrop} blurRadius={10} />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Image source={{ uri: movie.poster }} style={styles.poster} />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.genre}>{movie.genre}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★ {movie.rating}</Text>
              <Text style={styles.duration}>{movie.duration} phut</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mo ta</Text>
        <Text style={styles.description}>{movie.description}</Text>
      </View>

      {/* Select Theater */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chon rap</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {theaters.map(theater => (
            <TouchableOpacity
              key={theater.id}
              style={[
                styles.theaterCard,
                selectedTheater?.id === theater.id && styles.theaterCardSelected
              ]}
              onPress={() => {
                setSelectedTheater(theater);
                setSelectedShowtime(null);
                setSelectedSeats([]);
              }}
            >
              <Text style={[
                styles.theaterName,
                selectedTheater?.id === theater.id && styles.theaterNameSelected
              ]}>
                {theater.name}
              </Text>
              <Text style={[
                styles.theaterAddress,
                selectedTheater?.id === theater.id && styles.theaterAddressSelected
              ]}>
                {theater.address}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Select Showtime */}
      {selectedTheater && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chon suat chieu</Text>
          <View style={styles.showtimeContainer}>
            {getShowtimesForTheater(selectedTheater.id).map(showtime => (
              <TouchableOpacity
                key={showtime.id}
                style={[
                  styles.showtimeCard,
                  selectedShowtime?.id === showtime.id && styles.showtimeCardSelected
                ]}
                onPress={() => {
                  setSelectedShowtime(showtime);
                  setSelectedSeats([]);
                }}
              >
                <Text style={[
                  styles.showtimeText,
                  selectedShowtime?.id === showtime.id && styles.showtimeTextSelected
                ]}>
                  {showtime.startTime}
                </Text>
                <Text style={[
                  styles.priceText,
                  selectedShowtime?.id === showtime.id && styles.priceTextSelected
                ]}>
                  {formatCurrency(showtime.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Select Seats */}
      {selectedShowtime && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chon ghe</Text>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatAvailable]} />
              <Text style={styles.legendText}>Trong</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatSelected]} />
              <Text style={styles.legendText}>Dang chon</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatBooked]} />
              <Text style={styles.legendText}>Da dat</Text>
            </View>
          </View>

          {/* Screen */}
          <View style={styles.screen}>
            <Text style={styles.screenText}>MAN HINH</Text>
          </View>

          {/* Seats Grid */}
          <View style={styles.seatsContainer}>
            {SEATS_ROW.map(row => (
              <View key={row} style={styles.seatRow}>
                <Text style={styles.rowLabel}>{row}</Text>
                {SEATS_COL.map(col => {
                  const seat = `${row}${col}`;
                  const isBooked = bookedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);

                  return (
                    <TouchableOpacity
                      key={seat}
                      style={[
                        styles.seat,
                        isBooked && styles.seatBooked,
                        isSelected && styles.seatSelected
                      ]}
                      onPress={() => toggleSeat(seat)}
                      disabled={isBooked}
                    >
                      <Text style={[
                        styles.seatText,
                        (isBooked || isSelected) && styles.seatTextSelected
                      ]}>
                        {col}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <Text style={styles.rowLabel}>{row}</Text>
              </View>
            ))}
          </View>

          {/* Selected seats info */}
          {selectedSeats.length > 0 && (
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedText}>
                Ghe: {selectedSeats.sort().join(', ')}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Bottom Bar */}
      {selectedShowtime && (
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tong tien</Text>
            <Text style={styles.totalPrice}>{formatCurrency(calculateTotal())}</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookButton, selectedSeats.length === 0 && styles.bookButtonDisabled]}
            onPress={handleBooking}
            disabled={selectedSeats.length === 0 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.bookButtonText}>Dat Ve</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    height: 280,
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 12, 41, 0.8)',
  },
  headerContent: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 60,
  },
  poster: {
    width: 140,
    height: 200,
    borderRadius: 15,
    backgroundColor: '#2d3436',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  genre: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 15,
  },
  duration: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
  },
  theaterCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 200,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  theaterCardSelected: {
    borderColor: '#6c5ce7',
    backgroundColor: '#1a1a2e',
  },
  theaterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  theaterNameSelected: {
    color: '#6c5ce7',
  },
  theaterAddress: {
    fontSize: 12,
    color: '#888',
  },
  theaterAddressSelected: {
    color: '#aaa',
  },
  showtimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  showtimeCard: {
    backgroundColor: '#16213e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  showtimeCardSelected: {
    borderColor: '#6c5ce7',
    backgroundColor: '#6c5ce7',
  },
  showtimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  showtimeTextSelected: {
    color: '#fff',
  },
  priceText: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  priceTextSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#888',
  },
  screen: {
    backgroundColor: '#6c5ce7',
    height: 6,
    borderRadius: 3,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  screenText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 10,
    marginTop: 10,
  },
  seatsContainer: {
    alignItems: 'center',
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 25,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  seat: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  seatAvailable: {
    backgroundColor: '#16213e',
  },
  seatSelected: {
    backgroundColor: '#6c5ce7',
  },
  seatBooked: {
    backgroundColor: '#636e72',
  },
  seatText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  seatTextSelected: {
    color: '#fff',
  },
  selectedInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedText: {
    color: '#6c5ce7',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  totalContainer: {},
  totalLabel: {
    color: '#888',
    fontSize: 12,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  bookButtonDisabled: {
    backgroundColor: '#636e72',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
