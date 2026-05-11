import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  Timestamp,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Post {
  id?: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  authorEmail: string;
  createdAt: any;
}

export interface Comment {
  id?: string;
  postId: string;
  userName: string;
  content: string;
  createdAt: any;
}

export const blogService = {
  async getPosts() {
    const path = 'posts';
    try {
      const q = query(collection(db, path), where('published', '==', true), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async getAllPosts() {
    const path = 'posts';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async getPostBySlug(slug: string) {
    const path = 'posts';
    try {
      const q = query(collection(db, path), where('slug', '==', slug), where('published', '==', true));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docData = snapshot.docs[0];
      return { id: docData.id, ...docData.data() } as Post;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'authorEmail'>) {
    const path = 'posts';
    try {
      if (!auth.currentUser?.email) throw new Error("Auth required");
      const docRef = await addDoc(collection(db, path), {
        ...post,
        authorEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updatePost(postId: string, data: Partial<Post>) {
    const path = `posts/${postId}`;
    try {
      await updateDoc(doc(db, 'posts', postId), {
        ...data,
        updatedAt: serverTimestamp()
      } as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deletePost(postId: string) {
    const path = `posts/${postId}`;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getComments(postId: string) {
    const path = `posts/${postId}/comments`;
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'postId'>) {
    const path = `posts/${postId}/comments`;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...comment,
        postId,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};
