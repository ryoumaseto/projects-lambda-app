import { Preset, PresetFormData } from "@/types/preset";

export async function createPreset(data: PresetFormData): Promise<Preset> {
  const response = await fetch("/api/presets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("プリセットの作成に失敗しました");
  }

  return response.json();
}

export async function getPresets(): Promise<Preset[]> {
  const response = await fetch("/api/presets");

  if (!response.ok) {
    throw new Error("プリセットの取得に失敗しました");
  }

  return response.json();
}

export async function updatePreset(presetId: string, data: PresetFormData): Promise<void> {
  const response = await fetch(`/api/presets/${presetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("プリセットの更新に失敗しました");
  }
}

export async function deletePreset(presetId: string): Promise<void> {
  const response = await fetch(`/api/presets/${presetId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("プリセットの削除に失敗しました");
  }
} 