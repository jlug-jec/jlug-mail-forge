import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface Sheet {
  title: string;
  index: number;
}

interface SheetState {
  selectedSheet: string | null;
  sheetId: string | null;
  availableSheets: Sheet[];
  worksheetData: any[] | null;
  isLoading: boolean;
  error: string | null;
  setSelectedSheet: (sheetName: string | null) => void;
  setSheetId: (id: string | null) => void;
  setAvailableSheets: (sheets: Sheet[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSheets: (sheetId?: string) => Promise<void>;
  fetchWorksheetData: (worksheetName: string, sheetId?: string) => Promise<any[] | null>;
}

export const useSheetStore = create<SheetState>()(
  persist(
    (set, get) => ({
      selectedSheet: Cookies.get('selectedSheet') || null,
      sheetId: Cookies.get('sheetId') || null,
      availableSheets: JSON.parse(Cookies.get('availableSheets') || '[]'),
      worksheetData: null,
      isLoading: false,
      error: null,

      setSelectedSheet: (sheetName) => {
        set({ selectedSheet: sheetName });
        if (sheetName) {
          Cookies.set('selectedSheet', sheetName, { expires: 7 });
        } else {
          Cookies.remove('selectedSheet');
        }
      },

      setSheetId: (id) => {
        set({ sheetId: id });
        if (id) {
          Cookies.set('sheetId', id, { expires: 7 });
        } else {
          Cookies.remove('sheetId');
        }
      },

      setAvailableSheets: (sheets) => {
        set({ availableSheets: sheets });
        Cookies.set('availableSheets', JSON.stringify(sheets), { expires: 7 });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      fetchSheets: async (sheetId?: string) => {
        try {
          set({ isLoading: true, error: null });
          const params = new URLSearchParams();
          if (sheetId) params.append('sheetId', sheetId);
          
          const response = await fetch(`/api/sheets?${params}`);
          const data = await response.json();
          
          if (!response.ok) throw new Error(data.error || 'Failed to fetch sheets');
          
          set({ availableSheets: data.sheets });
          Cookies.set('availableSheets', JSON.stringify(data.sheets), { expires: 7 });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchWorksheetData: async (worksheetName: string, sheetId?: string) => {
        try {
          set({ isLoading: true, error: null });
          const params = new URLSearchParams({ worksheet: worksheetName });
          if (sheetId) params.append('sheetId', sheetId);
          
          const response = await fetch(`/api/sheets?${params}`);
          const data = await response.json();
          
          if (!response.ok) throw new Error(data.error || 'Failed to fetch worksheet data');
          return data.data;
        } catch (error) {
          set({ error: (error as Error).message });
          return null;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'sheet-storage',
    }
  )
);