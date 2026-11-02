import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from './blogService';

// Personas que dejaron su email para descargar un recurso.
export interface Lead {
  id?: string;
  name: string;
  email: string;
  resourceId: string;
  resourceTitle: string;
  marketingOptIn: boolean;  // aceptó recibir novedades por email
  createdAt: any;
}

const PATH = 'leads';

export const leadService = {
  async addLead(lead: Omit<Lead, 'id' | 'createdAt'>) {
    try {
      await addDoc(collection(db, PATH), {
        name: lead.name.trim().slice(0, 100),
        email: lead.email.trim().toLowerCase().slice(0, 100),
        resourceId: lead.resourceId,
        resourceTitle: lead.resourceTitle.slice(0, 200),
        marketingOptIn: lead.marketingOptIn,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, PATH);
    }
  },

  async getAllLeads() {
    try {
      const q = query(collection(db, PATH), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Lead[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, PATH);
    }
  },

  async deleteLead(leadId: string) {
    try {
      await deleteDoc(doc(db, PATH, leadId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${PATH}/${leadId}`);
    }
  },
};

// Recuerda el email en este navegador para no pedirlo en cada descarga.
const STORAGE_KEY = 'cd_lead';

export function getSavedLead(): { name: string; email: string; marketingOptIn: boolean } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLeadLocally(data: { name: string; email: string; marketingOptIn: boolean }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* navegación privada o almacenamiento bloqueado: no pasa nada */
  }
}
