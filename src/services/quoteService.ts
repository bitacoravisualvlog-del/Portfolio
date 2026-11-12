import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from './blogService';

// Pedidos del cotizador ("Pedí tu presupuesto").
export type QuoteStatus = 'nuevo' | 'enviado' | 'cerrado';

export interface Quote {
  id?: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  industry: string;
  website: string;
  goal: string;
  timeline: string;
  budget: string;
  details: string;
  services: string[];
  lang: string;
  status: QuoteStatus;
  createdAt: any;
}

export type QuoteInput = Omit<Quote, 'id' | 'createdAt' | 'status'>;

const PATH = 'quotes';

// Aviso por mail con FormSubmit (sin cuenta). La primera vez llega un mail para activarlo.
const NOTIFY_URL = 'https://formsubmit.co/ajax/createdigital.mkt@gmail.com';

const clip = (value: string, max: number) => (value || '').trim().slice(0, max);

export const quoteService = {
  async addQuote(input: QuoteInput) {
    try {
      await addDoc(collection(db, PATH), {
        name: clip(input.name, 100),
        email: clip(input.email, 100).toLowerCase(),
        phone: clip(input.phone, 40),
        business: clip(input.business, 120),
        industry: clip(input.industry, 120),
        website: clip(input.website, 200),
        goal: clip(input.goal, 80),
        timeline: clip(input.timeline, 80),
        budget: clip(input.budget, 80),
        details: clip(input.details, 2000),
        services: input.services.slice(0, 60).map(s => clip(s, 120)),
        lang: clip(input.lang, 5),
        status: 'nuevo',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, PATH);
    }
  },

  // Manda el resumen del pedido a tu mail. No frena el envío si falla.
  async notify(input: QuoteInput) {
    const body = {
      _subject: `Nuevo pedido de presupuesto · ${input.business || input.name}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: input.email,
      Nombre: input.name,
      Email: input.email,
      WhatsApp: input.phone || '—',
      Negocio: input.business || '—',
      Rubro: input.industry || '—',
      'Web o Instagram': input.website || '—',
      Objetivo: input.goal || '—',
      Plazo: input.timeline || '—',
      'Presupuesto aproximado': input.budget || '—',
      Servicios: input.services.join(' · '),
      Detalles: input.details || '—',
      'Ver en el panel': 'https://www.createdigital.com.ar/admin',
    };
    const response = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    return response.ok;
  },

  async getAllQuotes() {
    try {
      const q = query(collection(db, PATH), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Quote[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, PATH);
    }
  },

  async updateStatus(id: string, status: QuoteStatus) {
    try {
      await updateDoc(doc(db, PATH, id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${PATH}/${id}`);
    }
  },

  async deleteQuote(id: string) {
    try {
      await deleteDoc(doc(db, PATH, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${PATH}/${id}`);
    }
  },
};
