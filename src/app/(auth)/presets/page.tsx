"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Preset, PresetFormData } from "@/types/preset";
import { PresetForm } from "@/components/preset/PresetForm";
import { PresetList } from "@/components/preset/PresetList";
import { createPreset, getPresets, updatePreset, deletePreset } from "@/lib/services/preset";

export default function PresetsPage() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | undefined>();

  const loadPresets = async () => {
    try {
      const data = await getPresets();
      setPresets(data);
    } catch (error) {
      console.error("プリセットの取得に失敗しました:", error);
      alert("プリセットの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  const handleCreate = async (data: PresetFormData) => {
    try {
      await createPreset(data);
      setIsModalOpen(false);
      loadPresets();
    } catch (error) {
      console.error("プリセットの作成に失敗しました:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: PresetFormData) => {
    if (!editingPreset) return;
    try {
      await updatePreset(editingPreset.presetId, data);
      setIsModalOpen(false);
      setEditingPreset(undefined);
      loadPresets();
    } catch (error) {
      console.error("プリセットの更新に失敗しました:", error);
      throw error;
    }
  };

  const handleDelete = async (preset: Preset) => {
    try {
      await deletePreset(preset.presetId);
      loadPresets();
    } catch (error) {
      console.error("プリセットの削除に失敗しました:", error);
      alert("プリセットの削除に失敗しました");
    }
  };

  const handleEdit = (preset: Preset) => {
    setEditingPreset(preset);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPreset(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">プリセット管理</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          新規プリセット作成
        </button>
      </div>

      <PresetList
        presets={presets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-xl rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {editingPreset ? "プリセットの編集" : "新規プリセット作成"}
            </Dialog.Title>
            <PresetForm
              initialData={editingPreset}
              onSubmit={editingPreset ? handleUpdate : handleCreate}
              onCancel={handleModalClose}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 