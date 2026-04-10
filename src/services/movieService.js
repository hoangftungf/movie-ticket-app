import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Lay danh sach tat ca phim
export const getAllMovies = async () => {
  try {
    const moviesRef = collection(db, 'movies');
    const snapshot = await getDocs(moviesRef);
    const movies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: movies };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lay chi tiet phim theo ID
export const getMovieById = async (movieId) => {
  try {
    const movieDoc = await getDoc(doc(db, 'movies', movieId));
    if (movieDoc.exists()) {
      return { success: true, data: { id: movieDoc.id, ...movieDoc.data() } };
    }
    return { success: false, error: 'Movie not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lay danh sach rap chieu
export const getAllTheaters = async () => {
  try {
    const theatersRef = collection(db, 'theaters');
    const snapshot = await getDocs(theatersRef);
    const theaters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: theaters };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lay lich chieu theo phim
export const getShowtimesByMovie = async (movieId) => {
  try {
    const showtimesRef = collection(db, 'showtimes');
    const q = query(
      showtimesRef,
      where('movieId', '==', movieId),
      orderBy('startTime', 'asc')
    );
    const snapshot = await getDocs(q);
    const showtimes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: showtimes };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lay lich chieu theo rap
export const getShowtimesByTheater = async (theaterId) => {
  try {
    const showtimesRef = collection(db, 'showtimes');
    const q = query(
      showtimesRef,
      where('theaterId', '==', theaterId),
      orderBy('startTime', 'asc')
    );
    const snapshot = await getDocs(q);
    const showtimes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: showtimes };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sample data de test (khi chua co data tren Firebase)
export const SAMPLE_MOVIES = [
  {
    id: '1',
    title: 'Avengers: Endgame',
    description: 'Sau su tan pha cua Thanos, cac Avengers con lai tap hop lai de hoan tac moi thu.',
    genre: 'Action, Sci-Fi',
    duration: 181,
    rating: 8.4,
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    releaseDate: '2019-04-26'
  },
  {
    id: '2',
    title: 'Spider-Man: No Way Home',
    description: 'Peter Parker nho Doctor Strange giup xoa bo ky uc cua moi nguoi ve viec anh la Spider-Man.',
    genre: 'Action, Adventure',
    duration: 148,
    rating: 8.3,
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    releaseDate: '2021-12-17'
  },
  {
    id: '3',
    title: 'Dune',
    description: 'Paul Atreides, mot chang trai tre tai nang va thong minh, phai di den hanh tinh nguy hiem nhat trong vu tru.',
    genre: 'Sci-Fi, Adventure',
    duration: 155,
    rating: 8.0,
    poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    releaseDate: '2021-10-22'
  },
  {
    id: '4',
    title: 'The Batman',
    description: 'Batman kham pha ra su tham nhung o Gotham City khi theo duoi ke sat nhan Riddler.',
    genre: 'Action, Crime',
    duration: 176,
    rating: 7.8,
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvber8cQjNQzFIOC.jpg',
    releaseDate: '2022-03-04'
  },
  {
    id: '5',
    title: 'Top Gun: Maverick',
    description: 'Maverick quay lai day mot nhom phi cong tre cho mot nhiem vu dac biet.',
    genre: 'Action, Drama',
    duration: 130,
    rating: 8.3,
    poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWqsDb7pCzCT6p6C1.jpg',
    releaseDate: '2022-05-27'
  }
];

export const SAMPLE_THEATERS = [
  { id: '1', name: 'CGV Vincom Center', address: '72 Le Thanh Ton, Q.1, TP.HCM' },
  { id: '2', name: 'Galaxy Nguyen Du', address: '116 Nguyen Du, Q.1, TP.HCM' },
  { id: '3', name: 'Lotte Cinema Nam Sai Gon', address: '469 Nguyen Huu Tho, Q.7, TP.HCM' },
];

export const SAMPLE_SHOWTIMES = [
  { id: '1', movieId: '1', theaterId: '1', startTime: '10:00', price: 90000 },
  { id: '2', movieId: '1', theaterId: '1', startTime: '14:30', price: 100000 },
  { id: '3', movieId: '1', theaterId: '2', startTime: '19:00', price: 120000 },
  { id: '4', movieId: '2', theaterId: '1', startTime: '11:00', price: 90000 },
  { id: '5', movieId: '2', theaterId: '3', startTime: '16:00', price: 110000 },
];
