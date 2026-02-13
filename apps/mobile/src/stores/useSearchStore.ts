import { create } from "zustand";

type SearchState = {
  district: string | null;
  maxRent: number | null;
  setFilters: (district: string | null, maxRent: number | null) => void;
  clearFilters: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  district: null,
  maxRent: null,
  setFilters: (district, maxRent) => set({ district, maxRent }),
  clearFilters: () => set({ district: null, maxRent: null })
}));
