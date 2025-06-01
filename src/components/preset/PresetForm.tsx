"use client";

import { useState } from "react";
import { Preset, PresetFormData, PRESET_CATEGORIES } from "@/types/preset";

interface PresetFormProps {
  initialData?: Preset;
  onSubmit: (data: PresetFormData) => Promise<void>;
  onCancel: () => void;
}

export function PresetForm({ initialData, onSubmit, onCancel }: PresetFormProps) {
  const [formData, setFormData] = useState<PresetFormData>({
    name: initialData?.name || "",
    category: initialData?.category || "other",
    defaultSets: initialData?.defaultSets || 3,
    defaultWeight: initialData?.defaultWeight || 10,
    defaultReps: initialData?.defaultReps || 10,
    description: initialData?.description || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("プリセットの保存に失敗しました:", error);
      alert("プリセットの保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          種目名 *
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          カテゴリー *
        </label>
        <select
          id="category"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
        >
          {PRESET_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="defaultSets" className="block text-sm font-medium text-gray-700">
          デフォルトセット数 *
        </label>
        <input
          type="number"
          id="defaultSets"
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={formData.defaultSets}
          onChange={(e) => setFormData({ ...formData, defaultSets: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <label htmlFor="defaultWeight" className="block text-sm font-medium text-gray-700">
          デフォルト重量 (kg) *
        </label>
        <input
          type="number"
          id="defaultWeight"
          required
          min="0"
          step="0.5"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={formData.defaultWeight}
          onChange={(e) => setFormData({ ...formData, defaultWeight: parseFloat(e.target.value) })}
        />
      </div>

      <div>
        <label htmlFor="defaultReps" className="block text-sm font-medium text-gray-700">
          デフォルト回数 *
        </label>
        <input
          type="number"
          id="defaultReps"
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={formData.defaultReps}
          onChange={(e) => setFormData({ ...formData, defaultReps: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
} 