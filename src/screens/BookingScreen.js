import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';

const TICKET_PRICES = {
  first: 1500000,
  business: 1300000,
  economy: 1000000,
};

const TICKET_INFO = {
  first: { label: 'Hang nhat', price: '1,500,000', color: '#FFD700', icon: '👑' },
  business: { label: 'Thuong gia', price: '1,300,000', color: '#C0C0C0', icon: '💼' },
  economy: { label: 'Pho thong', price: '1,000,000', color: '#CD7F32', icon: '✈️' },
};

export default function BookingScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ticketType, setTicketType] = useState('economy');
  const [quantity, setQuantity] = useState('1');
  const [discount, setDiscount] = useState('0');
  const [showResult, setShowResult] = useState(false);
  const [rating, setRating] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);

  const calculateTotal = () => {
    const price = TICKET_PRICES[ticketType];
    const qty = parseInt(quantity) || 0;
    const disc = parseFloat(discount) || 0;
    let total = price * qty;
    total = total - (total * disc / 100);
    return total;
  };

  const handleBooking = () => {
    if (!name.trim() || !phone.trim()) {
      alert('Vui long nhap day du thong tin!');
      return;
    }
    if (parseInt(quantity) <= 0) {
      alert('So luong ve phai lon hon 0!');
      return;
    }
    const total = calculateTotal();
    setTotalPrice(total);
    setOriginalPrice(total);
    setShowResult(true);
    setRating(0);
  };

  const applyRatingDiscount = (stars) => {
    setRating(stars);
    if (stars === 5) {
      setTotalPrice(originalPrice * 0.95);
    } else {
      setTotalPrice(originalPrice);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const TicketCard = ({ type, selected, onPress }) => {
    const info = TICKET_INFO[type];
    return (
      <TouchableOpacity
        style={[styles.ticketCard, selected && styles.ticketCardSelected]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.ticketBadge, { backgroundColor: info.color }]}>
          <Text style={styles.ticketIcon}>{info.icon}</Text>
        </View>
        <Text style={[styles.ticketLabel, selected && styles.ticketLabelSelected]}>
          {info.label}
        </Text>
        <Text style={[styles.ticketPrice, selected && styles.ticketPriceSelected]}>
          {info.price}
        </Text>
        {selected && <View style={styles.checkMark}><Text style={styles.checkText}>✓</Text></View>}
      </TouchableOpacity>
    );
  };

  const StarRating = ({ rating, onRate }) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate(star)}
          style={styles.starButton}
        >
          <Text style={[styles.star, star <= rating && styles.starFilled]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✈️</Text>
        <Text style={styles.headerTitle}>Dat Ve May Bay</Text>
        <Text style={styles.headerSubtitle}>Chon ve va dat ngay hom nay</Text>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>👤 Ho va ten</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhap ho va ten"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📱 Dien thoai</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhap so dien thoai"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Ticket Type */}
        <Text style={styles.label}>🎫 Loai ve</Text>
        <View style={styles.ticketContainer}>
          <TicketCard
            type="first"
            selected={ticketType === 'first'}
            onPress={() => setTicketType('first')}
          />
          <TicketCard
            type="business"
            selected={ticketType === 'business'}
            onPress={() => setTicketType('business')}
          />
          <TicketCard
            type="economy"
            selected={ticketType === 'economy'}
            onPress={() => setTicketType('economy')}
          />
        </View>

        {/* Quantity & Discount */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>🔢 So luong</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor="#aaa"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>🏷️ Uu dai (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#aaa"
              value={discount}
              onChangeText={setDiscount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Book Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>🛫 Dat Ve Ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Result */}
      {showResult && (
        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultIcon}>🎉</Text>
            <Text style={styles.resultTitle}>Dat ve thanh cong!</Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Ho va ten</Text>
              <Text style={styles.resultValue}>{name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Dien thoai</Text>
              <Text style={styles.resultValue}>{phone}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Loai ve</Text>
              <Text style={styles.resultValue}>
                {TICKET_INFO[ticketType].icon} {TICKET_INFO[ticketType].label}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Tong tien</Text>
              <Text style={styles.totalPrice}>{formatCurrency(totalPrice)}</Text>
              {rating === 5 && (
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusText}>-5% danh gia 5 sao!</Text>
                </View>
              )}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>Danh gia dich vu</Text>
            <Text style={styles.ratingHint}>Danh gia 5 sao de duoc giam 5%</Text>
            <StarRating rating={rating} onRate={applyRatingDiscount} />
          </View>
        </View>
      )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#6c5ce7',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  formSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 25,
    padding: 25,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  ticketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
  },
  ticketCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  ticketCardSelected: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  ticketBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketIcon: {
    fontSize: 20,
  },
  ticketLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  ticketLabelSelected: {
    color: '#fff',
  },
  ticketPrice: {
    fontSize: 10,
    color: '#999',
    marginTop: 3,
  },
  ticketPriceSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  checkMark: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#6c5ce7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
  },
  bookButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultSection: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: '#888',
  },
  resultValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  totalContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  bonusBadge: {
    backgroundColor: '#00b894',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  bonusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ratingHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: 'row',
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 40,
    color: '#ddd',
  },
  starFilled: {
    color: '#FFD700',
  },
});
