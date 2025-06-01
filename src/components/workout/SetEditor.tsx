"use client";

import { WorkoutSet } from "@/types/workout";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface SetEditorProps {
  sets: WorkoutSet[];
  defaultWeight?: number;
  onChange: (sets: WorkoutSet[]) => void;
}

export function SetEditor({ sets, defaultWeight = 10, onChange }: SetEditorProps) {
  const handleSetChange = (index: number, field: keyof WorkoutSet, value: string | number) => {
    const newSets = [...sets];
    newSets[index] = {
      ...newSets[index],
      [field]: typeof value === "string" ? value : Number(value),
    };
    onChange(newSets);
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: WorkoutSet = {
      weight: lastSet?.weight ?? defaultWeight,
      reps: lastSet?.reps ?? 10,
      memo: "",
    };
    onChange([...sets, newSet]);
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    onChange(newSets);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                セット
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                重量 (kg)
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                回数
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                メモ
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">アクション</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sets.map((set, index) => (
              <tr key={index}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={set.weight}
                    onChange={(e) => handleSetChange(index, "weight", e.target.value)}
                    className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    value={set.reps}
                    onChange={(e) => handleSetChange(index, "reps", e.target.value)}
                    className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    value={set.memo || ""}
                    onChange={(e) => handleSetChange(index, "memo", e.target.value)}
                    placeholder="メモ"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => removeSet(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addSet}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          セットを追加
        </button>
      </div>
    </div>
  );
} 