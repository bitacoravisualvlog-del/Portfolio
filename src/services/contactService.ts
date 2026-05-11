import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from './blogService';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: any;
}

export const contactService = {
  async sendMessage(name: string, email: string, phone: string, subject: string, message: string) {
    const path = 'messages';
    try {
      await addDoc(collection(db, path), {
        name,
        email,
        phone,
        subject,
        message,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getAllMessages() {
    const path = 'messages';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactMessage[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
};
