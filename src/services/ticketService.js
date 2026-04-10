import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Tao ve moi
export const createTicket = async (ticketData) => {
  try {
    const ticketsRef = collection(db, 'tickets');
    const docRef = await addDoc(ticketsRef, {
      ...ticketData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    });
    return { success: true, ticketId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lay tat ca ve cua user
export const getTicketsByUser = async (userId) => {
  try {
    const ticketsRef = collection(db, 'tickets');
    // Chi dung where, khong dung orderBy de tranh loi index
    const q = query(
      ticketsRef,
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const tickets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort trong JavaScript thay vi Firestore
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: tickets };
  } catch (error) {
    console.log('getTicketsByUser error:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// Lay chi tiet ve
export const getTicketById = async (ticketId) => {
  try {
    const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
    if (ticketDoc.exists()) {
      return { success: true, data: { id: ticketDoc.id, ...ticketDoc.data() } };
    }
    return { success: false, error: 'Ticket not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Huy ve
export const cancelTicket = async (ticketId) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Xoa ve
export const deleteTicket = async (ticketId) => {
  try {
    await deleteDoc(doc(db, 'tickets', ticketId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
