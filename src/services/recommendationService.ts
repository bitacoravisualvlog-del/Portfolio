import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { OperationType } from './blogService';

export interface Recommendation {
  id?: string;
  userName: string;
  content: string;
  rating: number;
  createdAt: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const recommendationService = {
  async getRecommendations() {
    const path = 'recommendations';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recommendation[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addRecommendation(recommendation: Omit<Recommendation, 'id' | 'createdAt'>) {
    const path = 'recommendations';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...recommendation,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};
