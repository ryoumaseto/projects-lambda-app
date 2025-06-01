"use client";

import { Preset, PRESET_CATEGORIES } from "@/types/preset";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PresetListProps {
  presets: Preset[];
  onEdit: (preset: Preset) => void;
  onDelete: (preset: Preset) => void;
}

export function PresetList({ presets, onEdit, onDelete }: PresetListProps) {
  const getCategoryLabel = (value: string) => {
    const category = PRESET_CATEGORIES.find((c) => c.value === value);
    return category?.label || value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              種目名
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              カテゴリー
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              セット数
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              重量 (kg)
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              回数
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">アクション</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {presets.map((preset) => (
            <tr key={preset.presetId}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {preset.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {getCategoryLabel(preset.category)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {preset.defaultSets}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {preset.defaultWeight}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {preset.defaultReps}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(preset)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("このプリセットを削除してもよろしいですか？")) {
                        onDelete(preset);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {presets.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">
                プリセットが登録されていません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 