import { create } from 'zustand';
import { Diagram, PartialDiagramUpdate } from '../types';

interface DiagramState {
  diagrams: Diagram[];
  loading: boolean;
  error: string | null;
  fetchDiagrams: () => Promise<void>;
  getDiagram: (id: string) => Promise<void>; // 👈 Add this
  addDiagram: (title: string) => Promise<void>;
  updateDiagram: (id: string, update: PartialDiagramUpdate) => Promise<void>;
  deleteDiagram: (id: string) => Promise<void>;
}


export const useDiagramStore = create<DiagramState>(( set ) => ({
  diagrams: [],
  loading: false,
  error: null,

  fetchDiagrams: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:8080/diagrams');
      if (!res.ok) throw new Error('Failed to fetch diagrams');
      const data: Diagram[] = await res.json();
      set({ diagrams: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addDiagram: async (title) => {
    try {
      const res = await fetch('http://localhost:8080/diagrams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to add diagram');
      const newDiagram: Diagram = await res.json();
      set((state) => ({ diagrams: [newDiagram, ...state.diagrams] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  getDiagram: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`http://localhost:8080/diagrams/${id}`);
      if (!res.ok) throw new Error('Failed to fetch diagram');
      const fetchedDiagram: Diagram = await res.json();
      set((state) => ({
        diagrams: [
          ...state.diagrams.filter((d) => d.id !== id),
          fetchedDiagram,
        ],
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateDiagram: async (id, update) => {
    console.log(update)
    try {
      const res = await fetch(`http://localhost:8080/diagrams/${id}`, {
        method: 'PATCH', // or PUT if you replace the entire diagram
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error('Failed to update diagram');
      const updatedDiagram: Diagram = await res.json();
      set((state) => ({
        diagrams: state.diagrams.map((d) => (d.id === id ? updatedDiagram : d)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteDiagram: async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/diagrams/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete diagram');
      set((state) => ({
        diagrams: state.diagrams.filter((d) => d.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));