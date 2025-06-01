"use client";

import { useState } from "react";
import { WorkoutExercise, WorkoutSet } from "@/types/workout";
import { Preset, PRESET_CATEGORIES } from "@/types/preset";
import { SetEditor } from "./SetEditor";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ExerciseEditorProps {
  exercise: WorkoutExercise;
  presets: Preset[];
  onUpdate: (exercise: WorkoutExercise) => void;
  onDelete: () => void;
}

export function ExerciseEditor({
  exercise,
  presets,
  onUpdate,
  onDelete,
}: ExerciseEditorProps) {
  const [isUsingPreset, setIsUsingPreset] = useState(!!exercise.presetId);

  const handlePresetChange = (presetId: string) => {
    if (!presetId) {
      setIsUsingPreset(false);
      onUpdate({
        ...exercise,
        presetId: undefined,
      });
      return;
    }

    const preset = presets.find((p) => p.presetId === presetId);
    if (!preset) return;

    setIsUsingPreset(true);
    onUpdate({
      ...exercise,
      presetId,
      name: preset.name,
      category: preset.category,
      sets: Array(preset.defaultSets).fill({
        weight: preset.defaultWeight,
        reps: preset.defaultReps,
        memo: "",
      }),
    });
  };

  const handleSetsChange = (sets: WorkoutSet[]) => {
    onUpdate({
      ...exercise,
      sets,
    });
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              プリセットを使用
            </label>
            <select
              value={exercise.presetId || ""}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">プリセットを選択...</option>
              {presets.map((preset) => (
                <option key={preset.presetId} value={preset.presetId}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {!isUsingPreset && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  種目名 *
                </label>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) =>
                    onUpdate({
                      ...exercise,
                      name: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  カテゴリー *
                </label>
                <select
                  value={exercise.category}
                  onChange={(e) =>
                    onUpdate({
                      ...exercise,
                      category: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {PRESET_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              メモ
            </label>
            <input
              type="text"
              value={exercise.memo || ""}
              onChange={(e) =>
                onUpdate({
                  ...exercise,
                  memo: e.target.value,
                })
              }
              placeholder="メモ"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="ml-4 text-red-600 hover:text-red-900"
        >
          <TrashIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          セット *
        </label>
        <SetEditor
          sets={exercise.sets}
          defaultWeight={
            exercise.presetId
              ? presets.find((p) => p.presetId === exercise.presetId)?.defaultWeight
              : undefined
          }
          onChange={handleSetsChange}
        />
      </div>
    </div>
  );
} 