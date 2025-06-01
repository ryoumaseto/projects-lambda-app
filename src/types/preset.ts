export type PresetCategory = "chest" | "back" | "legs" | "shoulders" | "arms" | "abs" | "other";

export interface Preset {
  userId: string;
  presetId: string;
  name: string;
  category: PresetCategory;
  defaultSets: number;
  defaultWeight: number;
  defaultReps: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PresetFormData {
  name: string;
  category: PresetCategory;
  defaultSets: number;
  defaultWeight: number;
  defaultReps: number;
  description?: string;
}

export const PRESET_CATEGORIES: { value: PresetCategory; label: string }[] = [
  { value: "chest", label: "胸" },
  { value: "back", label: "背中" },
  { value: "legs", label: "脚" },
  { value: "shoulders", label: "肩" },
  { value: "arms", label: "腕" },
  { value: "abs", label: "腹筋" },
  { value: "other", label: "その他" },
]; 