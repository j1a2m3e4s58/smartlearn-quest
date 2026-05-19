import { get as idbGet, set as idbSet } from "idb-keyval";
import { create } from "zustand";

export interface SaveData {
  userId: string;
  xp: number;
  coins: number;
  completedGames: string[];
  unlockedWorlds: string[];
  achievements: string[];
  timestamp: number;
}

const IDB_KEY = "smartlearn-save";
const LS_KEY = "smartlearn-save-fallback";

async function writeData(data: SaveData): Promise<void> {
  try {
    await idbSet(IDB_KEY, data);
  } catch {
    // IndexedDB unavailable — fall back to localStorage
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      // Storage unavailable; silently skip
    }
  }
}

async function readData(): Promise<SaveData | null> {
  try {
    const data = await idbGet<SaveData>(IDB_KEY);
    if (data) return data;
  } catch {
    // fall through to localStorage
  }
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as SaveData;
  } catch {
    // nothing recoverable
  }
  return null;
}

interface SaveState {
  lastSaved: number | null;
  isSaving: boolean;
  saveError: string | null;
}

interface SaveActions {
  saveProgress: (data: SaveData) => Promise<void>;
  loadProgress: () => Promise<SaveData | null>;
  autoSave: (data: SaveData) => void;
}

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

export const useSaveStore = create<SaveState & SaveActions>()((set, get) => ({
  lastSaved: null,
  isSaving: false,
  saveError: null,

  saveProgress: async (data) => {
    set({ isSaving: true, saveError: null });
    try {
      await writeData({ ...data, timestamp: Date.now() });
      set({ isSaving: false, lastSaved: Date.now() });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      set({ isSaving: false, saveError: message });
    }
  },

  loadProgress: async () => {
    return readData();
  },

  autoSave: (data) => {
    // Debounce: reset the 60s timer on each call
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      get().saveProgress(data);
    }, 60_000);
  },
}));
