import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Dang ky tai khoan moi
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Luu thong tin user vao Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Dang nhap
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Dang xuat
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lay thong tin user
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Theo doi trang thai dang nhap
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Luu FCM token vao user document
export const saveFcmToken = async (userId, fcmToken) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      fcmToken: fcmToken,
      fcmTokenUpdatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    // Neu user doc chua ton tai, tao moi
    try {
      await setDoc(doc(db, 'users', userId), {
        fcmToken: fcmToken,
        fcmTokenUpdatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
